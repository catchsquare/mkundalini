import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Plane,
  Hotel,
  Stethoscope,
  Calendar,
  DollarSign,
  MessageCircle,
  Check,
  Globe,
  Shield,
  Award,
  Clock,
  Video,
  FileText,
  HeartPulse,
  Phone,
  Mail,
  Users,
  BadgeCheck,
  MapPin,
  Sparkles,
  Building,
  HandHeart,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePageContent } from "@/hooks/use-page-content";
import { useContentBlocks } from "@/hooks/use-content-blocks";
import { useHeroSlide } from "@/hooks/use-hero-slide";
import { useFaqs } from "@/hooks/use-faqs";
import { Skeleton } from "@/components/ui/skeleton";
import { getIcon } from "@/lib/icon-map";

const resolveIcon = (icon: any) => (typeof icon === "string" ? getIcon(icon) : icon);

const fallbackWhyNepal = [
  {
    icon: DollarSign,
    title: "Significant Cost Savings",
    description: "Save 60-80% on dental treatments compared to USA, UK, Australia, and Europe — without compromising on quality. The lower cost of living in Nepal allows us to offer world-class care at accessible prices.",
  },
  {
    icon: Award,
    title: "Internationally Trained Dentists",
    description: "Our specialists trained at leading institutions in India, USA, UK, and Germany. They bring global expertise and stay current with the latest techniques through continuous education.",
  },
  {
    icon: Shield,
    title: "Same Materials, Same Standards",
    description: "We use the same FDA-approved implants, German crowns, and premium materials as top clinics in Western countries. No shortcuts, no compromises.",
  },
  {
    icon: Globe,
    title: "English-Speaking Care",
    description: "Our entire team speaks fluent English. You'll never face communication barriers during consultations, treatment, or aftercare.",
  },
  {
    icon: Clock,
    title: "No Waiting Lists",
    description: "Unlike many countries where dental appointments can take months, we can typically schedule your treatment within days of your arrival.",
  },
  {
    icon: MapPin,
    title: "Unforgettable Destination",
    description: "Combine your dental treatment with an experience of a lifetime. Nepal offers Himalayan vistas, ancient culture, and warm hospitality.",
  },
];

const fallbackWhyKundalini = [
  {
    title: "15 Years of Experience",
    description: "Led by Dr. Nitin Aryal with 15 years of dental expertise, our clinic established in 2023 combines experienced leadership with modern facilities.",
  },
  {
    title: "Specialist-Led Care",
    description: "Your treatment is performed by qualified dental professionals dedicated to their area of expertise.",
  },
  {
    title: "Modern Technology",
    description: "We use contemporary dental technology for accurate diagnostics and efficient treatments.",
  },
  {
    title: "Transparent Pricing",
    description: "Complete cost breakdown before you travel. No hidden fees, no surprises. The price we quote is the price you pay.",
  },
  {
    title: "Dedicated Patient Coordinator",
    description: "One point of contact who speaks your language and handles everything from scheduling to travel assistance.",
  },
  {
    title: "Comprehensive Documentation",
    description: "Full treatment records, X-rays, and care instructions provided for your home dentist.",
  },
];

const fallbackConsultationProcess = [
  {
    step: 1,
    title: "Initial Contact",
    duration: "Day 1",
    description: "Reach out via our contact form, email, or WhatsApp. Tell us about your dental concerns and what you're hoping to achieve.",
    icon: MessageCircle,
  },
  {
    step: 2,
    title: "Share Your Records",
    duration: "Days 1-2",
    description: "Send us any existing X-rays, photos of your teeth, and relevant medical history. If you don't have recent X-rays, that's okay — we'll take them when you arrive.",
    icon: FileText,
  },
  {
    step: 3,
    title: "Video Consultation",
    duration: "Day 3-5",
    description: "Schedule a free video call with one of our specialists. We'll discuss your case, answer all your questions, and explain your treatment options in detail.",
    icon: Video,
  },
  {
    step: 4,
    title: "Detailed Treatment Plan",
    duration: "Within 48 hours",
    description: "Receive a comprehensive treatment plan including procedures, timeline, and complete cost breakdown. No obligations — take your time to decide.",
    icon: Calendar,
  },
];

const fallbackTreatmentTimelines = [
  {
    treatment: "Single Dental Implant",
    firstVisit: "2-3 days",
    healingPeriod: "3-4 months",
    secondVisit: "2-3 days",
    totalStay: "5-7 days (initial visit)",
    notes: "Crown placed on return visit, or we coordinate with your home dentist",
  },
  {
    treatment: "Multiple Implants",
    firstVisit: "3-5 days",
    healingPeriod: "3-4 months",
    secondVisit: "3-5 days",
    totalStay: "7-10 days (initial visit)",
    notes: "All implants placed in first visit for efficiency",
  },
  {
    treatment: "Porcelain Veneers (8-10)",
    firstVisit: "5-7 days",
    healingPeriod: "None",
    secondVisit: "Not required",
    totalStay: "7-10 days total",
    notes: "Complete in single visit with CAD/CAM technology",
  },
  {
    treatment: "All-on-4 Full Arch",
    firstVisit: "5-7 days",
    healingPeriod: "3-6 months",
    secondVisit: "3-5 days",
    totalStay: "10-14 days (initial visit)",
    notes: "Temporary teeth placed immediately; permanent on return",
  },
  {
    treatment: "Root Canal + Crown",
    firstVisit: "3-4 days",
    healingPeriod: "None",
    secondVisit: "Not required",
    totalStay: "5-7 days total",
    notes: "Same-day crown available in most cases",
  },
];

const fallbackCostTransparencyPoints = [
  "Complete written quote before you book travel",
  "All-inclusive pricing — no hidden fees",
  "Price includes consultation, treatment, follow-ups",
  "Payment in USD, EUR, GBP, or AUD accepted",
  "Credit cards and bank transfers welcome",
  "Itemized invoices for insurance reimbursement",
];

const fallbackTravelGuidance = [
  {
    title: "Getting Here",
    points: [
      "Tribhuvan International Airport (KTM) serves Kathmandu with connections from major Asian hubs: Delhi, Dubai, Doha, Bangkok, Singapore",
      "Direct flights available from major Middle Eastern and Asian cities",
      "Visa on arrival for most nationalities (check your country's requirements)",
      "We can recommend travel agents who specialize in Nepal trips",
    ],
  },
  {
    title: "Accommodation",
    points: [
      "We have partnerships with hotels near our clinic at special rates",
      "Options range from comfortable 3-star to luxury 5-star properties",
      "All partnered hotels are within 15 minutes of the clinic",
      "We can arrange accommodation or you're welcome to book independently",
    ],
  },
  {
    title: "During Your Stay",
    points: [
      "Complimentary airport pickup and clinic transfers",
      "Our coordinator is available via WhatsApp throughout your stay",
      "We can arrange day trips, city tours, and activities between appointments",
      "Kathmandu offers excellent restaurants, shopping, and cultural sites",
    ],
  },
  {
    title: "Health & Safety",
    points: [
      "Nepal is a safe destination for tourists with low crime rates",
      "No special vaccinations required for most visitors",
      "High-quality private hospitals available if needed",
      "We provide emergency contact numbers and support 24/7",
    ],
  },
];

const fallbackAftercareProcess = [
  {
    icon: FileText,
    title: "Complete Documentation",
    description: "You'll receive detailed treatment records, X-rays, photos, and care instructions to share with your home dentist.",
  },
  {
    icon: Phone,
    title: "Ongoing Communication",
    description: "We remain available via WhatsApp and email indefinitely. Questions at 2 AM your time? We'll respond as soon as we're awake.",
  },
  {
    icon: Users,
    title: "Home Dentist Coordination",
    description: "We can communicate directly with your dentist back home to ensure seamless continuity of care.",
  },
  {
    icon: Calendar,
    title: "Follow-Up Scheduling",
    description: "For treatments requiring a return visit, we'll schedule at your convenience, typically 3-4 months after initial treatment.",
  },
  {
    icon: Shield,
    title: "Warranty Coverage",
    description: "All implants come with lifetime warranty. Crowns and restorations are covered for 5-10 years depending on type.",
  },
  {
    icon: HeartPulse,
    title: "Emergency Support",
    description: "In the rare event of complications, we provide guidance immediately and cover any necessary corrections.",
  },
];

const fallbackFaqs = [
  {
    question: "How do I know the quality is really the same as in my country?",
    answer: "We use FDA-approved implants from Straumann (Swiss), Nobel Biocare (Swedish), and other premium manufacturers — the exact same brands used by top clinics in the USA. We're happy to show you the implant packaging and certificates. Our dentists trained at internationally recognized institutions and maintain certifications that are valid globally.",
  },
  {
    question: "What if something goes wrong after I return home?",
    answer: "Complications are rare (our implant success rate is 97%+), but we have protocols in place. We provide 24/7 WhatsApp support, can video consult to assess any concerns, and will cover the cost of any necessary corrections. For implant issues, we coordinate with trusted dentists in major cities worldwide, or you can return to us and we'll cover the treatment cost.",
  },
  {
    question: "Is it safe to travel for dental treatment?",
    answer: "Dental tourism is well-established globally, with millions traveling each year. Nepal is a safe country with a stable tourism industry. Our clinic follows international infection control standards, and we've treated patients from over 25 countries without incident. We recommend purchasing travel insurance that includes medical coverage for peace of mind.",
  },
  {
    question: "How long should I plan to stay?",
    answer: "It depends on your treatment. Simple procedures like veneers or root canals typically require 5-7 days. Implants are usually done in two phases: an initial visit of 5-10 days, then a return visit of 3-5 days after 3-4 months. We'll give you a precise timeline in your treatment plan.",
  },
  {
    question: "Can I combine my dental trip with tourism?",
    answer: "Absolutely! Most patients have free time between appointments. Kathmandu offers ancient temples, vibrant markets, and incredible cuisine. Day trips to the Himalayas, Pokhara, or Chitwan are popular. We can help arrange tours and activities that work around your treatment schedule.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, MasterCard, Amex), bank transfers in USD/EUR/GBP/AUD, and cash. Payment is typically made after consultation when you've confirmed your treatment plan. For large treatments, we can discuss payment in stages.",
  },
  {
    question: "Will my insurance cover treatment abroad?",
    answer: "Many international insurance plans provide reimbursement for dental treatment abroad. We provide detailed itemized invoices with procedure codes that insurance companies recognize. We recommend contacting your insurer before treatment to understand your coverage.",
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer: "We understand that plans change. We don't require deposits, so you can adjust your dates without financial penalty. We just ask for as much notice as possible so we can accommodate other patients. Your treatment plan remains valid for 6 months.",
  },
];

export default function DentalTourismPage() {
  const { getSectionByType } = usePageContent("dental-tourism");
  const { byKey, loading: blocksLoading } = useContentBlocks("dental-tourism");
  const { slide: heroSlide } = useHeroSlide("dental-tourism");
  const { faqs: faqRows, loading: faqsLoading } = useFaqs("dental-tourism");

  const mapList = (key: string, fallback: any[], shape: (b: any) => any) => {
    const rows = byKey(key);
    return rows.length > 0 ? rows.map(shape) : fallback;
  };

  const whyNepal = mapList("why_nepal", fallbackWhyNepal, (b) => ({ icon: b.icon || "Sparkles", title: b.title || "", description: b.description || "" }));
  const whyKundalini = mapList("why_kundalini", fallbackWhyKundalini, (b) => ({ title: b.title || "", description: b.description || "" }));
  const consultationProcess = mapList("consultation_process", fallbackConsultationProcess, (b) => {
    const m = (b.metadata || {}) as any;
    return { step: m.step || 1, title: b.title || "", duration: m.duration || "", description: b.description || "", icon: b.icon || "MessageCircle" };
  });
  const treatmentTimelines = mapList("treatment_timelines", fallbackTreatmentTimelines, (b) => {
    const m = (b.metadata || {}) as any;
    return { treatment: b.title || "", firstVisit: m.first_visit || "", healingPeriod: m.healing_period || "", secondVisit: m.second_visit || "", totalStay: m.total_stay || "", notes: b.description || "" };
  });
  const costTransparencyPoints = mapList("cost_transparency", fallbackCostTransparencyPoints.map((p) => ({ title: p })), (b) => ({ title: b.title || "" })).map((x: any) => x.title);
  const travelGuidance = mapList("travel_guidance", fallbackTravelGuidance, (b) => ({ title: b.title || "", points: ((b.metadata || {}) as any).points || [] }));
  const aftercareProcess = mapList("aftercare_process", fallbackAftercareProcess, (b) => ({ icon: b.icon || "Sparkles", title: b.title || "", description: b.description || "" }));
  const faqs = faqRows.length > 0 ? faqRows.map((f) => ({ question: f.question, answer: f.answer })) : fallbackFaqs;

  const heroSection = heroSlide
    ? { badge: heroSlide.badge_text, title: heroSlide.title, titleHighlight: heroSlide.subtitle, description: heroSlide.description }
    : getSectionByType("hero");
  const statsSection = getSectionByType("quick_stats");
  const whyNepalSection = getSectionByType("why_nepal");
  const whyKundaliniSection = getSectionByType("why_kundalini");

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              {heroSection?.badge || "International Patients"}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              {heroSection?.title || "Your Complete Guide to"}{" "}
              <span className="text-primary">{heroSection?.titleHighlight || "Dental Care in Nepal"}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              {heroSection?.description || "Everything you need to know about receiving world-class dental treatment at Kundalini Dental Clinic. We believe in complete transparency — no surprises, no pressure, just honest information."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">
                  Start with a Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
<Button asChild variant="heroOutline" size="xl">
                <a href="https://wa.me/9779802808008" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Trust Indicators */}
      <section className="bg-secondary text-secondary-foreground py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: "15", label: "Years Experience" },
              { value: "2023", label: "Clinic Established" },
              { value: "Quality", label: "Dental Care" },
              { value: "Premium", label: "Materials Used" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-secondary-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Nepal */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              The Destination
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-5">
              Why Choose Nepal for Dental Care?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Nepal has emerged as a trusted destination for quality dental care. 
              Here's what makes it an excellent choice for international patients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyNepal.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kundalini */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                The Clinic
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6 leading-tight">
                Why Kundalini Dental Clinic?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                There are many dental clinics in Nepal. Here's why international 
                patients specifically choose us — and keep recommending us to 
                friends and family.
              </p>

              <div className="space-y-5">
                {whyKundalini.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/15 via-accent/10 to-muted overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Building className="w-24 h-24 text-primary/30 mx-auto mb-6" />
                    <p className="text-muted-foreground">Clinic Interior Photos</p>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -left-4 lg:-left-8 bottom-8 card-elevated p-5"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-bold text-foreground">Est. 2009</div>
                    <div className="text-sm text-muted-foreground">15+ Years Trusted</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Remote Consultation Process */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Getting Started
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-5">
              Remote Consultation Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Before you book any flights, we'll provide a complete treatment plan 
              and cost estimate — entirely free, with no obligation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {consultationProcess.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-6 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/5">
                  {step.step}
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {step.duration}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Button asChild size="lg">
              <Link to="/contact">
                Start Your Free Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Treatment Timelines */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Planning Your Trip
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-5">
              Treatment Timelines
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              How long you need to stay depends on your treatment. Here are typical 
              timelines to help you plan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-elevated overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-semibold text-foreground">Treatment</th>
                    <th className="text-center p-4 font-semibold text-foreground">First Visit</th>
                    <th className="text-center p-4 font-semibold text-foreground">Healing</th>
                    <th className="text-center p-4 font-semibold text-foreground">Return Visit</th>
                    <th className="text-left p-4 font-semibold text-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {treatmentTimelines.map((row, index) => (
                    <tr key={row.treatment} className={index % 2 === 0 ? '' : 'bg-muted/20'}>
                      <td className="p-4 font-medium text-foreground">{row.treatment}</td>
                      <td className="p-4 text-center text-primary font-medium">{row.firstVisit}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.healingPeriod}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.secondVisit}</td>
                      <td className="p-4 text-sm text-muted-foreground">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 text-center text-muted-foreground"
          >
            We'll provide a precise timeline specific to your treatment plan during consultation.
          </motion.p>
        </div>
      </section>

      {/* Cost Transparency */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                <DollarSign className="w-4 h-4" />
                Our Promise
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-6 leading-tight">
                Complete Cost Transparency
              </h2>
              <p className="text-lg text-secondary-foreground/80 mb-8 leading-relaxed">
                We believe you should know exactly what you're paying for before you 
                make any decisions. Hidden fees and surprise charges have no place 
                in healthcare — especially when you're traveling internationally.
              </p>

              <div className="space-y-4">
                {costTransparencyPoints.map((point, index) => (
                  <motion.div
                    key={point}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-secondary-foreground">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-secondary-foreground/10 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold text-secondary-foreground mb-6">
                What's Included in Your Quote
              </h3>
              <div className="space-y-4">
                {[
                  { item: "Initial consultation & examination", included: true },
                  { item: "All necessary X-rays and 3D scans", included: true },
                  { item: "Treatment procedure(s)", included: true },
                  { item: "All materials and components", included: true },
                  { item: "Follow-up appointments", included: true },
                  { item: "Medication prescriptions", included: true },
                  { item: "Written warranty documentation", included: true },
                  { item: "Detailed records for your home dentist", included: true },
                ].map((row) => (
                  <div key={row.item} className="flex items-center justify-between">
                    <span className="text-secondary-foreground/80">{row.item}</span>
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-secondary-foreground/20">
                <p className="text-sm text-secondary-foreground/70">
                  <strong className="text-secondary-foreground">Not included:</strong> Flights, accommodation, 
                  and personal expenses. We can recommend options but these are booked separately.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Travel Guidance */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Practical Information
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-5">
              Travel & Accommodation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Helpful information to make your trip planning easier. We're here to 
              assist with any questions — just ask.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {travelGuidance.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-6"
              >
                <h3 className="text-xl font-semibold text-foreground mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-accent/10 rounded-2xl p-6 text-center"
          >
            <p className="text-foreground">
              <strong>Need help planning?</strong> Our patient coordinator can answer 
              questions about travel, recommend accommodation, and help you plan your stay. 
              Just reach out — there's no obligation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Aftercare */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Long-Term Care
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-5">
              Aftercare & Follow-Up
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your care doesn't end when you fly home. We remain your dental partner 
              for as long as you need us.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aftercareProcess.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Your Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-5">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="card-elevated px-6 border-none"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Have a question not listed here? We're happy to answer.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-primary">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HandHeart className="w-16 h-16 text-primary-foreground/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              We're Here to Help
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              Traveling for dental care is a significant decision. We understand the 
              questions and concerns you may have. Our team is here to provide honest 
              answers and support — whether you choose us or not.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="bg-background text-primary hover:bg-background/90 shadow-lg"
              >
                <Link to="/contact">
                  Start Your Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <a href="https://wa.me/9771234567890" target="_blank" rel="noopener">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-primary-foreground/70 text-sm">
              <a href="mailto:info@kundalinidental.com" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                info@kundalinidental.com
              </a>
              <a href="tel:+9771234567890" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                +977 1-234-5678
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
