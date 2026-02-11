
-- Service Categories table
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  highlight TEXT,
  icon TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  price TEXT,
  comparison_price TEXT,
  duration TEXT,
  tourism_friendly BOOLEAN DEFAULT false,
  features TEXT[] DEFAULT '{}',
  image_url TEXT,
  image_alt TEXT,
  -- Detail page structured fields
  hero_badge TEXT,
  hero_title TEXT,
  hero_description TEXT,
  hero_image_url TEXT,
  -- Rich text body content (HTML from TipTap editor)
  body_content TEXT,
  -- FAQ as JSON array
  faqs JSONB DEFAULT '[]',
  -- Meta
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public read for active items
CREATE POLICY "Anyone can view visible service categories"
  ON public.service_categories FOR SELECT
  USING (is_visible = true);

CREATE POLICY "CMS users can manage service categories"
  ON public.service_categories FOR ALL
  USING (has_cms_access(auth.uid()));

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "CMS users can manage services"
  ON public.services FOR ALL
  USING (has_cms_access(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_service_categories_updated_at
  BEFORE UPDATE ON public.service_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the existing hardcoded data
INSERT INTO public.service_categories (name, slug, description, highlight, sort_order) VALUES
  ('Implants & Restorative', 'implants-restorative', 'Permanent solutions for missing or damaged teeth', 'Most Popular for Dental Tourism', 0),
  ('Cosmetic Dentistry', 'cosmetic', 'Transform your smile with aesthetic enhancements', 'Hollywood Smile Specialists', 1),
  ('Orthodontics', 'orthodontics', 'Straighten teeth for a perfect, aligned smile', 'Invisible Options Available', 2),
  ('General & Preventive', 'general', 'Essential care for optimal oral health', 'Foundation of Healthy Smiles', 3),
  ('Oral Surgery', 'surgical', 'Advanced surgical procedures by specialists', 'Expert Surgical Care', 4);

-- Seed services
INSERT INTO public.services (category_id, title, slug, short_description, price, comparison_price, duration, tourism_friendly, features, sort_order)
SELECT c.id, s.title, s.slug, s.short_description, s.price, s.comparison_price, s.duration, s.tourism_friendly, s.features, s.sort_order
FROM (VALUES
  ('implants-restorative', 'Single Tooth Implants', 'single-implants', 'Replace individual missing teeth with natural-looking titanium implants.', 'From $350', '$3,000+ in USA', '2-3 visits', true, ARRAY['German/Swiss implants', 'Lifetime warranty', '3D-guided placement'], 0),
  ('implants-restorative', 'All-on-4 Full Arch', 'all-on-4', 'Complete smile restoration with just 4 implants supporting a full arch.', 'From $4,500', '$25,000+ in USA', '3-5 visits', true, ARRAY['Same-day teeth possible', 'Full upper or lower arch', 'Premium prosthetics'], 1),
  ('implants-restorative', 'Crowns & Bridges', 'crowns-bridges', 'Restore damaged teeth or bridge gaps with precision-crafted restorations.', 'From $150', '$1,200+ in USA', '2 visits', true, ARRAY['Zirconia & E-max options', 'CAD/CAM precision', 'Same-day available'], 2),
  ('implants-restorative', 'Full Mouth Rehabilitation', 'full-mouth', 'Comprehensive restoration for severely damaged or worn dentition.', 'Custom quote', 'Save 60-70%', 'Multiple visits', true, ARRAY['Complete assessment', 'Phased treatment', 'Smile design included'], 3),
  ('cosmetic', 'Porcelain Veneers', 'veneers', 'Ultra-thin shells that transform the appearance of your teeth instantly.', 'From $250/tooth', '$1,500+ in USA', '2-3 visits', true, ARRAY['E-max porcelain', 'Custom shade matching', 'Minimal prep options'], 0),
  ('cosmetic', 'Complete Smile Makeover', 'smile-makeover', 'Comprehensive aesthetic transformation combining multiple treatments.', 'From $2,000', '$15,000+ in USA', '3-5 visits', true, ARRAY['Digital smile design', 'Multiple treatment options', 'Personalized plan'], 1),
  ('cosmetic', 'Teeth Whitening', 'whitening', 'Professional-grade whitening for a brighter, more youthful smile.', 'From $150', '$500+ in USA', '1 visit', true, ARRAY['In-office treatment', 'Take-home kits available', 'Up to 8 shades lighter'], 2),
  ('cosmetic', 'Composite Bonding', 'bonding', 'Quick, affordable repairs for chips, gaps, and minor imperfections.', 'From $80/tooth', '$300+ in USA', '1 visit', false, ARRAY['Same-day results', 'Tooth-colored material', 'No drilling required'], 3),
  ('orthodontics', 'Clear Aligners', 'clear-aligners', 'Virtually invisible aligners that straighten teeth without metal braces.', 'From $1,500', '$5,000+ in USA', '6-18 months', false, ARRAY['Removable aligners', '3D treatment preview', 'Suitable for adults'], 0),
  ('orthodontics', 'Traditional Braces', 'braces', 'Time-tested solution for complex orthodontic cases at any age.', 'From $800', '$4,000+ in USA', '12-24 months', false, ARRAY['Metal or ceramic options', 'Complex case expertise', 'All ages welcome'], 1),
  ('orthodontics', 'Retainers', 'retainers', 'Maintain your perfect smile after orthodontic treatment.', 'From $100', '$300+ in USA', '1 visit', true, ARRAY['Fixed or removable', 'Custom-made', 'Long-term maintenance'], 2),
  ('general', 'Root Canal Treatment', 'root-canal', 'Save infected teeth with gentle, effective endodontic treatment.', 'From $100', '$1,000+ in USA', '1-2 visits', true, ARRAY['Microscope-enhanced', 'Rotary instruments', 'Pain-free experience'], 0),
  ('general', 'Tooth Extractions', 'extractions', 'Safe, comfortable removal of damaged or problematic teeth.', 'From $30', '$200+ in USA', '1 visit', true, ARRAY['Wisdom teeth included', 'Sedation available', 'Same-day service'], 1),
  ('general', 'Professional Cleaning', 'cleaning', 'Deep cleaning and scaling for healthy gums and fresh breath.', 'From $40', '$150+ in USA', '1 visit', true, ARRAY['Ultrasonic scaling', 'Polishing included', 'Oral hygiene guidance'], 2),
  ('general', 'Dental Fillings', 'fillings', 'Tooth-colored restorations that blend seamlessly with natural teeth.', 'From $25', '$200+ in USA', '1 visit', true, ARRAY['Composite material', 'Mercury-free', 'Natural appearance'], 3),
  ('surgical', 'Wisdom Tooth Surgery', 'wisdom-teeth', 'Expert removal of impacted or problematic wisdom teeth.', 'From $80/tooth', '$400+ in USA', '1 visit', true, ARRAY['Surgical extraction', 'Sedation options', 'Quick recovery'], 0),
  ('surgical', 'Bone Grafting', 'bone-grafting', 'Rebuild jaw bone for implant placement or structural support.', 'From $200', '$1,500+ in USA', '1-2 visits', true, ARRAY['Synthetic & natural options', 'Implant preparation', 'Sinus lift available'], 1),
  ('surgical', 'Gum Treatment', 'gum-surgery', 'Treat gum disease and restore periodontal health.', 'From $150', '$800+ in USA', '1-3 visits', true, ARRAY['Deep cleaning', 'Gum grafting', 'Laser treatment available'], 2)
) AS s(cat_slug, title, slug, short_description, price, comparison_price, duration, tourism_friendly, features, sort_order)
JOIN public.service_categories c ON c.slug = s.cat_slug;

-- Add dental implants detail page content
UPDATE public.services SET
  hero_badge = '#1 Treatment for Dental Tourism',
  hero_title = 'Dental Implants',
  hero_description = 'Permanent, natural-looking replacement for missing teeth. Our premium titanium implants restore your smile, confidence, and ability to eat comfortably — at a fraction of international costs.',
  hero_image_url = NULL,
  body_content = '<h2>What Are Dental Implants?</h2><p>A dental implant is a small titanium post that''s surgically placed into your jawbone, where it fuses with the bone to create a strong foundation for a replacement tooth. Think of it as an artificial tooth root.</p><p>Once the implant has integrated with your bone, a custom-made crown is attached on top. The result is a tooth that looks, feels, and functions exactly like your natural teeth — often even better.</p><h3>An implant consists of three parts:</h3><ul><li><strong>The Implant</strong>: Titanium post placed in the jawbone (the ''root'')</li><li><strong>The Abutment</strong>: Connector piece that attaches to the implant</li><li><strong>The Crown</strong>: The visible tooth that matches your natural teeth</li></ul><h2>Why Choose Implants Over Other Options?</h2><ul><li><strong>Permanent Solution</strong>: Unlike dentures, implants are fixed and don''t need removal</li><li><strong>Bone Preservation</strong>: Stimulates jawbone, preventing deterioration</li><li><strong>Natural Feel</strong>: Eat, speak, and smile with complete confidence</li><li><strong>No Impact on Adjacent Teeth</strong>: Unlike bridges, no grinding of healthy teeth needed</li></ul><h2>Our Technology</h2><ul><li><strong>3D CT Imaging</strong>: Precise 3D scans of your jaw for accurate implant planning</li><li><strong>Guided Surgery</strong>: Computer-guided placement for predictable results</li><li><strong>Premium Implants</strong>: German and Swiss titanium implants with proven success rates</li><li><strong>Digital Design</strong>: CAD/CAM technology for perfectly fitting crowns</li></ul>',
  faqs = '[{"question":"Are dental implants painful?","answer":"The procedure itself is painless as it''s performed under local anesthesia. Most patients report less discomfort than they expected."},{"question":"How long do dental implants last?","answer":"With proper care, dental implants can last a lifetime. The implant itself is designed to be permanent. The crown may need replacement after 10-15 years."},{"question":"Am I a candidate for dental implants?","answer":"Most adults with good general health are candidates. Key factors include adequate jawbone density, healthy gums, and no uncontrolled medical conditions."},{"question":"Can I get implants if I have bone loss?","answer":"Yes, in most cases. We offer bone grafting procedures that can rebuild lost jawbone and create a solid foundation for implants."},{"question":"How long does the entire process take?","answer":"The complete process typically takes 3-6 months, with most of that time being the healing period."},{"question":"What is the success rate?","answer":"Dental implants have a success rate of 95-98%. At Kundalini Dental, our success rate exceeds 97%."}]'
WHERE slug = 'single-implants';
