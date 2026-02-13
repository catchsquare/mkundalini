import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NOTIFY_EMAILS = ["gouraff@gmail.com", "nitindent@gmail.com"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, form_type, treatment_interest, source } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const subject = `New ${form_type || "contact"} enquiry from ${name}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a5276; border-bottom: 2px solid #1a5276; padding-bottom: 10px;">
          New Lead Submission — Kundalini Dental Clinic
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name</td><td style="padding: 8px;">${name || "N/A"}</td></tr>
          <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;">${email || "N/A"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone</td><td style="padding: 8px;">${phone || "N/A"}</td></tr>
          <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; color: #555;">Form Type</td><td style="padding: 8px;">${form_type || "contact"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Treatment Interest</td><td style="padding: 8px;">${treatment_interest || "N/A"}</td></tr>
          <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; color: #555;">Source</td><td style="padding: 8px;">${source || "website"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Message</td><td style="padding: 8px;">${message || "No message provided"}</td></tr>
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">This is an automated notification from kundalinidentalclinic.com.np</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Kundalini Dental <onboarding@resend.dev>",
        to: NOTIFY_EMAILS,
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in notify-lead:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
