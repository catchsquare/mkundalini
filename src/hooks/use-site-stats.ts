import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteStat {
  id: string;
  page_slug: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
  sort_order: number;
}

export function useSiteStats(pageSlug: string) {
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("site_stats")
          .select("*")
          .eq("page_slug", pageSlug)
          .eq("is_visible", true)
          .order("sort_order");
        if (error) throw error;
        if (!cancelled) setStats((data || []) as SiteStat[]);
      } catch (e) {
        console.error("Error fetching site stats:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageSlug]);

  return { stats, loading };
}
