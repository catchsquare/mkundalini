import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  highlight: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

export interface Service {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  short_description: string | null;
  price: string | null;
  comparison_price: string | null;
  duration: string | null;
  tourism_friendly: boolean;
  features: string[];
  image_url: string | null;
  image_alt: string | null;
  hero_badge: string | null;
  hero_title: string | null;
  hero_description: string | null;
  hero_image_url: string | null;
  body_content: string | null;
  faqs: Array<{ question: string; answer: string }>;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithCategory extends Service {
  category?: ServiceCategory;
}

export function useServiceCategories() {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as ServiceCategory[];
    },
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []).map(s => ({
        ...s,
        features: s.features || [],
        faqs: (s.faqs as any) || [],
      })) as Service[];
    },
  });
}

export function useServicesByCategory() {
  const categories = useServiceCategories();
  const services = useServices();

  const grouped = categories.data?.map(cat => ({
    ...cat,
    treatments: (services.data || []).filter(s => s.category_id === cat.id),
  })) || [];

  return {
    data: grouped,
    isLoading: categories.isLoading || services.isLoading,
    error: categories.error || services.error,
  };
}

export function useServiceBySlug(slug: string) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return {
        ...data,
        features: data.features || [],
        faqs: (data.faqs as any) || [],
      } as Service;
    },
    enabled: !!slug,
    // Unknown slugs must resolve to Not Found immediately, not after retries.
    retry: false,
  });
}
