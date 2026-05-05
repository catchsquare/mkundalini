import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  page_slug: string | null;
  sort_order: number;
}

/** Fetches visible FAQs, optionally filtered by page slug. */
export function useFaqs(pageSlug?: string) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let q = supabase
          .from("faqs")
          .select("*")
          .eq("is_visible", true)
          .order("category")
          .order("sort_order");
        if (pageSlug) q = q.eq("page_slug", pageSlug);
        const { data, error } = await q;
        if (error) throw error;
        if (!cancelled) setFaqs((data || []) as Faq[]);
      } catch (e) {
        console.error("Error fetching FAQs:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageSlug]);

  /** Group FAQs by their category label. */
  const grouped = faqs.reduce<Record<string, Faq[]>>((acc, f) => {
    const key = f.category || "General";
    (acc[key] = acc[key] || []).push(f);
    return acc;
  }, {});

  return { faqs, grouped, loading };
}
