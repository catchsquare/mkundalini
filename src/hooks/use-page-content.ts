import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface PageSection {
  id: string;
  section_type: string;
  content: Json;
  sort_order: number;
  is_visible: boolean;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: string;
  template: string | null;
  excerpt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  featured_image: string | null;
  sections: PageSection[];
}

export function usePageContent(slug: string) {
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch page by slug
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (pageError) {
          // Page not found in CMS, will use static fallback
          setPage(null);
          return;
        }

        // Fetch sections for this page
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('page_sections')
          .select('*')
          .eq('page_id', pageData.id)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true });

        if (sectionsError) throw sectionsError;

        setPage({
          ...pageData,
          sections: sectionsData || [],
        });
      } catch (err: any) {
        console.error('Error fetching page content:', err);
        setError(err.message);
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [slug]);

  // Helper to get section content by type
  const getSectionByType = (sectionType: string): Record<string, any> | null => {
    if (!page?.sections) return null;
    const section = page.sections.find(s => s.section_type === sectionType);
    if (!section?.content) return null;
    return section.content as Record<string, any>;
  };

  // Helper to get all sections of a type
  const getSectionsByType = (sectionType: string): Record<string, any>[] => {
    if (!page?.sections) return [];
    return page.sections
      .filter(s => s.section_type === sectionType)
      .map(s => s.content as Record<string, any>);
  };

  return {
    page,
    loading,
    error,
    getSectionByType,
    getSectionsByType,
  };
}

// Hook for fetching page metadata (SEO)
export function usePageMeta(slug: string) {
  const [meta, setMeta] = useState<{
    title: string;
    description: string;
    ogImage: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchMeta = async () => {
      const { data } = await supabase
        .from('pages')
        .select('seo_title, seo_description, og_image')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (data) {
        setMeta({
          title: data.seo_title || '',
          description: data.seo_description || '',
          ogImage: data.og_image,
        });
      }
    };

    fetchMeta();
  }, [slug]);

  return meta;
}
