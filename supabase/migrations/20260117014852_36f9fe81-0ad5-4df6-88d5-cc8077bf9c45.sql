-- Seed Pages with existing frontend pages
INSERT INTO public.pages (id, title, slug, status, template, excerpt, seo_title, seo_description, published_at) VALUES
  ('11111111-0001-0001-0001-000000000001', 'Home', 'home', 'published', 'landing', 'Quality dental treatments at accessible prices. Led by Dr. Nitin Aryal with 15 years of experience.', 'Kundalini Dental Clinic - Quality Dental Care in Kathmandu, Nepal', 'Quality dental treatments at accessible prices. Led by Dr. Nitin Aryal with 15 years of experience. Save 50-70% on dental implants, veneers, and more.', now()),
  ('11111111-0001-0001-0001-000000000002', 'About Us', 'about', 'published', 'about', 'At Kundalini Dental Clinic, we believe exceptional dental care begins with genuine human connection.', 'About Kundalini Dental Clinic - Our Story', 'Founded in 2023, we combine Dr. Nitin Aryal''s 15 years of experience with modern facilities in Kathmandu, Nepal.', now()),
  ('11111111-0001-0001-0001-000000000003', 'Services', 'services', 'published', 'service', 'Comprehensive dental services using advanced technology and premium materials.', 'Dental Services - Kundalini Dental Clinic', 'From routine care to complex restorations, we offer comprehensive dental services at a fraction of international costs.', now()),
  ('11111111-0001-0001-0001-000000000004', 'Dental Tourism', 'dental-tourism', 'published', 'landing', 'Nepal offers world-class dental care at a fraction of Western prices.', 'Dental Tourism Nepal - Kundalini Dental Clinic', 'Save 50-70% on dental treatments. Quality care, beautiful destination. Airport pickup, hotel arrangements, and dedicated support.', now()),
  ('11111111-0001-0001-0001-000000000005', 'Our Doctors', 'doctors', 'published', 'default', 'Meet our experienced dental team led by Dr. Nitin Aryal.', 'Our Doctors - Kundalini Dental Clinic', 'Led by Dr. Nitin Aryal with 15 years of clinical experience. Quality dental care in Kathmandu.', now()),
  ('11111111-0001-0001-0001-000000000006', 'Pricing', 'pricing', 'published', 'default', 'Transparent pricing for all dental treatments.', 'Dental Pricing - Kundalini Dental Clinic', 'Affordable dental care with transparent pricing. Save 50-70% compared to Western prices.', now()),
  ('11111111-0001-0001-0001-000000000007', 'Reviews', 'reviews', 'published', 'default', 'Read testimonials from our satisfied patients.', 'Patient Reviews - Kundalini Dental Clinic', 'See what our patients say about their experience at Kundalini Dental Clinic in Kathmandu.', now()),
  ('11111111-0001-0001-0001-000000000008', 'Contact', 'contact', 'published', 'default', 'Get in touch with us for appointments and inquiries.', 'Contact Us - Kundalini Dental Clinic', 'Contact Kundalini Dental Clinic. WhatsApp: +977-9802808008. Email: info@kundalinidentalclinic.com.np', now())
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  template = EXCLUDED.template,
  excerpt = EXCLUDED.excerpt,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  published_at = EXCLUDED.published_at;

-- Seed Home Page Sections
INSERT INTO public.page_sections (id, page_id, section_type, content, sort_order, is_visible) VALUES
-- Hero Section
('22222222-0001-0001-0001-000000000001', '11111111-0001-0001-0001-000000000001', 'hero', '{
  "badge": "Nepal''s Leading Dental Care Destination",
  "headline": "Exceptional Dental Care,",
  "headline_highlight": "Exceptional Value",
  "description": "Quality dental treatments at accessible prices. Led by Dr. Nitin Aryal with 15 years of experience, we deliver professional care and beautiful, lasting results.",
  "cta_primary": {"label": "Book Your Appointment", "link": "/contact"},
  "cta_secondary": {"label": "International Patient? Start Here", "link": "/dental-tourism"},
  "stats": [
    {"value": "15", "label": "Years Experience"},
    {"value": "2023", "label": "Established"},
    {"value": "Premium", "label": "Quality Care"}
  ]
}'::jsonb, 1, true),

-- Trust Indicators
('22222222-0001-0001-0001-000000000002', '11111111-0001-0001-0001-000000000001', 'features', '{
  "items": [
    {"icon": "Stethoscope", "label": "Advanced Technology", "description": "Modern dental equipment"},
    {"icon": "Shield", "label": "Hospital-Grade Hygiene", "description": "Strict sterilization protocols"},
    {"icon": "Award", "label": "15 Years Experience", "description": "Led by Dr. Nitin Aryal"},
    {"icon": "HeartPulse", "label": "Patient Safety First", "description": "International safety standards"}
  ]
}'::jsonb, 2, true),

-- Services Overview
('22222222-0001-0001-0001-000000000003', '11111111-0001-0001-0001-000000000001', 'services_grid', '{
  "badge": "Our Expertise",
  "headline": "Premium Dental Services",
  "description": "From routine care to complex restorations, we deliver exceptional results using the latest techniques and premium materials.",
  "services": [
    {"icon": "🦷", "title": "Dental Implants", "description": "Premium titanium implants with lifetime warranty. Same-day procedures available for qualified patients.", "highlight": "Save up to 70%"},
    {"icon": "✨", "title": "Cosmetic Dentistry", "description": "Veneers, professional whitening, and complete smile makeovers designed for natural, lasting beauty.", "highlight": "Hollywood Smile"},
    {"icon": "😁", "title": "Orthodontics", "description": "Invisible aligners and modern braces for beautifully aligned teeth. Suitable for all ages.", "highlight": "Invisible Options"},
    {"icon": "💎", "title": "Full Mouth Restoration", "description": "Comprehensive treatment plans for complex cases. Rebuild your smile with confidence.", "highlight": "Complete Care"}
  ],
  "cta": {"label": "View All Services", "link": "/services"}
}'::jsonb, 3, true),

-- Why Choose Us
('22222222-0001-0001-0001-000000000004', '11111111-0001-0001-0001-000000000001', 'features', '{
  "badge": "Why Kundalini Dental",
  "headline": "Where World-Class Care Meets Compassionate Service",
  "description": "We combine the precision of international dental standards with the warmth of Nepali hospitality.",
  "bullets": [
    "Same quality as clinics in USA, UK & Australia",
    "Save 50-70% compared to Western prices",
    "No waiting lists — appointments within days",
    "English-speaking staff for international patients"
  ],
  "items": [
    {"icon": "BadgeCheck", "title": "FDA-Approved Materials", "description": "We exclusively use internationally certified, premium-grade materials for every procedure."},
    {"icon": "GraduationCap", "title": "Internationally Trained Team", "description": "Our specialists trained in the USA, UK, and Europe bring world-class expertise to Nepal."},
    {"icon": "Clock", "title": "Efficient Treatment", "description": "Advanced technology means faster procedures, less chair time, and quicker recovery."},
    {"icon": "Users", "title": "Personalized Care", "description": "Every treatment plan is customized to your unique needs, goals, and budget."}
  ],
  "cta": {"label": "Learn About Our Clinic", "link": "/about"}
}'::jsonb, 4, true),

-- Doctor Highlight
('22222222-0001-0001-0001-000000000005', '11111111-0001-0001-0001-000000000001', 'team', '{
  "badge": "Meet Your Doctor",
  "headline": "Dr. Nitin Aryal",
  "subtitle": "Managing Director",
  "description": "With 15 years of clinical experience, Dr. Nitin Aryal founded Kundalini Dental Clinic with a mission to bring quality dental care to Kathmandu. His patient-first philosophy ensures every individual receives personalized attention and the highest standard of treatment.",
  "credentials": [
    "Bachelor of Dental Surgery (BDS)",
    "15 years of clinical experience",
    "Managing Director, Kundalini Dental Clinic",
    "Committed to patient-centered care",
    "Expertise in comprehensive dental treatments"
  ],
  "experience_badge": {"value": "15+", "label": "Years of Excellence"},
  "cta": {"label": "Meet Our Full Team", "link": "/doctors"}
}'::jsonb, 5, true),

-- International Patients
('22222222-0001-0001-0001-000000000006', '11111111-0001-0001-0001-000000000001', 'features', '{
  "badge": "International Patients",
  "headline": "Your Dental Journey, Simplified",
  "description": "We handle everything so you can focus on your treatment and enjoying Nepal.",
  "items": [
    {"icon": "Plane", "title": "Airport Pickup", "description": "Complimentary transportation from Tribhuvan International Airport"},
    {"icon": "Hotel", "title": "Hotel Arrangements", "description": "Partnered hotels with special rates for our patients"},
    {"icon": "Globe", "title": "Virtual Consultation", "description": "Free video consultation before you travel"},
    {"icon": "Phone", "title": "24/7 Support", "description": "Dedicated coordinator throughout your stay"}
  ],
  "cta": {"label": "Plan Your Dental Trip", "link": "/dental-tourism"}
}'::jsonb, 6, true),

-- Testimonials
('22222222-0001-0001-0001-000000000007', '11111111-0001-0001-0001-000000000001', 'testimonials', '{
  "badge": "Patient Stories",
  "headline": "Trusted by Patients Worldwide",
  "testimonials": [
    {"name": "International Patient", "location": "Overseas", "treatment": "Dental Treatment", "quote": "The clinic provided excellent care with modern facilities. Dr. Nitin Aryal and his team were professional and attentive throughout my treatment.", "rating": 5},
    {"name": "Local Patient", "location": "Kathmandu, Nepal", "treatment": "Dental Care", "quote": "I''ve been coming to Kundalini Dental for my family''s dental needs. The staff is friendly and the clinic maintains high standards of hygiene.", "rating": 5},
    {"name": "Returning Patient", "location": "Nepal", "treatment": "General Dentistry", "quote": "Dr. Nitin Aryal took the time to explain my treatment options clearly. The clinic''s commitment to patient care is evident in every visit.", "rating": 5}
  ],
  "cta": {"label": "Read More Reviews", "link": "/reviews"}
}'::jsonb, 7, true),

-- CTA Strip
('22222222-0001-0001-0001-000000000008', '11111111-0001-0001-0001-000000000001', 'cta_strip', '{
  "headline": "Ready to Transform Your Smile?",
  "description": "Take the first step toward the smile you deserve. Book a free consultation today — no obligations, just honest advice.",
  "cta_primary": {"label": "Book Free Consultation", "link": "/contact"},
  "cta_secondary": {"label": "WhatsApp Us", "link": "https://wa.me/9779802808008"}
}'::jsonb, 8, true)
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  is_visible = EXCLUDED.is_visible;

-- Seed About Page Sections
INSERT INTO public.page_sections (id, page_id, section_type, content, sort_order, is_visible) VALUES
('22222222-0002-0001-0001-000000000001', '11111111-0001-0001-0001-000000000002', 'hero', '{
  "badge": "Our Story",
  "headline": "Dentistry Built on",
  "headline_highlight": "Trust",
  "description": "At Kundalini Dental Clinic, we believe exceptional dental care begins with genuine human connection. Founded in 2023, we combine Dr. Nitin Aryal''s 15 years of experience with modern facilities to serve you better."
}'::jsonb, 1, true),

('22222222-0002-0001-0001-000000000002', '11111111-0001-0001-0001-000000000002', 'text_block', '{
  "badge": "Our Philosophy",
  "headline": "More Than Dentistry — A Commitment to Your Well-Being",
  "description": "The name \"Kundalini\" reflects our holistic approach to care. We understand that your oral health is deeply connected to your physical health, confidence, and quality of life.",
  "bullets": [
    "We believe oral health is inseparable from overall well-being.",
    "We treat people, not just teeth — understanding your concerns, fears, and goals.",
    "We practice conservative dentistry, preserving natural tooth structure whenever possible.",
    "We never recommend unnecessary procedures — your trust matters more than profit.",
    "We invest in continuous education to bring you the latest, proven techniques."
  ],
  "quote": {
    "text": "We don''t just fix teeth — we restore confidence, relieve pain, and help people reclaim their quality of life.",
    "author": "Dr. Nitin Aryal",
    "role": "Managing Director"
  }
}'::jsonb, 2, true),

('22222222-0002-0001-0001-000000000003', '11111111-0001-0001-0001-000000000002', 'features', '{
  "badge": "Our Values",
  "headline": "The Principles That Guide Us",
  "description": "These aren''t just words on a wall. They''re the foundation of every interaction, every treatment, and every decision we make.",
  "items": [
    {"icon": "Heart", "title": "Patient First, Always", "description": "Every decision we make centers on your comfort, well-being, and long-term health. You are never just a number here."},
    {"icon": "Shield", "title": "Uncompromising Safety", "description": "Hospital-grade sterilization, FDA-approved materials, and rigorous infection control protocols protect you at every visit."},
    {"icon": "Eye", "title": "Complete Transparency", "description": "Clear explanations, honest assessments, and upfront pricing. We believe you deserve to understand every aspect of your care."},
    {"icon": "HandHeart", "title": "Gentle, Compassionate Care", "description": "We understand dental anxiety. Our team creates a calm, supportive environment where you feel safe and respected."}
  ]
}'::jsonb, 3, true),

('22222222-0002-0001-0001-000000000004', '11111111-0001-0001-0001-000000000002', 'features', '{
  "badge": "Your Safety",
  "headline": "Hospital-Grade Standards in Every Procedure",
  "description": "Your safety is non-negotiable. We maintain sterilization and infection control protocols that meet or exceed international hospital standards.",
  "items": [
    {"icon": "Microscope", "title": "Advanced Sterilization", "description": "Class B autoclaves, UV sterilization chambers, and single-use instruments where possible."},
    {"icon": "BadgeCheck", "title": "Certified Materials", "description": "Only FDA-approved, internationally certified implants, crowns, and restorative materials."},
    {"icon": "Clock", "title": "Strict Protocols", "description": "Documented infection control procedures following WHO and ADA guidelines."},
    {"icon": "Award", "title": "Regular Audits", "description": "Internal quality assessments and third-party audits ensure consistent standards."}
  ]
}'::jsonb, 4, true),

('22222222-0002-0001-0001-000000000005', '11111111-0001-0001-0001-000000000002', 'text_block', '{
  "badge": "Our Journey",
  "headline": "Our Story",
  "milestones": [
    {"year": "2023", "event": "Kundalini Dental Clinic established in Kathmandu"},
    {"year": "2023", "event": "Equipped with modern dental technology and equipment"},
    {"year": "2024", "event": "Expanded services for international patients"}
  ]
}'::jsonb, 5, true),

('22222222-0002-0001-0001-000000000006', '11111111-0001-0001-0001-000000000002', 'team', '{
  "badge": "Our Team",
  "headline": "Experienced, Compassionate Specialists",
  "description": "Our team combines international training with genuine care. Each specialist is committed to your comfort and the best possible outcomes.",
  "members": [
    {
      "name": "Dr. Nitin Aryal",
      "role": "Managing Director",
      "education": "BDS",
      "experience": "15 years",
      "specialization": "Comprehensive Dental Care",
      "bio": "With 15 years of clinical experience, Dr. Nitin Aryal founded Kundalini Dental Clinic in 2023 with a mission to provide quality dental care in Kathmandu. His patient-centered approach ensures every individual receives personalized attention and professional treatment."
    }
  ]
}'::jsonb, 6, true)
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  is_visible = EXCLUDED.is_visible;

-- Update global settings with correct address
UPDATE public.global_settings 
SET setting_value = '"Goreto Bhawan, Chappal Karkhana, Kathmandu"'::jsonb
WHERE setting_key = 'address';

UPDATE public.global_settings 
SET setting_value = '"info@kundalinidentalclinic.com.np"'::jsonb
WHERE setting_key = 'email';

-- Update navigation items to link to CMS pages
UPDATE public.navigation_items SET page_id = '11111111-0001-0001-0001-000000000001' WHERE url = '/';
UPDATE public.navigation_items SET page_id = '11111111-0001-0001-0001-000000000003' WHERE url = '/services';
UPDATE public.navigation_items SET page_id = '11111111-0001-0001-0001-000000000004' WHERE url = '/dental-tourism';
UPDATE public.navigation_items SET page_id = '11111111-0001-0001-0001-000000000005' WHERE url = '/doctors';
UPDATE public.navigation_items SET page_id = '11111111-0001-0001-0001-000000000006' WHERE url = '/pricing';
UPDATE public.navigation_items SET page_id = '11111111-0001-0001-0001-000000000007' WHERE url = '/reviews';
UPDATE public.navigation_items SET page_id = '11111111-0001-0001-0001-000000000002' WHERE url = '/about';
UPDATE public.navigation_items SET page_id = '11111111-0001-0001-0001-000000000008' WHERE url = '/contact';