-- Seed page sections for Services page
INSERT INTO public.page_sections (id, page_id, section_type, sort_order, is_visible, content) VALUES
('22222222-0001-0001-0003-000000000001', '11111111-0001-0001-0001-000000000003', 'hero', 1, true, '{
  "badge": "Our Treatments",
  "title": "World-Class Dental",
  "titleHighlight": "Treatments",
  "description": "From routine care to complex restorations, we offer comprehensive dental services using advanced technology and premium materials — all at a fraction of international costs."
}'::jsonb),
('22222222-0001-0001-0003-000000000002', '11111111-0001-0001-0001-000000000003', 'tourism_highlight', 2, true, '{
  "badge": "Dental Tourism",
  "title": "High-Value Treatments for International Patients",
  "description": "These treatments offer the greatest savings for patients traveling from abroad while maintaining the same quality as top clinics worldwide.",
  "treatments": [
    {"name": "Dental Implants", "savings": "Save 70-80%"},
    {"name": "Veneers", "savings": "Save 75-85%"},
    {"name": "All-on-4", "savings": "Save 80%"},
    {"name": "Crowns", "savings": "Save 70-80%"},
    {"name": "Root Canals", "savings": "Save 85-90%"},
    {"name": "Smile Makeovers", "savings": "Save 70%"}
  ]
}'::jsonb);

-- Seed page sections for Doctors page
INSERT INTO public.page_sections (id, page_id, section_type, sort_order, is_visible, content) VALUES
('22222222-0001-0001-0005-000000000001', '11111111-0001-0001-0001-000000000005', 'hero', 1, true, '{
  "badge": "Our Medical Team",
  "title": "Meet Your",
  "titleHighlight": "Dental Team",
  "description": "Led by Dr. Nitin Aryal with 15 years of experience, our team is committed to delivering exceptional care with compassion and precision."
}'::jsonb),
('22222222-0001-0001-0005-000000000002', '11111111-0001-0001-0001-000000000005', 'featured_doctor', 2, true, '{
  "name": "Dr. Nitin Aryal",
  "role": "Managing Director",
  "experience": "15 years",
  "qualifications": ["BDS — Bachelor of Dental Surgery"],
  "specialties": ["Comprehensive Dental Care", "General Dentistry", "Patient-Centered Treatment"],
  "languages": ["English", "Nepali"],
  "bio": "Dr. Nitin Aryal founded Kundalini Dental Clinic in 2023 with a vision to provide quality dental care in Kathmandu. With 15 years of clinical experience, he leads the clinic with a commitment to patient-centered care and professional excellence.",
  "achievements": ["15 years of dental practice", "Founder & Managing Director", "Committed to quality patient care"]
}'::jsonb),
('22222222-0001-0001-0005-000000000003', '11111111-0001-0001-0001-000000000005', 'commitment', 3, true, '{
  "badge": "Our Promise",
  "title": "Quality Care You Can Trust",
  "description": "At Kundalini Dental Clinic, we are committed to providing personalized dental care with the highest standards of professionalism and hygiene.",
  "items": [
    {"title": "15 Years Experience", "description": "Dr. Nitin Aryal brings 15 years of clinical experience to every patient consultation."},
    {"title": "Modern Facilities", "description": "Our clinic is equipped with contemporary dental technology for accurate and efficient treatments."},
    {"title": "Patient-First Approach", "description": "Every treatment plan is customized to your unique needs, ensuring comfortable and effective care."}
  ]
}'::jsonb);

-- Seed page sections for Pricing page
INSERT INTO public.page_sections (id, page_id, section_type, sort_order, is_visible, content) VALUES
('22222222-0001-0001-0006-000000000001', '11111111-0001-0001-0001-000000000006', 'hero', 1, true, '{
  "badge": "Honest, Transparent Pricing",
  "title": "Clear Pricing,",
  "titleHighlight": "No Surprises",
  "description": "We believe you deserve to know exactly what your dental care will cost before treatment begins. No hidden fees, no unexpected charges—just honest pricing for world-class care."
}'::jsonb),
('22222222-0001-0001-0006-000000000002', '11111111-0001-0001-0001-000000000006', 'philosophy', 2, true, '{
  "title": "Our Pricing Philosophy",
  "description": "At Kundalini Dental Clinic, transparent pricing isnt just a policy—its a core value that guides how we treat every patient.",
  "items": [
    {"title": "Care Before Commerce", "description": "We believe excellent dental care should be accessible. Our pricing reflects honest costs, not inflated margins designed to maximize profit at your expense."},
    {"title": "No Hidden Fees", "description": "The price we quote is the price you pay. No surprise charges, no hidden consultation fees, no unexpected costs added after treatment begins."},
    {"title": "Detailed Estimates", "description": "Before any treatment, you receive a comprehensive written estimate breaking down every cost. Youll understand exactly what youre paying for."},
    {"title": "Fair Value", "description": "We use the same premium materials and techniques as clinics charging 5-10x more. The difference? Lower overhead, not lower quality."}
  ]
}'::jsonb);

-- Seed page sections for Reviews page
INSERT INTO public.page_sections (id, page_id, section_type, sort_order, is_visible, content) VALUES
('22222222-0001-0001-0007-000000000001', '11111111-0001-0001-0001-000000000007', 'hero', 1, true, '{
  "badge": "Patient Stories & Results",
  "title": "Real Patients,",
  "titleHighlight": "Real Results",
  "description": "Every smile has a story. Read authentic experiences from patients who trusted us with their dental care and see the transformations that changed their lives."
}'::jsonb),
('22222222-0001-0001-0007-000000000002', '11111111-0001-0001-0001-000000000007', 'trust_stats', 2, true, '{
  "stats": [
    {"number": "2023", "label": "Established"},
    {"number": "15", "label": "Years Experience"},
    {"number": "Quality", "label": "Care Guaranteed"},
    {"number": "Modern", "label": "Facilities"}
  ]
}'::jsonb),
('22222222-0001-0001-0007-000000000003', '11111111-0001-0001-0001-000000000007', 'testimonials_section', 3, true, '{
  "title": "What Our Patients Say",
  "description": "These are real stories from real patients. We are honored to share their experiences and grateful for their trust."
}'::jsonb);

-- Seed page sections for Contact page
INSERT INTO public.page_sections (id, page_id, section_type, sort_order, is_visible, content) VALUES
('22222222-0001-0001-0008-000000000001', '11111111-0001-0001-0001-000000000008', 'hero', 1, true, '{
  "badge": "Book Your Appointment",
  "title": "Your Smile Journey",
  "titleHighlight": "Starts Here",
  "description": "Whether youre across town or across the world, reaching us is easy. Choose your preferred way to connect, and well guide you through every step of your dental care journey."
}'::jsonb),
('22222222-0001-0001-0008-000000000002', '11111111-0001-0001-0001-000000000008', 'contact_methods', 2, true, '{
  "title": "Choose How to Connect",
  "description": "We are available through multiple channels to suit your preference. International patients especially love our WhatsApp support.",
  "methods": [
    {"title": "WhatsApp", "subtitle": "Fastest Response", "value": "+977-9802808008", "description": "Get instant responses. Share photos, X-rays, and questions directly.", "responseTime": "Usually within 1 hour"},
    {"title": "Phone", "subtitle": "Call Us Directly", "value": "+977-9802808008", "description": "Speak directly with our team during clinic hours.", "responseTime": "During clinic hours"},
    {"title": "Video Consultation", "subtitle": "Face-to-Face Online", "value": "Book a Session", "description": "Schedule a video call with our dental team.", "responseTime": "By appointment"},
    {"title": "Email", "subtitle": "Detailed Inquiries", "value": "info@kundalinidentalclinic.com.np", "description": "Best for sending X-rays, photos, and detailed treatment histories.", "responseTime": "Within 24 hours"}
  ]
}'::jsonb),
('22222222-0001-0001-0008-000000000003', '11111111-0001-0001-0001-000000000008', 'booking_process', 3, true, '{
  "badge": "Simple Process",
  "title": "How Booking Works",
  "description": "From first contact to sitting in our chair, we make the process smooth and stress-free.",
  "steps": [
    {"step": 1, "title": "Submit Your Inquiry", "description": "Fill out the form below or contact us via WhatsApp with your dental concerns and goals."},
    {"step": 2, "title": "Free Virtual Consultation", "description": "Well review your case and schedule a video call to discuss treatment options and costs."},
    {"step": 3, "title": "Receive Your Treatment Plan", "description": "Get a detailed, personalized treatment plan with transparent pricing—no obligations."},
    {"step": 4, "title": "Confirm Your Visit", "description": "Once youre ready, well help coordinate your appointment dates and travel logistics."}
  ]
}'::jsonb);

-- Seed page sections for Dental Tourism page
INSERT INTO public.page_sections (id, page_id, section_type, sort_order, is_visible, content) VALUES
('22222222-0001-0001-0004-000000000001', '11111111-0001-0001-0001-000000000004', 'hero', 1, true, '{
  "badge": "International Patients",
  "title": "Your Complete Guide to",
  "titleHighlight": "Dental Care in Nepal",
  "description": "Everything you need to know about receiving world-class dental treatment at Kundalini Dental Clinic. We believe in complete transparency — no surprises, no pressure, just honest information."
}'::jsonb),
('22222222-0001-0001-0004-000000000002', '11111111-0001-0001-0001-000000000004', 'quick_stats', 2, true, '{
  "stats": [
    {"value": "15", "label": "Years Experience"},
    {"value": "2023", "label": "Clinic Established"},
    {"value": "Quality", "label": "Dental Care"},
    {"value": "Premium", "label": "Materials Used"}
  ]
}'::jsonb),
('22222222-0001-0001-0004-000000000003', '11111111-0001-0001-0001-000000000004', 'why_nepal', 3, true, '{
  "badge": "The Destination",
  "title": "Why Choose Nepal for Dental Care?",
  "description": "Nepal has emerged as a trusted destination for quality dental care. Here is what makes it an excellent choice for international patients.",
  "items": [
    {"title": "Significant Cost Savings", "description": "Save 60-80% on dental treatments compared to USA, UK, Australia, and Europe — without compromising on quality."},
    {"title": "Internationally Trained Dentists", "description": "Our specialists trained at leading institutions in India, USA, UK, and Germany."},
    {"title": "Same Materials, Same Standards", "description": "We use the same FDA-approved implants, German crowns, and premium materials as top clinics in Western countries."},
    {"title": "English-Speaking Care", "description": "Our entire team speaks fluent English. Youll never face communication barriers."},
    {"title": "No Waiting Lists", "description": "We can typically schedule your treatment within days of your arrival."},
    {"title": "Unforgettable Destination", "description": "Combine your dental treatment with an experience of a lifetime. Nepal offers Himalayan vistas, ancient culture, and warm hospitality."}
  ]
}'::jsonb),
('22222222-0001-0001-0004-000000000004', '11111111-0001-0001-0001-000000000004', 'why_kundalini', 4, true, '{
  "badge": "The Clinic",
  "title": "Why Kundalini Dental Clinic?",
  "description": "There are many dental clinics in Nepal. Here is why international patients specifically choose us — and keep recommending us to friends and family.",
  "items": [
    {"title": "15 Years of Experience", "description": "Led by Dr. Nitin Aryal with 15 years of dental expertise, our clinic established in 2023 combines experienced leadership with modern facilities."},
    {"title": "Specialist-Led Care", "description": "Your treatment is performed by qualified dental professionals dedicated to their area of expertise."},
    {"title": "Modern Technology", "description": "We use contemporary dental technology for accurate diagnostics and efficient treatments."},
    {"title": "Transparent Pricing", "description": "Complete cost breakdown before you travel. No hidden fees, no surprises."},
    {"title": "Dedicated Patient Coordinator", "description": "One point of contact who speaks your language and handles everything from scheduling to travel assistance."},
    {"title": "Comprehensive Documentation", "description": "Full treatment records, X-rays, and care instructions provided for your home dentist."}
  ]
}'::jsonb);