import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Notification recipients are configured via the NOTIFY_EMAILS env var (comma-separated).
const NOTIFY_EMAILS = (Deno.env.get("NOTIFY_EMAILS") || "gouraff@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

// Per-IP rate limiting: max 5 requests per 10 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
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
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { name, phone, issue } = body;
    // Backward-compat: accept either {slot_date, slot_time} or {date}
    const slot_date: string | undefined = body.slot_date;
    const slot_time: string | undefined = body.slot_time;
    const date_display: string | undefined = body.date_display || body.date;

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: "Name and phone are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input length validation
    if (String(name).length > 200 || String(phone).length > 50) {
      return new Response(
        JSON.stringify({ error: "Input too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (date_display && String(date_display).length > 200) {
      return new Response(
        JSON.stringify({ error: "Input too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (issue && String(issue).length > 1000) {
      return new Response(
        JSON.stringify({ error: "Input too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const MAX_CHAIRS = 2;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    // ===== Slot capacity check (2 dental chairs) =====
    if (slot_date && slot_time && dateRegex.test(slot_date) && timeRegex.test(slot_time) && supabaseUrl && serviceKey) {
      try {
        // Count confirmed appointments at this slot
        const apptUrl = `${supabaseUrl}/rest/v1/appointments?select=id&appointment_date=eq.${slot_date}&start_time=eq.${slot_time}:00&status=in.(scheduled,confirmed,in_progress)`;
        const apptRes = await fetch(apptUrl, {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            Prefer: "count=exact",
          },
        });
        const apptCountHeader = apptRes.headers.get("content-range") || "";
        const apptCount = parseInt(apptCountHeader.split("/")[1] || "0", 10) || 0;

        // Count pending AI leads requesting the same slot
        const leadUrl = `${supabaseUrl}/rest/v1/leads?select=id&form_type=eq.ai_booking&status=in.(new,contacted)&metadata->>slot_date=eq.${slot_date}&metadata->>slot_time=eq.${slot_time}`;
        const leadRes = await fetch(leadUrl, {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            Prefer: "count=exact",
          },
        });
        const leadCountHeader = leadRes.headers.get("content-range") || "";
        const leadCount = parseInt(leadCountHeader.split("/")[1] || "0", 10) || 0;

        if (apptCount + leadCount >= MAX_CHAIRS) {
          return new Response(
            JSON.stringify({
              error: "slot_full",
              message: `Sorry, that time slot is fully booked (we only have ${MAX_CHAIRS} dental chairs). Please choose another time.`,
            }),
            { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (capErr) {
        console.error("Slot capacity check failed:", capErr);
        // Fail-open: continue with booking but log the issue
      }
    }

    // 1. Save as a lead in the database (using anon key — RLS INSERT policy allows public inserts)
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            name: String(name).slice(0, 200),
            phone: String(phone).slice(0, 50),
            message: issue ? String(issue).slice(0, 1000) : null,
            source: "ai_assistant",
            form_type: "ai_booking",
            treatment_interest: issue ? String(issue).slice(0, 1000) : null,
            status: "new",
            priority: "high",
            metadata: {
              slot_date: slot_date && dateRegex.test(slot_date) ? slot_date : null,
              slot_time: slot_time && timeRegex.test(slot_time) ? slot_time : null,
              date_display: date_display ? String(date_display).slice(0, 200) : null,
            },
          }),
        });
      } catch (dbErr) {
        console.error("Failed to save lead to database:", dbErr);
      }
    }

    // 2. Send email notification via Resend
    if (RESEND_API_KEY) {
      const esc = (s: string | undefined | null) =>
        (s || "N/A").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #79b44e; color: white; padding: 16px 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 18px;">🦷 New AI Assistant Booking Request</h2>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Kundalini Dental Clinic</p>
          </div>
          <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555; width: 140px; border-bottom: 1px solid #f3f4f6;">👤 Name</td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6;">${esc(name)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555; border-bottom: 1px solid #f3f4f6;">📞 Phone</td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6;">${esc(phone)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555; border-bottom: 1px solid #f3f4f6;">📅 Preferred Date</td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6;">${esc(date_display || (slot_date && slot_time ? `${slot_date} ${slot_time}` : ""))}</td>
              </tr>
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">🩺 Issue</td>
                <td style="padding: 10px 8px;">${esc(issue)}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #fef9c3; border-radius: 6px; font-size: 13px; color: #854d0e;">
              ⚡ This booking was made via the <strong>AI Dental Assistant</strong> on your website. Please contact the patient to confirm.
            </div>
          </div>
          <p style="margin-top: 16px; font-size: 11px; color: #999; text-align: center;">
            Automated notification from kundalinidentalclinic.com.np
          </p>
        </div>
      `;

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Kundalini Dental <onboarding@resend.dev>",
            to: NOTIFY_EMAILS,
            subject: `🦷 AI Booking: ${String(name).slice(0, 100)} — ${date ? String(date).slice(0, 50) : "Date TBD"}`,
            html,
          }),
        });

        if (!res.ok) {
          const errData = await res.text();
          console.error("Resend API error:", errData);
        }
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }
    } else {
      console.log("RESEND_API_KEY not configured — lead saved to DB only.");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Webhook function error:", e);
    return new Response(
      JSON.stringify({ error: "Failed to process appointment" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});