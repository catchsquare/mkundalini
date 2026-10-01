import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Search,
  ListChecks,
  Receipt,
  Send,
  FileText,
  CalendarCheck,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { OfferBadge } from "@/components/ui/offer-badge";
import heroImage from "@/assets/hero-dental.jpg";
import { useOffers } from "@/hooks/use-offers";
import { useHeroSlide } from "@/hooks/use-hero-slide";
import { useTestimonials } from "@/hooks/use-testimonials";
import { useTeamMembers } from "@/hooks/use-team-members";
import { SEO } from "@/components/seo/SEO";
import { CLINIC, VERIFIED_DOCTORS } from "@/lib/clinic-info";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const principles = [
  {
    icon: Search,
    title: "Understand the problem",
    text: "Clear explanation of what we find during your consultation.",
  },
  {
    icon: ListChecks,
    title: "Understand your options",
    text: "Discuss appropriate treatment alternatives where available.",
  },
  {
    icon: Receipt,
    title: "Understand the cost",
    text: "Know the expected treatment cost before proceeding.",
  },
];

const treatments = [
  {
    title: "Dental Implants",
    text: "Replace missing teeth with implant-based treatment planned for the individual patient's case.",
    link: "/services/single-implants",
  },
  {
    title: "Braces & Orthodontics",
    text: "Treatment options for improving tooth alignment and bite.",
    link: "/services/braces",
  },
  {
    title: "Root Canal Treatment",
    text: "Treatment for infected or inflamed tissue inside a tooth, with the aim of preserving the natural tooth when appropriate.",
    link: "/services/root-canal",
  },
  {
    title: "Crowns & Bridges",
    text: "Restore damaged teeth or replace missing teeth with individually planned restorations.",
    link: "/services/crowns-bridges",
  },
  {
    title: "Scaling & Cleaning",
    text: "Professional cleaning to remove plaque and hardened deposits that regular brushing cannot completely remove.",
    link: "/services/cleaning",
  },
  {
    title: "Tooth Extraction & Wisdom Teeth",
    text: "Assessment and extraction when a tooth cannot appropriately be retained or when a wisdom tooth is causing problems.",
    link: "/services/extractions",
  },
  {
    title: "Cosmetic Dentistry",
    text: "Whitening, veneers and other options for patients looking to improve the appearance of their smile.",
    link: "/services",
  },
];

const abroadSteps = [
  {
    icon: Send,
    title: "Before You Travel",
    text: "Contact the clinic through WhatsApp and tell us what treatment or dental concern you would like assessed.",
  },
  {
    icon: FileText,
    title: "Share Existing Information",
    text: "If available, send your dental X-rays or previous reports before your visit.",
  },
  {
    icon: CalendarCheck,
    title: "Plan Your Appointment",
    text: "Arrange your initial consultation around your time in Kathmandu.",
  },
];

// Every entry here is rendered visibly AND used for FAQPage schema — keep them in sync.
const faqs = [
  {
    q: "Where is Kundalini Dental Clinic located?",
    a: "Kundalini Dental Clinic is located on the Ground Floor of Goreto Bhawan, Chappal Karkhana, Kathmandu, Bagmati Province 44600, Nepal.",
  },
  {
    q: "What are Kundalini Dental Clinic's opening hours?",
    a: "Kundalini Dental Clinic is open Sunday to Friday from 9:30 AM to 6:30 PM and Saturday from 10:00 AM to 2:00 PM.",
  },
  {
    q: "How can I book a dental appointment?",
    a: "You can contact Kundalini Dental Clinic by phone or WhatsApp at +977-9802808008 to request an appointment.",
  },
  {
    q: "What dental treatments are available?",
    a: "Kundalini Dental Clinic provides general, restorative, orthodontic, implant and cosmetic dental care, including scaling and cleaning, fillings, root canal treatment, crowns and bridges, braces, dental implants, extractions, whitening and veneers.",
  },
  {
    q: "Can I contact the clinic before travelling to Nepal?",
    a: "Yes. Patients living abroad can contact the clinic before travelling to discuss their dental concerns and arrange an initial appointment. Final treatment recommendations require appropriate clinical assessment.",
  },
  {
    q: "Can I send my dental X-rays or reports before travelling?",
    a: "Yes. Existing dental X-rays and reports can be shared with Kundalini Dental Clinic through WhatsApp before your visit. They may help the clinic understand your dental concerns and prepare for your consultation, but they do not replace an appropriate clinical examination.",
  },
  {
    q: "How much does dental treatment cost in Kathmandu?",
    a: "Dental treatment costs depend on the type of treatment, complexity, materials and the patient's individual clinical needs. Kundalini Dental Clinic can explain expected treatment costs after appropriate assessment. Published treatment prices should only be used where they have been separately verified.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <motion.div {...fadeUp} className="max-w-2xl mb-10 sm:mb-12">
      <h2 id={id} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
        {title}
      </h2>
      {intro && <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{intro}</p>}
    </motion.div>
  );
}

export default function HomePage() {
  const { offers } = useOffers();
  const { slide: homeHero } = useHeroSlide("home");
  // Only display testimonials whose provenance/patient consent is verified (Phase 2A trust correction).
  const UNVERIFIED_TESTIMONIAL_NAMES = new Set(["Sarah Mitchell", "James Thompson", "Priya Patel"]);
  const { testimonials } = useTestimonials({ limit: 3 });
  const verifiedTestimonials = testimonials.filter(
    (t) => !UNVERIFIED_TESTIMONIAL_NAMES.has((t.patient_name || "").trim())
  );
  const { featuredMember } = useTeamMembers();

  const featuredOffer = offers.length > 0 ? offers[0] : null;
  const heroBg = homeHero?.image_url || heroImage;
  const nitin = VERIFIED_DOCTORS[0];
  const bhawana = VERIFIED_DOCTORS[1];
  // Only use an uploaded team photo when it belongs to Dr. Nitin Aryal.
  const nitinPhoto =
    featuredMember?.full_name?.toLowerCase().includes("nitin") && featuredMember.photo_url
      ? featuredMember.photo_url
      : null;

  return (
    <Layout>
      <SEO
        title="Dental Clinic in Kathmandu | Kundalini Dental Clinic"
        description="Kundalini Dental Clinic provides dental care in Chappal Karkhana, Kathmandu, including braces, root canal treatment, implants, crowns, cleaning and cosmetic dentistry."
        path="/"
        jsonLd={faqSchema}
      />

      {/* 1. Hero */}
      <section
        aria-labelledby="home-hero-title"
        className="relative flex items-center pt-24 sm:pt-32 pb-12 sm:pb-20 lg:min-h-[85vh]"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />
        </div>

        {featuredOffer && (
          <OfferBadge
            text={featuredOffer.badge_text || "Offer"}
            highlight={featuredOffer.title}
            link={featuredOffer.cta_link || "/contact"}
            position="bottom-right"
          />
        )}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1
              id="home-hero-title"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-5 sm:mb-6"
            >
              Dental Clinic in Kathmandu for{" "}
              <span className="text-primary">Complete Dental Care</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
              Kundalini Dental Clinic in Chappal Karkhana, Kathmandu provides routine dental care, braces, root
              canal treatment, crowns, dental implants and cosmetic dentistry. Every visit starts with clear
              treatment planning and personalised care.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
              <Button asChild size="lg" className="h-12 sm:h-14 text-base px-6 sm:px-8">
                <Link to="/contact">
                  Book an Appointment
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 text-base px-6 sm:px-8">
                <a href={CLINIC.whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground border-t border-border/60 pt-5">
              Established in {CLINIC.establishedYear} • {nitin.name}, {nitin.qualification} • NMC{" "}
              {nitin.nmcNumber} • Practising dentistry since {nitin.practisingSince}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Positioning */}
      <section aria-labelledby="home-options" className="section-padding bg-muted/40 border-y border-border/50">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            id="home-options"
            title="Know Your Options Before You Decide"
            intro="Dental treatment shouldn't begin with confusion. We explain what we find, the treatment options available, expected costs and the next steps before you decide how to proceed."
          />
          <div className="grid gap-8 sm:grid-cols-3">
            {principles.map((p) => (
              <motion.div key={p.title} {...fadeUp} className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Treatments */}
      <section aria-labelledby="home-treatments" className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            id="home-treatments"
            title="Dental Treatments at Kundalini Dental Clinic"
            intro="Kundalini Dental Clinic offers general, restorative, orthodontic, implant and cosmetic dental care in Kathmandu."
          />
          <ul className="grid gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.map((t) => (
              <li key={t.title} className="bg-background">
                <Link
                  to={t.link}
                  className="group flex h-full flex-col p-6 sm:p-7 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{t.text}</p>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Learn about {t.title.toLowerCase()}
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg" className="h-12">
              <Link to="/services">
                View All Dental Treatments
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Dental team */}
      <section aria-labelledby="home-team" className="section-padding bg-muted/40">
        <div className="mx-auto max-w-7xl">
          <SectionHeading id="home-team" title="Meet Your Dental Team" />
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { doc: nitin, photo: nitinPhoto },
              { doc: bhawana, photo: null as string | null },
            ].map(({ doc, photo }) => (
              <motion.article key={doc.slug} {...fadeUp} className="card-elevated p-6 sm:p-7 flex gap-5 items-start">
                {photo ? (
                  <img
                    src={photo}
                    alt={`${doc.name}, ${doc.qualification}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0"
                    loading="lazy"
                    width={96}
                    height={96}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-semibold flex-shrink-0"
                  >
                    {doc.name.replace("Dr. ", "").split(" ").map((p) => p[0]).join("")}
                  </div>
                )}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{doc.qualification}</p>
                  {doc.nmcNumber && (
                    <p className="text-sm text-muted-foreground">NMC Registration No. {doc.nmcNumber}</p>
                  )}
                  <p className="text-sm text-muted-foreground mb-3">
                    {doc.name} has been practising dentistry since {doc.practisingSince}.
                  </p>
                  <Link
                    to={`/doctors/${doc.slug}`}
                    className="inline-flex items-center text-sm font-medium text-primary"
                  >
                    View {doc.name}'s profile
                    <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg" className="h-12">
              <Link to="/doctors">
                Meet Our Dental Team
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Local */}
      <section aria-labelledby="home-local" className="section-padding bg-background">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <SectionHeading
              id="home-local"
              title="Your Dental Clinic in Chappal Karkhana, Kathmandu"
              intro="Kundalini Dental Clinic is located on the Ground Floor of Goreto Bhawan, Chappal Karkhana, Kathmandu. Patients can contact the clinic by phone or WhatsApp to ask about appointments, treatment availability or an existing treatment plan."
            />
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Button asChild size="lg" className="h-12">
                <a href={CLINIC.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                  Get Directions
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12">
                <a href={CLINIC.phoneHref}>
                  <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                  Call Clinic
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12">
                <a href={CLINIC.whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>

          <motion.div {...fadeUp} className="card-elevated p-6 sm:p-8 space-y-6">
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Address</h3>
                <address className="not-italic text-sm text-muted-foreground leading-relaxed">
                  {CLINIC.name}
                  <br />
                  {CLINIC.address.street}
                  <br />
                  {CLINIC.address.locality}, {CLINIC.address.region} {CLINIC.address.postalCode}
                  <br />
                  {CLINIC.address.countryName}
                </address>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Opening hours</h3>
                <dl className="text-sm text-muted-foreground space-y-1">
                  {CLINIC.openingSchedule.map((row) => (
                    <div key={row.label} className="flex gap-3">
                      <dt className="min-w-[7.5rem]">{row.label}</dt>
                      <dd className="text-foreground">{row.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                <a href={CLINIC.phoneHref} className="text-sm text-foreground hover:text-primary">
                  {CLINIC.phone}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Nepalis living abroad */}
      <section aria-labelledby="home-abroad" className="section-padding bg-muted/40">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            id="home-abroad"
            title="Coming to Nepal and Planning Dental Treatment?"
            intro="If you live abroad and are planning dental treatment during a visit to Nepal, contact us before you travel. You can share your dental concerns, existing X-rays or dental reports through WhatsApp so our team can understand what you may need assessed when you arrive."
          />
          <ol className="grid gap-6 sm:grid-cols-3">
            {abroadSteps.map((s, i) => (
              <motion.li key={s.title} {...fadeUp} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <s.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </motion.li>
            ))}
          </ol>
          <p className="mt-8 flex gap-2 text-sm text-muted-foreground max-w-3xl">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" aria-hidden="true" />
            Final diagnosis, treatment recommendations, treatment duration and costs depend on appropriate
            clinical assessment.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="h-12">
              <a href={CLINIC.whatsappHref} target="_blank" rel="noopener noreferrer">
                Plan Your Dental Visit
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. International patients */}
      <section aria-labelledby="home-international" className="section-padding bg-background">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp}>
            <h2 id="home-international" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
              Dental Treatment in Kathmandu for International Patients
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
              Kundalini Dental Clinic also welcomes international patients considering dental treatment while
              visiting Nepal. Contact the clinic before travelling to discuss your dental concerns, the type of
              consultation you may need and the information you should bring with you.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Existing dental X-rays or reports can be shared through WhatsApp before your visit where helpful.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Final treatment recommendations, duration and costs depend on an in-person clinical assessment and
              any necessary investigations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="h-12">
                <a href={CLINIC.whatsappHref} target="_blank" rel="noopener noreferrer">
                  Ask About Treatment in Nepal
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-12">
                <Link to="/dental-tourism">International patient information</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Pricing */}
      <section aria-labelledby="home-pricing" className="section-padding bg-muted/40 border-y border-border/50">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp}>
            <h2 id="home-pricing" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
              Clear Dental Treatment Pricing
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
              Treatment costs vary depending on the condition being treated, treatment complexity, materials used
              and the treatment plan recommended after assessment. Where possible, we explain expected treatment
              costs before treatment begins.
            </p>
            <Button asChild variant="outline" size="lg" className="h-12">
              <Link to="/pricing">
                View Treatment Prices
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 9. Patient reviews — existing approved testimonials only, shown verbatim */}
      {verifiedTestimonials.length > 0 && (
        <section aria-labelledby="home-reviews" className="section-padding bg-background">
          <div className="mx-auto max-w-7xl">
            <SectionHeading id="home-reviews" title="What Our Patients Say" />
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <motion.figure key={t.id} {...fadeUp} className="card-elevated p-6 sm:p-7 flex flex-col">
                  <blockquote className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                    "{t.content}"
                  </blockquote>
                  <figcaption className="border-t border-border pt-4 mt-5">
                    <div className="font-semibold text-foreground text-sm">{t.patient_name}</div>
                    {(t.patient_location || t.treatment_type) && (
                      <div className="text-xs text-muted-foreground">
                        {[t.patient_location, t.treatment_type].filter(Boolean).join(" • ")}
                      </div>
                    )}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild variant="outline" size="lg" className="h-12">
                <Link to="/reviews">
                  Read More Reviews
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 10. FAQ */}
      <section aria-labelledby="home-faq" className="section-padding bg-muted/40">
        <div className="mx-auto max-w-3xl">
          <SectionHeading id="home-faq" title="Questions About Visiting a Dentist in Kathmandu" />
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link to="/faq" className="inline-flex items-center font-medium text-primary">
              More frequently asked questions
              <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* 11. Final conversion */}
      <section aria-labelledby="home-final-cta" className="section-padding bg-background">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 id="home-final-cta" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
              Ready to Talk About Your Dental Care?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
              Book an appointment at Kundalini Dental Clinic in Chappal Karkhana, Kathmandu, or contact the clinic
              on WhatsApp with your questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="h-12 sm:h-14 px-6 sm:px-8">
                <Link to="/contact">
                  Book Appointment
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 px-6 sm:px-8">
                <a href={CLINIC.whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                  WhatsApp Us
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 px-6 sm:px-8">
                <a href={CLINIC.phoneHref}>
                  <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                  Call {CLINIC.phone}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
