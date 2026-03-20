import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const webhookUrl = Deno.env.get("DENTAL_ASSISTANT_WEBHOOK_URL");

    const payload = {
      clinic: "Kundalini Dental Clinic",
      source: "website_ai_assistant",
      name,
      phone,
      date: date || "Not specified",
      issue: issue || "General consultation",
      timestamp: new Date().toISOString(),
    };

    // Also save as a lead in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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
        // Continue — webhook is more important
      }
    }

    // Send to external webhook if configured
    if (webhookUrl) {
      try {
        const webhookResp = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!webhookResp.ok) {
          console.error("Webhook failed:", webhookResp.status, await webhookResp.text());
        }
      } catch (webhookErr) {
        console.error("Webhook error:", webhookErr);
        // Fail silently — user still sees success
      }
    } else {
      console.log("No DENTAL_ASSISTANT_WEBHOOK_URL configured. Lead saved to DB only.");
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
