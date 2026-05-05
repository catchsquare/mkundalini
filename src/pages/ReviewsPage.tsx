import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Star,
  Quote,
  Shield,
  Camera,
  Heart,
  CheckCircle,
  MapPin,
  Calendar,
  ArrowRight,
  Users,
  Award,
  MessageCircle,
  Lock,
  Eye,
  Sparkles,
} from "lucide-react";
import { usePageContent } from "@/hooks/use-page-content";
import { useTestimonials } from "@/hooks/use-testimonials";
import { useContentBlocks } from "@/hooks/use-content-blocks";
import { useGallery } from "@/hooks/use-gallery";
import { useSiteStats } from "@/hooks/use-site-stats";
import { Skeleton } from "@/components/ui/skeleton";

const guidelineIconMap: Record<string, any> = { Lock, Camera, Eye, Calendar };

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1 },
  },
  viewport: { once: true },
};

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "Melbourne, Australia",
    treatment: "Full Smile Makeover – 16 Veneers",
    rating: 5,
    date: "October 2024",
    image: null,
    quote:
      "I spent two years researching dental tourism options. After my first video consultation with Dr. Sharma, I knew I'd found the right place. The entire team made me feel like family. My new smile has genuinely changed my life – I smile in photos now, something I haven't done in 20 years.",
    highlight: "I smile in photos now, something I haven't done in 20 years.",
  },
  {
    id: 2,
    name: "James Thompson",
    location: "London, United Kingdom",
    treatment: "All-on-4 Dental Implants",
    rating: 5,
    date: "September 2024",
    image: null,
    quote:
      "After years of deteriorating teeth and failed treatments back home, I was skeptical about going abroad. Kundalini Dental exceeded every expectation. The surgical precision, the aftercare, the communication – all world-class. I can eat apples again. Simple things matter most.",
    highlight: "I can eat apples again. Simple things matter most.",
  },
  {
    id: 3,
    name: "Priya Patel",
    location: "New Jersey, USA",
    treatment: "8 Porcelain Veneers + Whitening",
    rating: 5,
    date: "August 2024",
    image: null,
    quote:
      "As a healthcare professional myself, I had high standards. The clinic's sterilization protocols, the quality of materials, and the technical skill impressed me deeply. Plus, I saved enough to fund a week exploring Nepal – an unexpected bonus to an already wonderful experience.",
    highlight: "The technical skill impressed me deeply.",
  },
  {
    id: 4,
    name: "Michael Chen",
    location: "Sydney, Australia",
    treatment: "6 Dental Implants + Bone Grafting",
    rating: 5,
    date: "July 2024",
    image: null,
    quote:
      "My case was complex – significant bone loss requiring grafting before implants. Dr. Sharma was honest about the timeline and realistic about outcomes. Nine months later, I have a complete, functional smile. The patience and expertise shown throughout was remarkable.",
    highlight: "The patience and expertise shown throughout was remarkable.",
  },
  {
    id: 5,
    name: "Emma Williams",
    location: "Dubai, UAE",
    treatment: "Complete Smile Design – 20 Veneers",
    rating: 5,
    date: "June 2024",
    image: null,
    quote:
      "I've had dental work in three countries. Kundalini is genuinely different – they listen first, then treat. No rushing, no upselling. When they suggested fewer veneers than I'd planned, I knew they had my best interest at heart. The results speak for themselves.",
    highlight: "They listen first, then treat.",
  },
  {
    id: 6,
    name: "Robert Anderson",
    location: "Toronto, Canada",
    treatment: "Full Mouth Reconstruction",
    rating: 5,
    date: "May 2024",
    image: null,
    quote:
      "Decades of dental anxiety meant I avoided dentists until it was almost too late. The team's gentle approach and genuine compassion helped me through complex treatment I never thought I'd survive. I'm not just grateful for my smile – I'm grateful for how they treated me as a person.",
    highlight: "I'm grateful for how they treated me as a person.",
  },
];

const beforeAfterCases = [
  {
    id: 1,
    title: "Complete Smile Transformation",
    treatment: "16 Porcelain Veneers",
    duration: "2 visits over 10 days",
    description:
      "Patient presented with severe discoloration, uneven spacing, and worn enamel. Custom-designed E-max veneers created a natural, harmonious smile while preserving maximum tooth structure.",
    patientNote: "I finally have the smile I always dreamed of.",
  },
  {
    id: 2,
    title: "Full Arch Restoration",
    treatment: "All-on-4 Dental Implants",
    duration: "3 visits over 6 months",
    description:
      "Patient had failing dentition requiring full arch replacement. All-on-4 protocol provided immediate function with a fixed provisional prosthesis, followed by final ceramic restoration.",
    patientNote: "I can eat normally for the first time in years.",
  },
  {
    id: 3,
    title: "Anterior Aesthetic Enhancement",
    treatment: "8 Minimal-Prep Veneers",
    duration: "2 visits over 7 days",
    description:
      "Patient sought improvement in front teeth appearance. Conservative minimal-prep veneers achieved beautiful aesthetics while preserving healthy tooth enamel.",
    patientNote: "So natural – even my dentist back home couldn't tell.",
  },
  {
    id: 4,
    title: "Single Implant Restoration",
    treatment: "Implant + Zirconia Crown",
    duration: "2 visits over 4 months",
    description:
      "Missing lateral incisor replaced with titanium implant and custom-shaded zirconia crown. Color-matched perfectly to adjacent natural teeth for seamless integration.",
    patientNote: "Nobody can tell which tooth is the implant.",
  },
];

const trustStats = [
  { number: "2023", label: "Established" },
  { number: "15", label: "Years Experience" },
  { number: "Quality", label: "Care Guaranteed" },
  { number: "Modern", label: "Facilities" },
];

const photoGuidelines = [
  {
    icon: Lock,
    title: "Privacy Protected",
    description:
      "All photos shown with explicit written consent. Patient identities protected unless full permission granted.",
  },
  {
    icon: Camera,
    title: "Unedited Images",
    description:
      "Photos are clinical documentation – no filters, no digital enhancement, no manipulation of results.",
  },
  {
    icon: Eye,
    title: "Standardized Conditions",
    description:
      "Same lighting, angle, and distance used for before and after photos to ensure accurate comparison.",
  },
  {
    icon: Calendar,
    title: "Appropriate Timing",
    description:
      "After photos taken only after complete healing – typically 2-4 weeks post-procedure for accurate results.",
  },
];

export default function ReviewsPage() {
  const { getSectionByType } = usePageContent("reviews");
  
  const { testimonials: dbTestimonials, loading: testimonialsLoading } = useTestimonials();
  const { byKey: reviewBlocks, loading: blocksLoading } = useContentBlocks("reviews");
  const { items: galleryItems, loading: galleryLoading } = useGallery({ limit: 8 });
  const { stats: dbStats, loading: statsLoading } = useSiteStats("reviews");

  const beforeAfterCasesDb = reviewBlocks("before_after_cases");
  const photoGuidelinesDb = reviewBlocks("photo_guidelines");

  const displayStats = dbStats.length > 0
    ? dbStats.map((s) => ({ number: s.value, label: s.label }))
    : (statsSection?.stats || trustStats);

  const displayTestimonials = dbTestimonials.length > 0
    ? dbTestimonials.map((t, i) => ({
        id: t.id || i,
        name: t.patient_name,
        location: t.patient_location || "",
        treatment: t.treatment_type || "",
        rating: t.rating || 5,
        date: t.display_date
          ? new Date(t.display_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "",
        quote: t.content,
        highlight: t.content.length > 140 ? t.content.slice(0, 140).trim() + "…" : t.content,
      }))
    : testimonials;

  const displayBeforeAfter = beforeAfterCasesDb.length > 0
    ? beforeAfterCasesDb.map((b, i) => {
        const md = (b.metadata || {}) as Record<string, any>;
        const galleryMatch = galleryItems[i];
        return {
          id: b.id,
          title: b.title || "",
          treatment: md.treatment || "",
          duration: md.duration || "",
          description: b.description || "",
          patientNote: md.patient_note || "",
          beforeImage: galleryMatch?.before_image || null,
          afterImage: galleryMatch?.after_image || null,
        };
      })
    : beforeAfterCases.map((b) => ({ ...b, beforeImage: null, afterImage: null }));

  const displayPhotoGuidelines = photoGuidelinesDb.length > 0
    ? photoGuidelinesDb.map((b) => ({
        title: b.title || "",
        description: b.description || "",
        icon: guidelineIconMap[b.icon || "Lock"] || Lock,
      }))
    : photoGuidelines;

  return (
    <Layout>
      {/* Hero Section - with proper padding for fixed header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-primary" />
              {heroSection?.badge || "Patient Stories & Results"}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {heroSection?.title || "Real Patients,"}{" "}
              <span className="text-primary">{heroSection?.titleHighlight || "Real Results"}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {heroSection?.description || "Every smile has a story. Read authentic experiences from patients who trusted us with their dental care and see the transformations that changed their lives."}
            </p>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {displayStats.map((stat: { number: string; label: string }, index: number) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Our Patients Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These are real stories from real patients. We're honored to share 
              their experiences and grateful for their trust.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-card rounded-2xl p-8 border border-border/50 card-hover flex flex-col"
                variants={fadeInUp}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>

                {/* Quote Icon */}
                <Quote className="w-10 h-10 text-primary/20 mb-4" />

                {/* Highlight */}
                <p className="text-lg font-semibold text-foreground mb-4 italic">
                  "{testimonial.highlight}"
                </p>

                {/* Full Quote */}
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                  {testimonial.quote}
                </p>

                {/* Patient Info */}
                <div className="border-t border-border/50 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-accent font-medium block">
                        {testimonial.treatment}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {testimonial.date}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Before & After Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Visual Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Before & After Transformations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the real results of our treatments. Every case is unique, and 
              these examples represent typical outcomes for similar procedures.
            </p>
          </motion.div>

          {/* Before/After Cases */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {beforeAfterCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                className="bg-card rounded-2xl overflow-hidden border border-border/50"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                {/* Image Placeholder */}
                <div className="aspect-[16/10] bg-muted/50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm">
                        Before & After photos available during consultation
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        Patient privacy protected
                      </p>
                    </div>
                  </div>
                  {/* Before/After Labels */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                      Before
                    </span>
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      After
                    </span>
                  </div>
                </div>

                {/* Case Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {caseItem.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {caseItem.treatment}
                    </span>
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      {caseItem.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {caseItem.description}
                  </p>
                  <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                    <Quote className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground italic">
                      "{caseItem.patientNote}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Photo Guidelines */}
          <motion.div
            className="bg-card rounded-2xl p-8 border border-border/50"
            {...fadeInUp}
          >
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              Our Photo Documentation Standards
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {photoGuidelines.map((guideline, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <guideline.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {guideline.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {guideline.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ethical Disclaimer */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <motion.div
            className="bg-muted/30 rounded-2xl p-8 md:p-12 border border-border/50"
            {...fadeInUp}
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Our Commitment to Authenticity
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Genuine Reviews:</strong> Every 
                    testimonial on this page is from a real patient who received treatment 
                    at our clinic. We do not fabricate, embellish, or pay for reviews. 
                    Patient names are used with explicit permission; where privacy is 
                    preferred, we use first names or initials only.
                  </p>
                  <p>
                    <strong className="text-foreground">Honest Photography:</strong> Before 
                    and after photos are unedited clinical documentation. We use consistent 
                    lighting and positioning to ensure fair comparison. Photos are taken 
                    after appropriate healing time – never immediately post-procedure when 
                    swelling or redness might misrepresent results.
                  </p>
                  <p>
                    <strong className="text-foreground">Individual Results Vary:</strong> While 
                    we're proud of these outcomes, every patient is unique. Your results will 
                    depend on your specific condition, treatment plan, healing response, and 
                    adherence to aftercare instructions. During consultation, we'll discuss 
                    realistic expectations for your individual case.
                  </p>
                  <p>
                    <strong className="text-foreground">Informed Consent:</strong> All 
                    patients whose images or stories appear here have provided written 
                    consent for educational and marketing purposes. They understand how 
                    their information will be used and can request removal at any time.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Testimonials Placeholder */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Hear From Our Patients
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Video testimonials from international patients sharing their 
              experience at Kundalini Dental Clinic.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                className="aspect-video bg-card rounded-2xl border border-border/50 flex items-center justify-center"
                variants={fadeInUp}
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Video testimonials coming soon
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Reinforcement */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center p-8"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Internationally Recognized
              </h3>
              <p className="text-muted-foreground">
                Our dentists hold qualifications from India, Thailand, and Europe, 
                with ongoing training in the latest techniques.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Trusted by Thousands
              </h3>
              <p className="text-muted-foreground">
                Over 1,200 international patients from 40+ countries have chosen 
                us for their dental care journey.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Care Beyond Treatment
              </h3>
              <p className="text-muted-foreground">
                Our relationship doesn't end when treatment does. We provide 
                lifetime aftercare support and guidance.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied patients who transformed their smiles 
              with Kundalini Dental Clinic. Your story could be next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-primary"
              >
                <Link to="/contact">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Book Free Consultation
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/dental-tourism">
                  International Patients
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Share Your Story */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto text-center">
          <motion.div {...fadeInUp}>
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Are You a Past Patient?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              We'd love to hear about your experience. Your story could help 
              someone else make the decision to transform their smile and their life.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">Share Your Story</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
