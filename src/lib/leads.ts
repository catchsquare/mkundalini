import { supabase } from "@/integrations/supabase/client";

interface LeadData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  source?: string;
  form_type?: string;
  treatment_interest?: string;
  metadata?: Record<string, any>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export async function submitLead(data: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    // Get UTM params from URL
    const urlParams = new URLSearchParams(window.location.search);
    
    const leadData = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      message: data.message || null,
      source: data.source || "website",
      form_type: data.form_type || "contact",
      treatment_interest: data.treatment_interest || null,
      status: "new",
      priority: "medium",
      metadata: data.metadata || null,
      utm_source: data.utm_source || urlParams.get("utm_source") || null,
      utm_medium: data.utm_medium || urlParams.get("utm_medium") || null,
      utm_campaign: data.utm_campaign || urlParams.get("utm_campaign") || null,
    };

    const { error } = await supabase.from("leads").insert([leadData]);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting lead:", error);
    return { success: false, error: error.message };
  }
}
