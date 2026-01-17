import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  badge_text: string | null;
  cta_label: string | null;
  cta_link: string | null;
  image_url: string | null;
  image_alt: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  sort_order: number;
}

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  return { offers, loading, refetch: fetchOffers };
}
