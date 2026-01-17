import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Treatment {
  id: string;
  name: string;
  category: string;
  description: string | null;
  base_price: number;
  duration_minutes: number | null;
  is_active: boolean;
}

export function useTreatments(options?: { category?: string }) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreatments();
  }, [options?.category]);

  const fetchTreatments = async () => {
    try {
      let query = supabase
        .from("treatments")
        .select("*")
        .eq("is_active", true)
        .order("category")
        .order("name");

      if (options?.category) {
        query = query.eq("category", options.category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTreatments(data || []);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group treatments by category
  const treatmentsByCategory = treatments.reduce((acc, treatment) => {
    const category = treatment.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(treatment);
    return acc;
  }, {} as Record<string, Treatment[]>);

  return { treatments, treatmentsByCategory, loading };
}
