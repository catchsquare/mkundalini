import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Same recipients as notify-lead (Resend free tier limitation)
const NOTIFY_EMAILS = ["gouraff@gmail.com"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, date, issue } = await req.json();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: "Name and phone are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    // 1. Save as a lead in the database
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
            name,
            phone,
            message: issue || null,
            source: "ai_assistant",
            form_type: "ai_booking",
            treatment_interest: issue || null,
            status: "new",
            priority: "high",
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
                <td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6;">${esc(date)}</td>
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
            subject: `🦷 AI Booking: ${name} — ${date || "Date TBD"}`,
            html,
          }),
        });

        if (!res.ok) {
          const errData = await res.text();
          console.error("Resend API error:", errData);
        }
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
        // Fail silently — lead is already saved
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
