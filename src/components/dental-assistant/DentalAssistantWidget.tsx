import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dental-assistant-chat`;
const WEBHOOK_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dental-assistant-webhook`;

export function DentalAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Record<string, string> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const promptTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Auto-prompt after 3 seconds (faster to grab attention)
  useEffect(() => {
    promptTimerRef.current = setTimeout(() => {
      setShowPrompt(true);
    }, 3000);
    return () => clearTimeout(promptTimerRef.current);
  }, []);

  // Scroll to bottom on new messages (but not for the initial welcome message)
  useEffect(() => {
    if (scrollRef.current && messages.length > 1) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } else if (scrollRef.current && messages.length === 1) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const processAssistantMessage = useCallback((content: string) => {
    // Check for appointment booking data
    const bookingMatch = content.match(/```appointment_booking\s*\n?([\s\S]*?)\n?```/);
    if (bookingMatch) {
      try {
        const booking = JSON.parse(bookingMatch[1]);
        setPendingBooking(booking);
      } catch { /* ignore parse errors */ }
    }

    // Check for confirmation trigger
    if (content.includes("```confirm_appointment```") && pendingBooking) {
      // Fire webhook
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(pendingBooking),
      }).catch(() => {
        // Fail silently — user sees success message from AI
      });
      setPendingBooking(null);
    }
  }, [pendingBooking]);

  const streamChat = useCallback(async (allMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error("Stream failed");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantSoFar = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantSoFar += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
              }
              return [...prev, { role: "assistant", content: assistantSoFar }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantSoFar += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
              }
              return [...prev, { role: "assistant", content: assistantSoFar }];
            });
          }
        } catch { /* ignore */ }
      }
    }

    // Process completed message for booking data
    processAssistantMessage(assistantSoFar);
  }, [processAssistantMessage]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (e) {
      console.error("Chat error:", e);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again or call us at +977-9802808008. 📞" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setShowPrompt(false);
    clearTimeout(promptTimerRef.current);
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hi there! 👋 Welcome to **Kundalini Dental Clinic**. I can help you:\n\n🔹 **Book an appointment** right here in chat\n🔹 Answer dental questions\n🔹 Guide you on treatments & pricing\n\nHow can I help you today? 😊",
        },
      ]);
    }
  };

  // Clean displayed content (remove booking JSON blocks)
  const cleanContent = (content: string) => {
    return content
      .replace(/```appointment_booking[\s\S]*?```/g, "")
      .replace(/```confirm_appointment```/g, "")
      .trim();
  };

  return (
    <>
      {/* Floating prompt bubble */}
      {showPrompt && !isOpen && (
        <div
          className="fixed bottom-20 sm:bottom-[88px] right-4 z-[9998] max-w-[260px] sm:max-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-700 cursor-pointer"
          onClick={openChat}
        >
          <div className="bg-white rounded-2xl rounded-br-sm shadow-2xl border border-primary/20 px-4 py-3.5 text-sm text-foreground relative">
            <div className="font-medium">👋 Need dental help?</div>
            <div className="text-muted-foreground text-xs mt-1">Chat with our AI — get answers & <span className="font-semibold text-primary">book appointments instantly!</span></div>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-primary/20 rotate-45" />
          </div>
        </div>
      )}

      {/* Chat bubble button — large & eye-catching */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="group fixed bottom-4 right-4 z-[9999] flex items-center gap-2.5 bg-primary text-primary-foreground shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 active:scale-95 rounded-full px-4 py-3 sm:pl-5 sm:pr-6 sm:py-3.5"
          aria-label="Open dental assistant chat"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/30 opacity-60" style={{ animationDuration: '2.5s' }} />
          
          <div className="relative flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-base sm:text-lg shrink-0">
              🦷
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-bold leading-tight">AI Dental Assistant</div>
              <div className="text-[10px] sm:text-[11px] opacity-80">Book appointments & ask questions</div>
            </div>
          </div>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 z-[9999] w-full sm:w-[370px] sm:max-w-[calc(100vw-2rem)] h-[100dvh] sm:h-[560px] sm:max-h-[calc(100vh-2rem)] flex flex-col bg-white sm:rounded-2xl shadow-2xl border border-border/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-lg">
              🦷
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">Kundalini Dental</p>
              <p className="text-xs opacity-80">AI Dental Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => {
              const cleaned = msg.role === "assistant" ? cleanContent(msg.content) : msg.content;
              if (!cleaned) return null;
              return (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&>p]:m-0 [&>p+p]:mt-1.5 [&>ul]:my-1 [&>ol]:my-1">
                        <ReactMarkdown>{cleaned}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="m-0 whitespace-pre-wrap">{cleaned}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-border/50 px-3 py-2.5">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 resize-none bg-muted/50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30 max-h-24 min-h-[36px]"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-primary/90 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-1.5 opacity-60">
              AI assistant · Not a substitute for professional diagnosis
            </p>
          </div>
        </div>
      )}
    </>
  );
}
