import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  patient_name: string;
  patient_location: string | null;
  content: string;
  rating: number;
  treatment_type: string | null;
  is_featured: boolean;
  video_url: string | null;
  display_date: string | null;
}

export function useTestimonials(options?: { featured?: boolean; limit?: number }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, [options?.featured, options?.limit]);

  const fetchTestimonials = async () => {
    try {
      let query = supabase
        .from("testimonials")
        .select("id, patient_name, patient_location, content, rating, treatment_type, is_featured, video_url, display_date")
        .eq("status", "approved")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (options?.featured) {
        query = query.eq("is_featured", true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  return { testimonials, loading };
}
