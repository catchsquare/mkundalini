import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HeroSlide {
  id: string;
  page_slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  badge_text: string | null;
  cta_label: string | null;
  cta_link: string | null;
  secondary_cta_label: string | null;
  secondary_cta_link: string | null;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number;
}

/** Fetches the first visible hero slide for a given page slug. */
export function useHeroSlide(pageSlug: string) {
  const [slide, setSlide] = useState<HeroSlide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("hero_slides")
          .select("*")
          .eq("page_slug", pageSlug)
          .eq("is_visible", true)
          .order("sort_order")
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        if (!cancelled) setSlide((data as HeroSlide) || null);
      } catch (e) {
        console.error("Error fetching hero slide:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageSlug]);

  return { slide, loading };
}
