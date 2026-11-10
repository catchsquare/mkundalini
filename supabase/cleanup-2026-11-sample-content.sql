-- Kundalini Dental Clinic: remove Lovable sample content (November 2026)
--
-- Run ONCE in your own Supabase project (SQL Editor) right after the data
-- has been copied over from Lovable Cloud. Safe to re-run.
--
-- What it does:
--   1. Deletes the six sample "international patient" testimonials.
--   2. Deletes the invented before/after case descriptions.
--   3. Removes CMS copies of sections that were rewritten in code, so the
--      verified versions in the code are shown instead.
--   4. Removes guarantee-style stats ("Quality / Care Guaranteed" etc.).
--   5. Clears sample USD prices. Public prices now come only from
--      src/lib/pricing.ts.

begin;

-- 1. Sample testimonials (Lovable generated, marked verified by mistake)
delete from public.testimonials
where source = 'internal'
  and patient_name in (
    'Sarah Mitchell', 'James Thompson', 'Priya Patel',
    'Michael Chen', 'Emma Williams', 'Robert Anderson'
  );

-- 2. Invented before/after cases
delete from public.content_blocks
where page_slug = 'reviews' and block_key = 'before_after_cases';

-- 3. Sections rewritten in code with verified facts
delete from public.content_blocks
where (page_slug = 'dental-tourism' and block_key in ('why_nepal', 'why_kundalini'))
   or (page_slug = 'pricing' and block_key in ('treatment_pricing', 'international_comparison'));

-- 4. Unverifiable stat tiles
delete from public.site_stats
where label ilike '%guarantee%'
   or value in ('Quality', 'Modern', 'Premium');

-- 5. Sample USD prices
update public.services set price = null, comparison_price = null;
update public.pricing_packages set is_visible = false;

commit;

-- Check: should return 0 rows
select patient_name from public.testimonials
where patient_name in ('Sarah Mitchell', 'James Thompson', 'Priya Patel',
                       'Michael Chen', 'Emma Williams', 'Robert Anderson');
