import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  last_updated: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

export function useLegalPage(slug: string) {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("legal_pages")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .maybeSingle();
        if (error) throw error;
        if (!cancelled) setPage((data as LegalPage) || null);
      } catch (e) {
        console.error("Error fetching legal page:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { page, loading };
}
