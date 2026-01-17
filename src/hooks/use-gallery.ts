import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  before_image: string;
  after_image: string;
  category_id: string | null;
  is_featured: boolean;
  category?: { name: string; slug: string } | null;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
}

export function useGallery(options?: { featured?: boolean; categorySlug?: string; limit?: number }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, [options?.featured, options?.categorySlug, options?.limit]);

  const fetchGallery = async () => {
    try {
      let query = supabase
        .from("gallery_items")
        .select("id, title, description, before_image, after_image, category_id, is_featured, category:gallery_categories(name, slug)")
        .eq("is_visible", true)
        .order("is_featured", { ascending: false })
        .order("sort_order");

      if (options?.featured) {
        query = query.eq("is_featured", true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by category slug if provided
      let filteredData = data || [];
      if (options?.categorySlug && filteredData.length > 0) {
        filteredData = filteredData.filter(
          (item: any) => item.category?.slug === options.categorySlug
        );
      }

      setItems(filteredData as GalleryItem[]);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_categories")
        .select("id, name, slug")
        .order("sort_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching gallery categories:", error);
    }
  };

  return { items, categories, loading };
}
