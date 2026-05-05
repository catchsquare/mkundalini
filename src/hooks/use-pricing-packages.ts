import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PricingPackage {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: string;
  comparison_price: string | null;
  currency: string | null;
  period: string | null;
  features: string[] | null;
  is_popular: boolean;
  cta_label: string | null;
  cta_link: string | null;
  sort_order: number;
}

export function usePricingPackages() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("pricing_packages")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order");
        if (error) throw error;
        if (!cancelled) setPackages((data || []) as PricingPackage[]);
      } catch (e) {
        console.error("Error fetching pricing packages:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { packages, loading };
}
