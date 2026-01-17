import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  featured_image: string | null;
  category_id: string | null;
  is_featured: boolean;
  tags: string[] | null;
  published_at: string | null;
  category?: { name: string; slug: string } | null;
  author?: { full_name: string } | null;
}

export function useBlogPosts(options?: { featured?: boolean; limit?: number; categorySlug?: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [options?.featured, options?.limit, options?.categorySlug]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from("blog_posts")
        .select(`
          id, title, slug, excerpt, content, featured_image, category_id, is_featured, tags, published_at,
          category:blog_categories(name, slug),
          author:profiles(full_name)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

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
          (post: any) => post.category?.slug === options.categorySlug
        );
      }

      setPosts(filteredData as BlogPost[]);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          id, title, slug, excerpt, content, featured_image, category_id, is_featured, tags, published_at, views_count,
          category:blog_categories(name, slug),
          author:profiles(full_name)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      setPost(data as BlogPost);

      // Increment views
      if (data) {
        await supabase
          .from("blog_posts")
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq("id", data.id);
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  return { post, loading };
}
