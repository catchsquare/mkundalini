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

// Build a fresh date/time context for every request (Nepal time, UTC+05:45)
function buildDateContext(): string {
  const now = new Date();
  const nepalFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const isoFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const todayIso = isoFormatter.format(now); // YYYY-MM-DD
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowIso = isoFormatter.format(tomorrow);
  const nowTime = timeFormatter.format(now); // HH:MM
  const human = nepalFormatter.format(now);

  return `## CURRENT DATE & TIME (Nepal time, Asia/Kathmandu, UTC+05:45)
- Right now it is: **${human}**
- Today's date (ISO): **${todayIso}**
- Tomorrow's date (ISO): **${tomorrowIso}**
- Current time (24h): **${nowTime}**

CRITICAL RULES for date/time handling:
- ALWAYS use the date/time above as "now". Do NOT guess or use training data.
- When the user says relative words ("today", "tomorrow", "next Monday", "in 2 hours"), compute from the date above.
- "slot_date" in the booking JSON MUST be in YYYY-MM-DD format.
- "slot_time" MUST be HH:MM in 24-hour format (Nepal time). Convert "10am" → "10:00", "2:30 pm" → "14:30".
- The "date_display" field MUST exactly match the slot_date and slot_time you chose, written in friendly form (e.g., "Monday, May 4, 2026 at 10:00 AM").
- Before showing the appointment summary, double-check that slot_date, slot_time, and date_display all refer to the SAME moment.
- If the user gives an ambiguous date (e.g., "5/6"), ask them to clarify the day, month, and year.`;
}



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

**Booking lead time rule:**
- Routine appointments must be booked **at least 2 hours in advance**.
- **Emergencies** (severe pain, swelling, facial trauma, knocked-out tooth, uncontrolled bleeding) can be booked at the **earliest available slot**, even within 2 hours.
- If the user asks for a time within 2 hours and it's not an emergency, gently explain the 2-hour rule and ask them to pick a later time — or ask if it's an emergency.

If the user wants to book an appointment, collect the following one by one:
1. Full Name
2. Phone Number
3. Preferred Date (ask for a specific calendar date)
4. Preferred Time (ask for a specific time, e.g., 10:00 AM)
5. Brief description of the issue

Convert the date/time the user gives you into strict formats:
- "slot_date" = YYYY-MM-DD (e.g., 2026-05-10)
- "slot_time" = HH:MM in 24-hour format, Nepal time (e.g., 14:30)
If the user is vague (e.g., "tomorrow afternoon"), politely ask them for a specific date and time.

Set "is_emergency" to true ONLY if the user clearly describes an emergency (severe pain, swelling, trauma, bleeding). Otherwise set it to false.

Once you have ALL pieces of information, respond with EXACTLY this JSON block (the system will detect and process it):

\`\`\`appointment_booking
{
  "name": "...",
  "phone": "...",
  "slot_date": "YYYY-MM-DD",
  "slot_time": "HH:MM",
  "date_display": "human readable date & time",
  "issue": "...",
  "is_emergency": false
}
\`\`\`

Then say: "Here's your appointment summary:" and show the details in a nice format, then ask "Shall I confirm this appointment?"

If the user confirms, respond with EXACTLY:
\`\`\`confirm_appointment\`\`\`
Then say: "✅ Your appointment request has been sent! Our team at Kundalini Dental Clinic will contact you shortly to confirm. Thank you! 😊"

If the system tells you the slot is **fully booked** (both chairs taken) or the **lead time is too short**, apologize warmly, explain why, and ask the user to choose a different time (or confirm it's an emergency). Do NOT emit another booking JSON until they provide new info.

## FAQ RESPONSES
- **Root canal pain**: "Modern root canals are much more comfortable than people think! We use local anesthesia so you won't feel pain during the procedure. Most patients say it feels similar to getting a filling."
- **Prices**: Only quote the confirmed prices below (keep in sync with src/lib/pricing.ts). Always say the final cost is confirmed after examination. For any treatment not listed, do not guess a number; offer to get a quote on WhatsApp (+977-9802808008).
  - Metal braces: from NPR 60,000 (approx. US$400)
  - Ceramic braces: from NPR 70,000 (approx. US$470)
  - Clear aligners: from NPR 150,000 (approx. US$1,000)
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

    // Any OpenAI-compatible chat endpoint works. Default: Google Gemini's
    // OpenAI-compatible API (free tier available). Set in Supabase secrets:
    //   AI_API_KEY (required), AI_BASE_URL and AI_MODEL (optional).
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("GEMINI_API_KEY");
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL") ?? "https://generativelanguage.googleapis.com/v1beta/openai";
    const AI_MODEL = Deno.env.get("AI_MODEL") ?? "gemini-2.5-flash";

    const response = await fetch(
      `${AI_BASE_URL.replace(/\/$/, "")}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "system", content: buildDateContext() },
            // Strip any client-supplied system/tool roles to prevent prompt injection
            ...messages
              .filter((m: { role?: string }) => m?.role === "user" || m?.role === "assistant")
              .map((m: { role: string; content: unknown }) => ({
                role: m.role,
                content: String(m.content ?? ""),
              })),
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
      if (response.status === 402 || response.status === 403) {
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