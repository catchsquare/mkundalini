# SEO / AEO / GEO Audit Report and Phased Plan

Following section 35 of the brief: findings first, then the plan. Major structural changes wait for approval.

## A. SEO problems found
- Every page gets its title, description and canonical from code that runs in the browser. Google handles this, but social previews and many AI crawlers only see the homepage head tags.
- The share image (og:image / twitter:image) is the small favicon, which makes link previews look poor.
- The sitewide description says "World-class" and "International standards". These are unverifiable superlatives.
- `twitter:site @KundaliniDental` has not been verified.
- The sitemap gives every page the same `lastmod` (2026-05-15), so the dates carry no real meaning.
- There is no patient resources, cost guide or knowledge hub content, so the site has few pages that answer patient questions directly.

## B. Technical problems found
- **Dentist schema in index.html** uses phone `+977-9851234567`, which looks like a placeholder. Its geo coordinates (27.7172, 85.3240) are the Kathmandu city centre, not the clinic. Its logo and image point to the favicon.
- **6 images have no alt text**: Home (x3), Doctors, Services and Service Detail. The Offers popup also needs checking.
- **Smart 404 redirects happen in the browser**, not as real server redirects. Google may treat these as soft-404s.
- **Unused admin routes** (patients, billing, inventory, reports placeholders) are still in the app. They are blocked in robots.txt, but they are dead code left from the earlier change of scope.

## C. Duplicate or competing URLs
- `src/pages/treatments/DentalImplantsPage.tsx` exists but has no route. It is orphaned and competes in content with `/services/single-implants`.
- No `/treatments/*` routes are live, so `/services/:slug` is already the single main URL for each treatment.
- Sitemap entries match the 18 service slugs. www and non-www: www is still waiting on DNS, and the canonical uses non-www.

## D. Claims that need verification (will not be invented)
- "15 years of experience" (Dr. Nitin Aryal): About, Doctors
- "3,000+ procedures": Doctors, Implants page
- "500+ international patients": Doctors
- "Over 1,200 international patients from 40+ countries": Reviews
- "#1 Treatment for Dental Tourism", "$3,000+ in USA": Implants page
- "FDA-approved, internationally certified materials": About, Home
- "Written Guarantees", "Care Guaranteed": Pricing, Reviews
- "Painless": FAQ on the Implants page
- "Founded in 2023": About
- The international price comparison table on Pricing
- Whether all 6 testimonials are from real patients, and whether consent is on file for before/after photos

## E. Information needed from you
1. The clinic's real phone number, full street address, and Google Maps link or coordinates
2. Opening hours, and the clinic's Google Business Profile URL
3. Dr. Nitin Aryal's degrees and NMC registration number, plus the same for any other dentists
4. Which of the claims in section D are true, and the source for each
5. Who should be named as medical reviewer on treatment pages
6. A real clinic or doctor photo to use as the share image
7. Social profile URLs (Facebook, Instagram, etc.)

## F. Proposed changes by phase
- **Phase 1, technical (safe):** fix schema NAP using placeholders until you confirm the details, add missing alt text, add lazy loading, check that titles and descriptions are unique on every route, tone down the superlatives in the sitewide description, remove the orphaned implants page after moving its useful content into `/services/single-implants`, remove the unused CRM admin routes, and clean up the sitemap `lastmod` dates.
- **Phase 2, trust:** structured doctor profiles (credentials, NMC number, Person schema), a "Medically reviewed by" block on treatment pages, unverified claims replaced or marked TODO, and a consistent NAP block on About and Contact.
- **Phase 3, money pages:** make Home plus Braces, Root Canal, Implants, Crowns, Cleaning, Wisdom Teeth, Extraction, Whitening and Veneers stronger. Each gets a direct-answer intro, who it is for, the steps, recovery, cost guidance (only if you confirm prices), FAQs and internal links.
- **Phase 4, AEO/GEO:** question-style headings, short answer paragraphs, MedicalProcedure, Physician and FAQ schema where they fit, a clear entity summary for the clinic, and stronger internal links and breadcrumbs.
- **Phase 5, content:** a `/dental-cost-guide` page, a `/patient-resources` hub, a knowledge hub using the existing blog system (`/blog`, `/blog/:slug`), and international patient resources added to `/dental-tourism`.

## G. Pages to be modified
`/`, `/services`, every `/services/:slug`, `/about`, `/doctors`, `/contact`, `/pricing`, `/reviews`, `/dental-tourism`, `/faq`, `index.html`, sitemap.xml

## H. Pages to be created (Phase 5, after approval)
`/dental-cost-guide`, `/patient-resources`, `/blog`, `/blog/:slug`

## I. Redirects
- None needed for live URLs.
- Existing browser-side aliases (for example `/services/dental-implants` to `/services/single-implants`) stay. Real server 301s are not possible on this hosting setup.

## Technical notes
- Accurate per-page social previews and full HTML for non-JS crawlers would need server rendering (migrating to TanStack Start). This is optional and not part of this plan.
- Schema stays sitewide in index.html. Per-page schema is added through the existing SEO and Breadcrumbs components.
