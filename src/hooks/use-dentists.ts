import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Dentist {
  id: string;
  specialization: string | null;
  license_number: string | null;
  is_available: boolean;
  profile: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
  } | null;
}

export function useDentists() {
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    try {
      const { data, error } = await supabase
        .from("dentists")
        .select(`
          id,
          specialization,
          license_number,
          is_available,
          profile:profiles(id, full_name, email, phone, avatar_url)
        `)
        .eq("is_available", true);

      if (error) throw error;
      setDentists((data as unknown as Dentist[]) || []);
    } catch (error) {
      console.error("Error fetching dentists:", error);
    } finally {
      setLoading(false);
    }
  };

  return { dentists, loading };
}
