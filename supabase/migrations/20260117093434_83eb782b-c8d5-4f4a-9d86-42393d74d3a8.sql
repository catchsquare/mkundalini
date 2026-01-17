-- Create offers table for CMS management
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  badge_text TEXT,
  cta_label TEXT DEFAULT 'Learn More',
  cta_link TEXT DEFAULT '/contact',
  image_url TEXT,
  image_alt TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'expired')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table for doctors and staff CMS management
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  role_type TEXT NOT NULL DEFAULT 'staff' CHECK (role_type IN ('doctor', 'director', 'staff')),
  qualifications TEXT[],
  experience_years INTEGER,
  bio TEXT,
  specialties TEXT[],
  languages TEXT[],
  photo_url TEXT,
  photo_alt TEXT,
  achievements TEXT[],
  is_featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public read access for offers (active only)
CREATE POLICY "Public can read active offers" 
ON public.offers 
FOR SELECT 
USING (status = 'active');

-- Staff can manage offers
CREATE POLICY "Staff can manage offers" 
ON public.offers 
FOR ALL 
USING (public.is_staff(auth.uid()));

-- Public read access for team members (published only)
CREATE POLICY "Public can read published team members" 
ON public.team_members 
FOR SELECT 
USING (status = 'published');

-- Staff can manage team members
CREATE POLICY "Staff can manage team members" 
ON public.team_members 
FOR ALL 
USING (public.is_staff(auth.uid()));

-- Seed initial offers (matching current AnnouncementBar data)
INSERT INTO public.offers (title, description, badge_text, cta_label, cta_link, status, sort_order) VALUES
('20% OFF on All Dental Implants', 'Limited time offer on all dental implant procedures', 'Limited Time Offer', 'Book Now', '/services/dental-implants', 'active', 1),
('Free Airport Pickup + Hotel Assistance', 'Special package for international patients', 'International Patients', 'Learn More', '/dental-tourism', 'active', 2),
('Free Consultation for Smile Makeovers', 'New year special - complimentary consultation', 'New Year Special', 'Claim Offer', '/contact', 'active', 3);

-- Seed Dr. Nitin Aryal as team member
INSERT INTO public.team_members (full_name, role, role_type, qualifications, experience_years, bio, specialties, languages, achievements, is_featured, status, sort_order) VALUES
('Dr. Nitin Aryal', 'Managing Director', 'director', 
  ARRAY['BDS — Bachelor of Dental Surgery'],
  15,
  'Dr. Nitin Aryal founded Kundalini Dental Clinic in 2023 with a vision to provide quality dental care in Kathmandu. With 15 years of clinical experience, he leads the clinic with a commitment to patient-centered care and professional excellence.',
  ARRAY['Comprehensive Dental Care', 'General Dentistry', 'Patient-Centered Treatment'],
  ARRAY['English', 'Nepali'],
  ARRAY['15 years of dental practice', 'Founder & Managing Director', 'Committed to quality patient care'],
  true, 'published', 1
);

-- Create trigger for updated_at on offers
CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on team_members
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();