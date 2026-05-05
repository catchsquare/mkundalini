import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ContentBlock {
  id: string;
  page_slug: string;
  block_key: string;
  title: string | null;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  image_alt: string | null;
  link_label: string | null;
  link_url: string | null;
  sort_order: number;
  metadata: Record<string, any> | null;
}

/**
 * Fetch content blocks for a given page (and optionally a single block_key).
 * Returned ordered by sort_order. Visible only.
 */
export function useContentBlocks(pageSlug: string, blockKey?: string) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let q = supabase
          .from("content_blocks")
          .select("*")
          .eq("page_slug", pageSlug)
          .eq("is_visible", true)
          .order("block_key")
          .order("sort_order");
        if (blockKey) q = q.eq("block_key", blockKey);
        const { data, error } = await q;
        if (error) throw error;
        if (!cancelled) setBlocks((data || []) as ContentBlock[]);
      } catch (e) {
        console.error("Error fetching content blocks:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageSlug, blockKey]);

  /** Return blocks for a specific key (when hook fetched the whole page). */
  const byKey = (key: string) =>
    blocks.filter((b) => b.block_key === key);

  return { blocks, byKey, loading };
}
