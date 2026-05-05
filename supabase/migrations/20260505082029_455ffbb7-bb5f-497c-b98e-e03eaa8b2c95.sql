
-- 1. FAQs
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  page_slug text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible faqs" ON public.faqs FOR SELECT USING (is_visible = true);
CREATE POLICY "CMS users can manage faqs" ON public.faqs FOR ALL TO authenticated USING (has_cms_access(auth.uid())) WITH CHECK (has_cms_access(auth.uid()));
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Hero slides
CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text,
  image_alt text,
  cta_label text,
  cta_link text,
  secondary_cta_label text,
  secondary_cta_link text,
  badge_text text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible slides" ON public.hero_slides FOR SELECT USING (is_visible = true);
CREATE POLICY "CMS users can manage slides" ON public.hero_slides FOR ALL TO authenticated USING (has_cms_access(auth.uid())) WITH CHECK (has_cms_access(auth.uid()));
CREATE TRIGGER hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Content blocks (generic repeatable items)
CREATE TABLE public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  block_key text NOT NULL,
  title text,
  description text,
  icon text,
  image_url text,
  image_alt text,
  link_label text,
  link_url text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_blocks_lookup ON public.content_blocks(page_slug, block_key, sort_order);
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible blocks" ON public.content_blocks FOR SELECT USING (is_visible = true);
CREATE POLICY "CMS users can manage blocks" ON public.content_blocks FOR ALL TO authenticated USING (has_cms_access(auth.uid())) WITH CHECK (has_cms_access(auth.uid()));
CREATE TRIGGER content_blocks_updated_at BEFORE UPDATE ON public.content_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Stats
CREATE TABLE public.site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  label text NOT NULL,
  value text NOT NULL,
  suffix text,
  icon text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible stats" ON public.site_stats FOR SELECT USING (is_visible = true);
CREATE POLICY "CMS users can manage stats" ON public.site_stats FOR ALL TO authenticated USING (has_cms_access(auth.uid())) WITH CHECK (has_cms_access(auth.uid()));
CREATE TRIGGER site_stats_updated_at BEFORE UPDATE ON public.site_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Pricing packages
CREATE TABLE public.pricing_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  price text NOT NULL,
  comparison_price text,
  currency text DEFAULT 'NPR',
  period text,
  description text,
  features text[] DEFAULT '{}',
  cta_label text DEFAULT 'Book Now',
  cta_link text DEFAULT '/contact',
  is_popular boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible packages" ON public.pricing_packages FOR SELECT USING (is_visible = true);
CREATE POLICY "CMS users can manage packages" ON public.pricing_packages FOR ALL TO authenticated USING (has_cms_access(auth.uid())) WITH CHECK (has_cms_access(auth.uid()));
CREATE TRIGGER pricing_packages_updated_at BEFORE UPDATE ON public.pricing_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Legal pages
CREATE TABLE public.legal_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  last_updated date DEFAULT CURRENT_DATE,
  is_published boolean DEFAULT true,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published legal pages" ON public.legal_pages FOR SELECT USING (is_published = true);
CREATE POLICY "CMS users can manage legal pages" ON public.legal_pages FOR ALL TO authenticated USING (has_cms_access(auth.uid())) WITH CHECK (has_cms_access(auth.uid()));
CREATE TRIGGER legal_pages_updated_at BEFORE UPDATE ON public.legal_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
