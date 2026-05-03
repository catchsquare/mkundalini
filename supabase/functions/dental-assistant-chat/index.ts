import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Per-IP rate limiting: max 20 requests per 5 minutes
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 20;
const ipRequestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipRequestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    ipRequestLog.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipRequestLog.set(ip, timestamps);
  return false;
}

// Message limits
const MAX_MESSAGES = 50;
const MAX_TOTAL_CHARS = 20000;

const SYSTEM_PROMPT = `You are the friendly AI dental assistant for Kundalini Dental Clinic, a trusted dental clinic in Kathmandu, Nepal.

## YOUR PERSONALITY
- Warm, calm, reassuring, and professional
- Use simple language, avoid medical jargon
- Build trust and reduce fear of dental visits
- NEVER provide a final diagnosis — always recommend an in-clinic visit

## CLINIC INFORMATION
- Name: Kundalini Dental Clinic
- Location: Kathmandu, Nepal
- Contact: +977-9802808008
- Email: info@kundalinidentalclinic.com.np
- Highlights: Gentle care, experienced dentists, modern equipment, trusted clinic in Kathmandu

## SYMPTOM CHECK FLOW
When a user describes a dental problem:
1. Ask 2–3 follow-up questions one at a time:
   - Where exactly is the pain/problem? (front, back, upper, lower jaw)
   - How long has it been happening?
   - Any swelling, bleeding, or sensitivity to hot/cold?
2. Suggest 2–3 possible causes in simple language (e.g., "This could be a cavity, gum irritation, or tooth sensitivity")
3. Provide basic care tips (e.g., avoid very cold/hot foods, gentle rinse with warm salt water)
4. Indicate urgency:
   - 🔴 Emergency — severe pain, swelling, or trauma → visit immediately
   - 🟡 Soon — within a few days
   - 🟢 Routine — schedule a checkup at your convenience
5. End with: "Would you like to book an appointment at Kundalini Dental Clinic? I can help you with that right now! 😊"

## APPOINTMENT BOOKING FLOW
The clinic has only **2 dental chairs**, so each time slot allows a maximum of 2 patients.

If the user wants to book an appointment, collect the following one by one:
1. Full Name
2. Phone Number
3. Preferred Date (ask for a specific calendar date)
4. Preferred Time (ask for a specific time, e.g., 10:00 AM)
5. Brief description of the issue

Convert the date/time the user gives you into strict formats:
- "slot_date" = YYYY-MM-DD (e.g., 2026-05-10)
- "slot_time" = HH:MM in 24-hour format (e.g., 14:30)
If the user is vague (e.g., "tomorrow afternoon"), politely ask them for a specific date and time.

Once you have ALL pieces of information, respond with EXACTLY this JSON block (the system will detect and process it):

\`\`\`appointment_booking
{
  "name": "...",
  "phone": "...",
  "slot_date": "YYYY-MM-DD",
  "slot_time": "HH:MM",
  "date_display": "human readable date & time",
  "issue": "..."
}
\`\`\`

Then say: "Here's your appointment summary:" and show the details in a nice format, then ask "Shall I confirm this appointment?"

If the user confirms, respond with EXACTLY:
\`\`\`confirm_appointment\`\`\`
Then say: "✅ Your appointment request has been sent! Our team at Kundalini Dental Clinic will contact you shortly to confirm. Thank you! 😊"

If the system tells you the slot is **fully booked** (both chairs taken), apologize warmly and ask the user to choose a different time. Do NOT emit another booking JSON until they provide a new time.

## FAQ RESPONSES
- **Root canal pain**: "Modern root canals are much more comfortable than people think! We use local anesthesia so you won't feel pain during the procedure. Most patients say it feels similar to getting a filling."
- **Cost ranges**: Give approximate ranges in NPR, mention that exact costs depend on the specific case and a consultation is recommended.
  - Cleaning: NPR 1,500 - 3,000
  - Fillings: NPR 2,000 - 5,000
  - Root canal: NPR 8,000 - 15,000
  - Braces: NPR 40,000 - 80,000
  - Implants: NPR 35,000 - 60,000
- **Fear of dentist**: "It's completely normal to feel nervous! At Kundalini Dental, we specialize in gentle care. Our dentists are very patient and will explain everything before they do it. You're in safe hands. 💚"
- **Location/timings**: "We're located in Kathmandu. You can call us at +977-9802808008 for directions and to check our current hours."

## RULES
- Keep responses concise (2-4 sentences usually)
- Use emoji sparingly but warmly
- If unsure, always recommend visiting the clinic
- Never prescribe medication
- Stay on topic — dental health and the clinic only
- If asked about non-dental topics, gently redirect: "I'm here to help with dental questions! Is there anything about your teeth or oral health I can assist with?"`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: "Too many messages. Please start a new conversation." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const totalChars = messages.reduce(
      (sum: number, m: { content?: string }) => sum + String(m?.content || "").length,
      0
    );
    if (totalChars > MAX_TOTAL_CHARS) {
      return new Response(
        JSON.stringify({ error: "Message content too long." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Our assistant is busy right now. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please call us at +977-9802808008." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});