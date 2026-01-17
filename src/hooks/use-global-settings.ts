import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GlobalSettings {
  clinic_name: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  established_year: string;
  managing_director: string;
  managing_director_title: string;
  managing_director_experience: string;
  
  // Hours
  weekday_hours: string;
  saturday_hours: string;
  sunday_hours: string;
  
  // Social
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  
  // SEO
  default_seo_title: string;
  default_seo_description: string;
  
  // Features
  whatsapp_enabled: boolean;
  viber_enabled: boolean;
}

const defaultSettings: GlobalSettings = {
  clinic_name: "Kundalini Dental Clinic",
  address: "Goreto Bhawan, Chappal Karkhana, Kathmandu",
  phone: "+977-9802808008",
  email: "info@kundalinidentalclinic.com.np",
  whatsapp: "+9779802808008",
  established_year: "2023",
  managing_director: "Dr. Nitin Aryal",
  managing_director_title: "Managing Director",
  managing_director_experience: "15 years",
  weekday_hours: "9:00 AM - 6:00 PM",
  saturday_hours: "10:00 AM - 4:00 PM",
  sunday_hours: "Closed",
  facebook_url: "https://facebook.com/kundalinidental",
  instagram_url: "https://instagram.com/kundalinidental",
  linkedin_url: "https://linkedin.com/company/kundalinidental",
  default_seo_title: "Kundalini Dental Clinic | Quality Dental Care in Kathmandu",
  default_seo_description: "Led by Dr. Nitin Aryal with 15 years experience. Modern dental clinic in Kathmandu offering quality treatments at accessible prices.",
  whatsapp_enabled: true,
  viber_enabled: true,
};

export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("global_settings")
        .select("setting_key, setting_value")
        .eq("is_public", true);

      if (error) throw error;

      if (data && data.length > 0) {
        const settingsMap: Record<string, any> = {};
        data.forEach((item) => {
          settingsMap[item.setting_key] = item.setting_value;
        });

        setSettings({
          clinic_name: settingsMap.clinic_name || defaultSettings.clinic_name,
          address: settingsMap.address || defaultSettings.address,
          phone: settingsMap.phone || defaultSettings.phone,
          email: settingsMap.email || defaultSettings.email,
          whatsapp: settingsMap.whatsapp || defaultSettings.whatsapp,
          established_year: settingsMap.established_year || defaultSettings.established_year,
          managing_director: settingsMap.managing_director || defaultSettings.managing_director,
          managing_director_title: settingsMap.managing_director_title || defaultSettings.managing_director_title,
          managing_director_experience: settingsMap.managing_director_experience || defaultSettings.managing_director_experience,
          weekday_hours: settingsMap.weekday_hours || defaultSettings.weekday_hours,
          saturday_hours: settingsMap.saturday_hours || defaultSettings.saturday_hours,
          sunday_hours: settingsMap.sunday_hours || defaultSettings.sunday_hours,
          facebook_url: settingsMap.facebook_url || defaultSettings.facebook_url,
          instagram_url: settingsMap.instagram_url || defaultSettings.instagram_url,
          linkedin_url: settingsMap.linkedin_url || defaultSettings.linkedin_url,
          default_seo_title: settingsMap.default_seo_title || defaultSettings.default_seo_title,
          default_seo_description: settingsMap.default_seo_description || defaultSettings.default_seo_description,
          whatsapp_enabled: settingsMap.whatsapp_enabled ?? defaultSettings.whatsapp_enabled,
          viber_enabled: settingsMap.viber_enabled ?? defaultSettings.viber_enabled,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading };
}
