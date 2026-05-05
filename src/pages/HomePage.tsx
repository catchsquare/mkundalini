import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Award, 
  Users, 
  Globe, 
  Phone, 
  Star, 
  Check, 
  ChevronRight,
  Stethoscope,
  Sparkles,
  HeartPulse,
  Clock,
  Plane,
  Hotel,
  BadgeCheck,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { OfferBadge } from "@/components/ui/offer-badge";
import heroImage from "@/assets/hero-dental.jpg";
import iconDentalImplant from "@/assets/services/dental-implant.png";
import iconTeethWhitening from "@/assets/services/teeth-whitening.png";
import iconOrthodontics from "@/assets/services/orthodontics.png";
import iconFullMouth from "@/assets/services/full-mouth-restoration.png";
import { usePageContent } from "@/hooks/use-page-content";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { useOffers } from "@/hooks/use-offers";

// Icon mapping for dynamic content
const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  Shield,
  Award,
  HeartPulse,
  BadgeCheck,
  GraduationCap,
  Clock,
  Users,
  Globe,
  Plane,
  Hotel,
  Phone,
  Star,
  Sparkles,
};

// Default fallback data
const defaultTrustIndicators = [
  {
    icon: "Stethoscope",
    label: "Advanced Technology",
    description: "Modern dental equipment",
  },
  {
    icon: "Shield",
    label: "Hospital-Grade Hygiene",
    description: "Strict sterilization protocols",
  },
  {
    icon: "Award",
    label: "15 Years Experience",
    description: "Led by Dr. Nitin Aryal",
  },
  {
    icon: "HeartPulse",
    label: "Patient Safety First",
    description: "International safety standards",
  },
];

const defaultServices = [
  {
    title: "Dental Implants",
    description: "Premium titanium implants with lifetime warranty. Same-day procedures available for qualified patients.",
    icon: iconDentalImplant,
    highlight: "Save up to 70%",
    link: "/services/dental-implants",
  },
  {
    title: "Cosmetic Dentistry",
    description: "Veneers, professional whitening, and complete smile makeovers designed for natural, lasting beauty.",
    icon: iconTeethWhitening,
    highlight: "Hollywood Smile",
    link: "/services",
  },
  {
    title: "Orthodontics",
    description: "Invisible aligners and modern braces for beautifully aligned teeth. Suitable for all ages.",
    icon: iconOrthodontics,
    highlight: "Invisible Options",
    link: "/services",
  },
  {
    title: "Full Mouth Restoration",
    description: "Comprehensive treatment plans for complex cases. Rebuild your smile with confidence.",
    icon: iconFullMouth,
    highlight: "Complete Care",
    link: "/services",
  },
];

const defaultWhyChooseUs = [
  {
    icon: "BadgeCheck",
    title: "FDA-Approved Materials",
    description: "We exclusively use internationally certified, premium-grade materials for every procedure.",
  },
  {
    icon: "GraduationCap",
    title: "Internationally Trained Team",
    description: "Our specialists trained in the USA, UK, and Europe bring world-class expertise to Nepal.",
  },
  {
    icon: "Clock",
    title: "Efficient Treatment",
    description: "Advanced technology means faster procedures, less chair time, and quicker recovery.",
  },
  {
    icon: "Users",
    title: "Personalized Care",
    description: "Every treatment plan is customized to your unique needs, goals, and budget.",
  },
];

const defaultDoctorCredentials = [
  "Bachelor of Dental Surgery (BDS)",
  "15 years of clinical experience",
  "Managing Director, Kundalini Dental Clinic",
  "Committed to patient-centered care",
  "Expertise in comprehensive dental treatments",
];

const defaultInternationalBenefits = [
  {
    icon: "Plane",
    title: "Airport Pickup",
    description: "Complimentary transportation from Tribhuvan International Airport",
  },
  {
    icon: "Hotel",
    title: "Hotel Arrangements",
    description: "Partnered hotels with special rates for our patients",
  },
  {
    icon: "Globe",
    title: "Virtual Consultation",
    description: "Free video consultation before you travel",
  },
  {
    icon: "Phone",
    title: "24/7 Support",
    description: "Dedicated coordinator throughout your stay",
  },
];

const defaultTestimonials = [
  {
    name: "International Patient",
    location: "Overseas",
    treatment: "Dental Treatment",
    quote: "The clinic provided excellent care with modern facilities. Dr. Nitin Aryal and his team were professional and attentive throughout my treatment.",
    rating: 5,
  },
  {
    name: "Local Patient",
    location: "Kathmandu, Nepal",
    treatment: "Dental Care",
    quote: "I've been coming to Kundalini Dental for my family's dental needs. The staff is friendly and the clinic maintains high standards of hygiene.",
    rating: 5,
  },
  {
    name: "Returning Patient",
    location: "Nepal",
    treatment: "General Dentistry",
    quote: "Dr. Nitin Aryal took the time to explain my treatment options clearly. The clinic's commitment to patient care is evident in every visit.",
    rating: 5,
  },
];

const defaultWhyChooseBullets = [
  "Same quality as clinics in USA, UK & Australia",
  "Save 50-70% compared to Western prices",
  "No waiting lists — appointments within days",
  "English-speaking staff for international patients",
];

export default function HomePage() {
  // Fetch CMS content with static fallback
  const { getSectionByType } = usePageContent('home');
  const { settings } = useGlobalSettings();
  const { offers } = useOffers();
  
  // Get CMS content for each section
  const heroContent = getSectionByType('hero');
  const trustContent = getSectionByType('trust_indicators');
  const servicesContent = getSectionByType('services_grid');
  const whyChooseContent = getSectionByType('why_choose_us');
  const doctorContent = getSectionByType('doctor_highlight');
  const internationalContent = getSectionByType('international');
  const testimonialContent = getSectionByType('testimonials');
  const ctaContent = getSectionByType('cta_strip');
  
  // Get first active offer for the floating badge
  const featuredOffer = offers.length > 0 ? offers[0] : null;
  
  // Build dynamic data with CMS content or fallback to defaults
  const heroData = {
    badge: heroContent?.badge || "Nepal's Leading Dental Care Destination",
    headline: heroContent?.headline || "Exceptional Dental Care,",
    headlineHighlight: heroContent?.headline_highlight || "Exceptional Value",
    description: heroContent?.description || `Quality dental treatments at accessible prices. Led by ${settings.managing_director} with ${settings.managing_director_experience} of experience, we deliver professional care and beautiful, lasting results.`,
    backgroundImage: heroContent?.background_image || heroImage,
    ctaPrimary: heroContent?.cta_primary || { label: "Book Your Appointment", link: "/contact" },
    ctaSecondary: heroContent?.cta_secondary || { label: "International Patient? Start Here", link: "/dental-tourism" },
    stats: heroContent?.stats || [
      { value: settings.managing_director_experience?.replace(' years', '') || "15", label: "Years Experience" },
      { value: settings.established_year || "2023", label: "Established" },
      { value: "Premium", label: "Quality Care" }
    ]
  };
  
  // Trust indicators
  const trustData = trustContent?.items || defaultTrustIndicators;
  
  // Services - override icons by title so CMS-stored emojis get replaced with brand icons
  const serviceIconOverrides: Record<string, string> = {
    "Dental Implants": iconDentalImplant,
    "Cosmetic Dentistry": iconTeethWhitening,
    "Teeth Whitening": iconTeethWhitening,
    "Orthodontics": iconOrthodontics,
    "Full Mouth Restoration": iconFullMouth,
  };
  const rawServicesData = servicesContent?.services || defaultServices;
  const servicesData = rawServicesData.map((s: any) => ({
    ...s,
    icon: serviceIconOverrides[s.title] || s.icon,
  }));
  const servicesHeader = {
    badge: servicesContent?.badge || "Our Expertise",
    headline: servicesContent?.headline || "Premium Dental Services",
    description: servicesContent?.description || "From routine care to complex restorations, we deliver exceptional results using the latest techniques and premium materials.",
    cta: servicesContent?.cta || { label: "View All Services", link: "/services" }
  };
  
  // Why choose us
  const whyChooseData = {
    badge: whyChooseContent?.badge || "Why Kundalini Dental",
    headline: whyChooseContent?.headline || "Where World-Class Care Meets Compassionate Service",
    description: whyChooseContent?.description || "We combine the precision of international dental standards with the warmth of Nepali hospitality. Every patient receives personalized attention and treatment that exceeds expectations.",
    bullets: whyChooseContent?.bullets || defaultWhyChooseBullets,
    items: whyChooseContent?.items || defaultWhyChooseUs,
    cta: whyChooseContent?.cta || { label: "Learn About Our Clinic", link: "/about" }
  };
  
  // Doctor highlight
  const doctorData = {
    badge: doctorContent?.badge || "Meet Your Doctor",
    headline: doctorContent?.headline || settings.managing_director || "Dr. Nitin Aryal",
    subtitle: doctorContent?.subtitle || `${settings.managing_director_title || "BDS"} • Managing Director`,
    description: doctorContent?.description || `With ${settings.managing_director_experience || "15 years"} of experience in dental care, ${settings.managing_director || "Dr. Nitin Aryal"} leads Kundalini Dental Clinic with a commitment to excellence and patient-centered care. His expertise spans comprehensive dental treatments, ensuring every patient receives personalized attention.`,
    credentials: doctorContent?.credentials || defaultDoctorCredentials,
    experienceBadge: doctorContent?.experience_badge || { value: settings.managing_director_experience?.replace(' years', '') || "15", label: "Years of clinical experience" },
    photo: doctorContent?.photo || null,
    cta: doctorContent?.cta || { label: "View Full Profile", link: "/doctors" }
  };
  
  // International patients
  const internationalData = {
    badge: internationalContent?.badge || "Dental Tourism",
    headline: internationalContent?.headline || "Flying In for Treatment? We Make It Easy",
    description: internationalContent?.description || "Join the many international patients who've discovered world-class dental care in Nepal. We handle everything from your first inquiry to your flight home.",
    benefits: internationalContent?.benefits || defaultInternationalBenefits,
    cta: internationalContent?.cta || { label: "Learn About Dental Tourism", link: "/dental-tourism" }
  };
  
  // Testimonials
  const testimonialsData = {
    badge: testimonialContent?.badge || "Patient Stories",
    headline: testimonialContent?.headline || "What Our Patients Say",
    description: testimonialContent?.description || "Real experiences from patients who trusted us with their dental care.",
    testimonials: testimonialContent?.testimonials || defaultTestimonials,
    cta: testimonialContent?.cta || { label: "Read More Reviews", link: "/reviews" }
  };
  
  // CTA strip
  const ctaData = {
    headline: ctaContent?.headline || "Ready to Start Your Smile Journey?",
    description: ctaContent?.description || "Book a free consultation today and discover how we can help you achieve the healthy, beautiful smile you deserve.",
    ctaPrimary: ctaContent?.cta_primary || { label: "Book Free Consultation", link: "/contact" },
    ctaSecondary: ctaContent?.cta_secondary || { label: "Call Now", phone: settings.phone || "+9779802808008" }
  };

  // Helper to get icon component
  const getIcon = (iconName: string): React.ElementType => {
    return iconMap[iconName] || Shield;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[auto] sm:min-h-[85vh] lg:min-h-[92vh] flex items-center pt-20 sm:pt-28 lg:pt-32 pb-8 sm:pb-0">
        <div className="absolute inset-0 z-0">
          <img
            src={typeof heroData.backgroundImage === 'string' ? heroData.backgroundImage : heroImage}
            alt="Kundalini Dental Clinic - Modern dental treatment room with state-of-the-art equipment in Kathmandu, Nepal"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/30 sm:to-background/20" />
        </div>
        
        {/* Floating Offer Badge - Dynamic from CMS */}
        {featuredOffer && (
          <OfferBadge
            text={featuredOffer.badge_text || "Limited Offer"}
            highlight={featuredOffer.title}
            link={featuredOffer.cta_link || "/contact"}
            position="bottom-right"
          />
        )}
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl sm:max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {heroData.badge}
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-4 sm:mb-6">
              {heroData.headline}{" "}
              <span className="text-primary">{heroData.headlineHighlight}</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-xl">
              {heroData.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Button asChild size="lg" className="h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8">
                <Link to={heroData.ctaPrimary.link}>
                  {heroData.ctaPrimary.label}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8">
                <Link to={heroData.ctaSecondary.link}>
                  <span className="sm:hidden">International Patients</span>
                  <span className="hidden sm:inline">{heroData.ctaSecondary.label}</span>
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 pt-6 border-t border-border/50">
              {heroData.stats.map((stat: { value: string; label: string }, index: number) => (
                <div key={index}>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators - Dynamic */}
      <section className="bg-muted/50 py-8 sm:py-10 lg:py-12 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {trustData.map((item: any, index: number) => {
              const IconComponent = getIcon(item.icon);
              return (
                <motion.div
                  key={item.label || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm sm:text-base">{item.label}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Overview - Dynamic */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
              {servicesHeader.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-2 sm:mt-3 mb-4 sm:mb-5">
              {servicesHeader.headline}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {servicesHeader.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {servicesData.map((service: any, index: number) => (
              <motion.div
                key={service.title || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated card-hover p-5 sm:p-6 lg:p-8 text-center group"
              >
                <div className="mb-4 sm:mb-5 flex justify-center items-center min-h-[3rem] sm:min-h-[3.5rem]">
                  {service.icon && /^(https?:\/\/|\/)/.test(service.icon) ? (
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="h-12 sm:h-14 w-auto object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl">{service.icon}</span>
                  )}
                </div>
                <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-2 sm:mb-3">
                  {service.highlight}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-5 leading-relaxed">
                  {service.description}
                </p>
                <Link
                  to={service.link || "/services"}
                  className="inline-flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all"
                >
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <Button asChild variant="outline" size="lg" className="h-12">
              <Link to={servicesHeader.cta.link}>
                {servicesHeader.cta.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Kundalini - Dynamic */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
                {whyChooseData.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-2 sm:mt-3 mb-4 sm:mb-6 leading-tight">
                {whyChooseData.headline}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                {whyChooseData.description}
              </p>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {whyChooseData.bullets.map((item: string, index: number) => (
                  <motion.div 
                    key={item} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground font-medium text-sm sm:text-base">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Button asChild size="lg" className="h-12 w-full sm:w-auto">
                <Link to={whyChooseData.cta.link}>
                  {whyChooseData.cta.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {whyChooseData.items.map((item: any, index: number) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <motion.div
                    key={item.title || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card-elevated p-5 sm:p-6"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Highlight - Dynamic */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden relative">
                {doctorData.photo ? (
                  <img 
                    src={doctorData.photo} 
                    alt={doctorData.headline}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6 sm:p-8">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Stethoscope className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Professional portrait coming soon
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Experience badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -right-2 sm:-right-4 lg:-right-8 bottom-8 sm:bottom-12 card-elevated p-4 sm:p-5 max-w-[160px] sm:max-w-[200px]"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  <span className="font-bold text-xl sm:text-2xl text-foreground">{doctorData.experienceBadge.value}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{doctorData.experienceBadge.label}</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
                {doctorData.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-2 sm:mt-3 mb-3 sm:mb-4 leading-tight">
                {doctorData.headline}
              </h2>
              <p className="text-lg sm:text-xl text-accent font-medium mb-4 sm:mb-6">
                {doctorData.subtitle}
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                {doctorData.description}
              </p>

              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {doctorData.credentials.map((credential: string, index: number) => (
                  <motion.div
                    key={credential}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm sm:text-base">{credential}</span>
                  </motion.div>
                ))}
              </div>

              <Button asChild size="lg" className="h-12 w-full sm:w-auto">
                <Link to={doctorData.cta.link}>
                  {doctorData.cta.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* International Patients Section - Dynamic */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/20 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {internationalData.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary-foreground mb-4 sm:mb-6 leading-tight">
              {internationalData.headline.split('?')[0]}?<br className="hidden sm:block" /> {internationalData.headline.split('?')[1] || 'We Make It Easy'}
            </h2>
            <p className="text-base sm:text-lg text-secondary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              {internationalData.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {internationalData.benefits.map((benefit: any, index: number) => {
              const IconComponent = getIcon(benefit.icon);
              return (
                <motion.div
                  key={benefit.title || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-secondary-foreground/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-secondary-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-foreground/70">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full sm:w-auto">
              <Link to={internationalData.cta.link}>
                {internationalData.cta.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials - Dynamic */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
              {testimonialsData.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-2 sm:mt-3 mb-4 sm:mb-5">
              {testimonialsData.headline}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              {testimonialsData.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {testimonialsData.testimonials.map((testimonial: any, index: number) => (
              <motion.div
                key={testimonial.name || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-5 sm:p-6 lg:p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border pt-4 sm:pt-5">
                  <div className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {testimonial.location} • {testimonial.treatment}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <Button asChild variant="outline" size="lg" className="h-12">
              <Link to={testimonialsData.cta.link}>
                {testimonialsData.cta.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Dynamic */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              {ctaData.headline}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              {ctaData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild size="lg" className="h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8">
                <Link to={ctaData.ctaPrimary.link}>
                  {ctaData.ctaPrimary.label}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8">
                <a href={`tel:${ctaData.ctaSecondary.phone || settings.phone}`}>
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {ctaData.ctaSecondary.label}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
