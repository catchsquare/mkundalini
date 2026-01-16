
-- =============================================
-- CMS DATABASE SCHEMA FOR KUNDALINI DENTAL CLINIC
-- =============================================

-- 1. Create app_role enum for role-based access (if not exists)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'manager', 'receptionist', 'dentist', 'content_editor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create user_roles table for proper role management
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Helper function to check if user has any admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role IN ('super_admin', 'admin')
    )
$$;

-- Helper function to check if user has CMS access
CREATE OR REPLACE FUNCTION public.has_cms_access(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role IN ('super_admin', 'admin', 'content_editor')
    )
$$;

-- Helper function to check if user is staff (any authenticated role)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id
    )
$$;

-- =============================================
-- CMS TABLES
-- =============================================

-- 4. Pages table for CMS
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB DEFAULT '[]'::jsonb,
    excerpt TEXT,
    featured_image TEXT,
    template TEXT DEFAULT 'default',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    og_image TEXT,
    canonical_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Page sections for page builder
CREATE TABLE public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
    section_type TEXT NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    sort_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Blog categories
CREATE TABLE public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES public.blog_categories(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Blog posts
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB DEFAULT '[]'::jsonb,
    excerpt TEXT,
    featured_image TEXT,
    category_id UUID REFERENCES public.blog_categories(id),
    tags TEXT[],
    author_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    og_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Leads / Contact form submissions
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'phone', 'walkin', 'referral', 'social', 'other')),
    form_type TEXT DEFAULT 'contact',
    message TEXT,
    treatment_interest TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES public.profiles(id),
    converted_patient_id UUID REFERENCES public.patients(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Lead activities for follow-up tracking
CREATE TABLE public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('note', 'call', 'email', 'meeting', 'whatsapp', 'status_change', 'assignment')),
    description TEXT,
    outcome TEXT,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Testimonials
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id),
    patient_name TEXT NOT NULL,
    patient_location TEXT,
    patient_avatar TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    treatment_type TEXT,
    video_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    source TEXT DEFAULT 'internal' CHECK (source IN ('internal', 'google', 'facebook', 'trustpilot')),
    external_id TEXT,
    display_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Gallery categories
CREATE TABLE public.gallery_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. Gallery items (before/after photos)
CREATE TABLE public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    before_image TEXT NOT NULL,
    after_image TEXT NOT NULL,
    category_id UUID REFERENCES public.gallery_categories(id),
    treatment_id UUID REFERENCES public.treatments(id),
    patient_id UUID REFERENCES public.patients(id),
    dentist_id UUID REFERENCES public.dentists(id),
    tags TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    consent_obtained BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 13. Navigation items for menu builder
CREATE TABLE public.navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location TEXT NOT NULL CHECK (location IN ('main', 'footer', 'mobile', 'sidebar')),
    label TEXT NOT NULL,
    url TEXT,
    page_id UUID REFERENCES public.pages(id),
    parent_id UUID REFERENCES public.navigation_items(id),
    icon TEXT,
    target TEXT DEFAULT '_self' CHECK (target IN ('_self', '_blank')),
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 14. Global settings
CREATE TABLE public.global_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    setting_group TEXT DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 15. Working hours
CREATE TABLE public.working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    break_start TIME,
    break_end TIME,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(day_of_week)
);

-- 16. Audit logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 17. Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    category TEXT DEFAULT 'system',
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_status ON public.pages(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_assigned ON public.leads(assigned_to);
CREATE INDEX idx_leads_created ON public.leads(created_at DESC);
CREATE INDEX idx_lead_activities_lead ON public.lead_activities(lead_id);
CREATE INDEX idx_testimonials_status ON public.testimonials(status);
CREATE INDEX idx_testimonials_featured ON public.testimonials(is_featured);
CREATE INDEX idx_gallery_items_category ON public.gallery_items(category_id);
CREATE INDEX idx_navigation_items_location ON public.navigation_items(location);
CREATE INDEX idx_global_settings_key ON public.global_settings(setting_key);
CREATE INDEX idx_global_settings_group ON public.global_settings(setting_group);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- User Roles policies
CREATE POLICY "Admins can manage user roles" ON public.user_roles
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Pages policies (CMS access required for edit, public can view published)
CREATE POLICY "Public can view published pages" ON public.pages
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "CMS users can manage pages" ON public.pages
    FOR ALL TO authenticated
    USING (public.has_cms_access(auth.uid()));

-- Page Sections policies
CREATE POLICY "Public can view sections of published pages" ON public.page_sections
    FOR SELECT TO anon, authenticated
    USING (EXISTS (SELECT 1 FROM public.pages WHERE id = page_id AND status = 'published'));

CREATE POLICY "CMS users can manage page sections" ON public.page_sections
    FOR ALL TO authenticated
    USING (public.has_cms_access(auth.uid()));

-- Blog Categories policies
CREATE POLICY "Anyone can view blog categories" ON public.blog_categories
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "CMS users can manage blog categories" ON public.blog_categories
    FOR ALL TO authenticated
    USING (public.has_cms_access(auth.uid()));

-- Blog Posts policies
CREATE POLICY "Public can view published posts" ON public.blog_posts
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "CMS users can manage blog posts" ON public.blog_posts
    FOR ALL TO authenticated
    USING (public.has_cms_access(auth.uid()));

-- Leads policies (staff only)
CREATE POLICY "Staff can view leads" ON public.leads
    FOR SELECT TO authenticated
    USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage leads" ON public.leads
    FOR ALL TO authenticated
    USING (public.is_staff(auth.uid()));

-- Allow anonymous lead creation (for contact forms)
CREATE POLICY "Anyone can submit leads" ON public.leads
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Lead Activities policies
CREATE POLICY "Staff can view lead activities" ON public.lead_activities
    FOR SELECT TO authenticated
    USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage lead activities" ON public.lead_activities
    FOR ALL TO authenticated
    USING (public.is_staff(auth.uid()));

-- Testimonials policies
CREATE POLICY "Public can view approved testimonials" ON public.testimonials
    FOR SELECT TO anon, authenticated
    USING (status = 'approved');

CREATE POLICY "CMS users can manage testimonials" ON public.testimonials
    FOR ALL TO authenticated
    USING (public.has_cms_access(auth.uid()));

-- Gallery Categories policies
CREATE POLICY "Anyone can view gallery categories" ON public.gallery_categories
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "CMS users can manage gallery categories" ON public.gallery_categories
    FOR ALL TO authenticated
    USING (public.has_cms_access(auth.uid()));

-- Gallery Items policies
CREATE POLICY "Public can view visible gallery items" ON public.gallery_items
    FOR SELECT TO anon, authenticated
    USING (is_visible = true);

CREATE POLICY "CMS users can manage gallery items" ON public.gallery_items
    FOR ALL TO authenticated
    USING (public.has_cms_access(auth.uid()));

-- Navigation Items policies
CREATE POLICY "Anyone can view visible navigation" ON public.navigation_items
    FOR SELECT TO anon, authenticated
    USING (is_visible = true);

CREATE POLICY "CMS users can manage navigation" ON public.navigation_items
    FOR ALL TO authenticated
    USING (public.has_cms_access(auth.uid()));

-- Global Settings policies
CREATE POLICY "Anyone can view public settings" ON public.global_settings
    FOR SELECT TO anon, authenticated
    USING (is_public = true);

CREATE POLICY "Admins can view all settings" ON public.global_settings
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage settings" ON public.global_settings
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()));

-- Working Hours policies
CREATE POLICY "Anyone can view working hours" ON public.working_hours
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage working hours" ON public.working_hours
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()));

-- Audit Logs policies (admins only, no delete)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "System can manage notifications" ON public.notifications
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()));

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_navigation_items_updated_at BEFORE UPDATE ON public.navigation_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_global_settings_updated_at BEFORE UPDATE ON public.global_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_working_hours_updated_at BEFORE UPDATE ON public.working_hours FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- SEED DEFAULT DATA
-- =============================================

-- Default working hours (Sunday-Saturday, 0-6)
INSERT INTO public.working_hours (day_of_week, open_time, close_time, is_closed) VALUES
(0, '10:00', '17:00', false),  -- Sunday
(1, '09:00', '18:00', false),  -- Monday
(2, '09:00', '18:00', false),  -- Tuesday
(3, '09:00', '18:00', false),  -- Wednesday
(4, '09:00', '18:00', false),  -- Thursday
(5, '09:00', '18:00', false),  -- Friday
(6, '10:00', '16:00', false);  -- Saturday

-- Default global settings
INSERT INTO public.global_settings (setting_key, setting_value, setting_group, is_public, description) VALUES
('site_name', '"Kundalini Dental Clinic"', 'general', true, 'Website name'),
('site_tagline', '"Your Smile, Our Priority"', 'general', true, 'Website tagline'),
('logo_url', '""', 'branding', true, 'Main logo URL'),
('logo_dark_url', '""', 'branding', true, 'Dark mode logo URL'),
('favicon_url', '""', 'branding', true, 'Favicon URL'),
('primary_phone', '"+977-9802808008"', 'contact', true, 'Primary contact number'),
('secondary_phone', '""', 'contact', true, 'Secondary contact number'),
('whatsapp_number', '"+9779802808008"', 'contact', true, 'WhatsApp number'),
('viber_number', '"+9779802808008"', 'contact', true, 'Viber number'),
('email', '"info@kundalinidental.com"', 'contact', true, 'Contact email'),
('address', '{"line1": "Kathmandu", "line2": "", "city": "Kathmandu", "country": "Nepal"}'::jsonb, 'contact', true, 'Physical address'),
('google_maps_embed', '""', 'contact', true, 'Google Maps embed URL'),
('social_facebook', '""', 'social', true, 'Facebook page URL'),
('social_instagram', '""', 'social', true, 'Instagram profile URL'),
('social_youtube', '""', 'social', true, 'YouTube channel URL'),
('social_linkedin', '""', 'social', true, 'LinkedIn page URL'),
('social_tiktok', '""', 'social', true, 'TikTok profile URL'),
('default_seo_title', '"Kundalini Dental Clinic | Best Dental Care in Nepal"', 'seo', true, 'Default SEO title'),
('default_seo_description', '"Premium dental care services in Kathmandu, Nepal. Specializing in dental implants, cosmetic dentistry, and dental tourism."', 'seo', true, 'Default SEO description'),
('google_analytics_id', '""', 'analytics', false, 'Google Analytics tracking ID'),
('facebook_pixel_id', '""', 'analytics', false, 'Facebook Pixel ID');

-- Default gallery categories
INSERT INTO public.gallery_categories (name, slug, sort_order) VALUES
('Dental Implants', 'dental-implants', 1),
('Smile Makeover', 'smile-makeover', 2),
('Teeth Whitening', 'teeth-whitening', 3),
('Veneers', 'veneers', 4),
('Full Mouth Rehabilitation', 'full-mouth-rehabilitation', 5);

-- Default blog categories
INSERT INTO public.blog_categories (name, slug, sort_order) VALUES
('Dental Health Tips', 'dental-health-tips', 1),
('Treatment Guides', 'treatment-guides', 2),
('Dental Tourism', 'dental-tourism', 3),
('News & Updates', 'news-updates', 4),
('Patient Stories', 'patient-stories', 5);

-- Default navigation items (main menu)
INSERT INTO public.navigation_items (location, label, url, sort_order) VALUES
('main', 'Home', '/', 1),
('main', 'Services', '/services', 2),
('main', 'Dental Tourism', '/dental-tourism', 3),
('main', 'Our Doctors', '/doctors', 4),
('main', 'Pricing', '/pricing', 5),
('main', 'Reviews', '/reviews', 6),
('main', 'About Us', '/about', 7),
('main', 'Contact', '/contact', 8);

-- Default navigation items (footer)
INSERT INTO public.navigation_items (location, label, url, sort_order) VALUES
('footer', 'Privacy Policy', '/privacy', 1),
('footer', 'Terms of Service', '/terms', 2),
('footer', 'Refund Policy', '/refund', 3),
('footer', 'FAQ', '/faq', 4);
