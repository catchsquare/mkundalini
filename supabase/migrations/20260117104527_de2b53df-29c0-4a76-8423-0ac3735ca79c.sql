-- Update section types to be more specific for proper CMS mapping
-- Trust Indicators (sort_order 2)
UPDATE public.page_sections 
SET section_type = 'trust_indicators'
WHERE page_id = '11111111-0001-0001-0001-000000000001' 
AND section_type = 'features' 
AND sort_order = 2;

-- Why Choose Us (sort_order 4)
UPDATE public.page_sections 
SET section_type = 'why_choose_us'
WHERE page_id = '11111111-0001-0001-0001-000000000001' 
AND section_type = 'features' 
AND sort_order = 4;

-- Doctor Highlight (sort_order 5)
UPDATE public.page_sections 
SET section_type = 'doctor_highlight'
WHERE page_id = '11111111-0001-0001-0001-000000000001' 
AND section_type = 'team' 
AND sort_order = 5;

-- International (sort_order 6)
UPDATE public.page_sections 
SET section_type = 'international'
WHERE page_id = '11111111-0001-0001-0001-000000000001' 
AND section_type = 'features' 
AND sort_order = 6;