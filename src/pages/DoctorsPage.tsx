import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Award, 
  GraduationCap, 
  Globe,
  Languages,
  BadgeCheck,
  Stethoscope,
  Clock,
  MapPin,
  Star,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/Layout";
import { usePageContent } from "@/hooks/use-page-content";
import { useTeamMembers } from "@/hooks/use-team-members";
import { useContentBlocks } from "@/hooks/use-content-blocks";
import { useHeroSlide } from "@/hooks/use-hero-slide";
import { getIcon } from "@/lib/icon-map";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

// Fallback static doctor data
const fallbackDoctor = {
  name: "Dr. Nitin Aryal",
  role: "Managing Director",
  image: null,
  qualifications: [
    "BDS — Bachelor of Dental Surgery",
  ],
  experience: "Practising since 2012",
  specialties: [
    "Comprehensive Dental Care",
    "General Dentistry",
    "Patient-Centered Treatment",
  ],
  languages: ["English", "Nepali"],
  bio: "Dr. Nitin Aryal founded Kundalini Dental Clinic in 2023 with a vision to provide quality dental care in Kathmandu. Practising dentistry since 2012, he leads the clinic with a commitment to patient-centered care and professional excellence.",
  achievements: [
    "Practising dentistry since 2012",
    "Founder & Managing Director",
    "Committed to quality patient care",
  ],
  featured: true,
};

const fallbackTrustFactors = [
  { icon: "GraduationCap", title: "Experienced Leadership", description: "Led by Dr. Nitin Aryal, BDS, practising dentistry since 2012." },
  { icon: "BadgeCheck", title: "Qualified Professional", description: "Bachelor of Dental Surgery (BDS) with extensive practical experience." },
  { icon: "Globe", title: "Quality Standards", description: "We follow international protocols and maintain high standards of care." },
  { icon: "Languages", title: "Multilingual Team", description: "Communicate comfortably in English and Nepali." },
];

export default function DoctorsPage() {
  const { getSectionByType } = usePageContent("doctors");
  const { members, featuredMember, loading } = useTeamMembers();
  const { byKey, loading: blocksLoading } = useContentBlocks("doctors");
  const { slide: heroSlide } = useHeroSlide("doctors");

  const trustBlocks = byKey("trust_factors");
  const trustFactors = trustBlocks.length > 0
    ? trustBlocks.map((b) => ({ icon: b.icon || "Sparkles", title: b.title || "", description: b.description || "" }))
    : fallbackTrustFactors;

  const heroSection = heroSlide
    ? { badge: heroSlide.badge_text, title: heroSlide.title, titleHighlight: heroSlide.subtitle, description: heroSlide.description }
    : getSectionByType("hero");
  const doctorSection = getSectionByType("featured_doctor");
  const commitmentSection = getSectionByType("commitment");
  
  // Use CMS team member data if available, fallback to static
  const featuredDoctor = featuredMember ? {
    name: featuredMember.full_name,
    role: featuredMember.role,
    image: featuredMember.photo_url,
    qualifications: featuredMember.qualifications || [],
    experience: featuredMember.experience_years ? `${featuredMember.experience_years} years` : 'Practising since 2012',
    specialties: featuredMember.specialties || [],
    languages: featuredMember.languages || [],
    bio: featuredMember.bio || '',
    achievements: featuredMember.achievements || [],
    featured: true,
  } : fallbackDoctor;

  return (
    <Layout>
      <SEO
        title="Our Doctors"
        description="Meet the experienced dental specialists at Kundalini Dental Clinic — internationally trained dentists delivering safe, world-class care."
        path="/doctors"
      />
      <Breadcrumbs items={[{ label: "Doctors" }]} />
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Stethoscope className="w-4 h-4" />
              {heroSection?.badge || "Our Medical Team"}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              {heroSection?.title || "Meet Your"}{" "}
              <span className="text-primary">{heroSection?.titleHighlight || "Dental Team"}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {heroSection?.description || "Led by Dr. Nitin Aryal, BDS, practising dentistry since 2012, our team is committed to delivering exceptional care with compassion and precision."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="bg-muted/30 py-12 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {blocksLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center"><Skeleton className="w-14 h-14 rounded-2xl mx-auto mb-4" /><Skeleton className="h-5 w-32 mx-auto mb-2" /><Skeleton className="h-4 w-40 mx-auto" /></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {trustFactors.map((item, index) => {
                const Icon = getIcon(item.icon);
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Doctor - Lead Specialist */}
      {featuredDoctor && (
        <section className="section-padding bg-background">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
<span className="text-primary font-medium text-sm uppercase tracking-wider">
                Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
                Managing Director
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-primary/15 via-accent/10 to-muted overflow-hidden relative">
                  {featuredDoctor.image ? (
                    <img
                      src={featuredDoctor.image}
                      alt={featuredDoctor.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border-4 border-primary/20">
                          <Stethoscope className="w-20 h-20 text-primary/50" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Professional portrait
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Experience Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="absolute -right-4 lg:-right-8 top-8 card-elevated p-4"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-bold text-xl text-foreground">{featuredDoctor.experience}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                </motion.div>

                {/* Achievement Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="absolute -left-4 lg:-left-8 bottom-12 card-elevated p-4"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="font-bold text-xl text-foreground">3,000+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Implant Procedures</p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {featuredDoctor.name}
                </h3>
                <p className="text-xl text-primary font-medium mb-6">
                  {featuredDoctor.role}
                </p>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  {featuredDoctor.bio}
                </p>

                {/* Qualifications */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    Qualifications
                  </h4>
                  <ul className="space-y-2">
                    {featuredDoctor.qualifications.map((qual) => (
                      <li key={qual} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialties */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredDoctor.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-primary" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredDoctor.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

<Button asChild size="lg">
                  <Link to="/contact">
                    Book Consultation with Dr. Aryal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      )}

{/* Our Commitment Section */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Promise
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-5">
              Quality Care You Can Trust
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              At Kundalini Dental Clinic, we are committed to providing personalized 
              dental care with the highest standards of professionalism and hygiene.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-elevated p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">15 Years Experience</h3>
              <p className="text-muted-foreground">
                Dr. Nitin Aryal has been practising dentistry since 2012.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="card-elevated p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <BadgeCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Modern Facilities</h3>
              <p className="text-muted-foreground">
                Our clinic is equipped with contemporary dental technology for accurate and efficient treatments.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="card-elevated p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Patient-First Approach</h3>
              <p className="text-muted-foreground">
                Every treatment plan is customized to your unique needs, ensuring comfortable and effective care.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* International Patient Assurance */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              For International Patients
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-6 leading-tight">
              Your Care Is in Trusted Hands
            </h2>
            <p className="text-lg sm:text-xl text-secondary-foreground/80 mb-10 leading-relaxed max-w-3xl mx-auto">
              Traveling for dental care requires trust. Our team has treated patients 
              from over 25 countries, and we understand the unique needs of international 
              visitors. From your first consultation to post-treatment follow-up, 
              you'll receive clear communication and compassionate care.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left">
              <div className="bg-secondary-foreground/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Languages className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary-foreground mb-2">
                  English-Speaking Staff
                </h3>
                <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                  All doctors and key staff speak fluent English for clear communication.
                </p>
              </div>
              <div className="bg-secondary-foreground/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <BadgeCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary-foreground mb-2">
                  Verified Credentials
                </h3>
                <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                  All qualifications are verified and available for review upon request.
                </p>
              </div>
              <div className="bg-secondary-foreground/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary-foreground mb-2">
                  Global Experience
                </h3>
                <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                  500+ international patients treated with understanding and cultural sensitivity.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/dental-tourism">
                  Dental Tourism Information
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
              >
                <Link to="/contact">
                  Request Virtual Consultation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Ready to Meet Your Dentist?
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              Book a consultation with one of our specialists and take the first step 
              toward the smile you deserve.
            </p>
            <Button
              asChild
              size="xl"
              className="bg-background text-primary hover:bg-background/90 shadow-lg"
            >
              <Link to="/contact">
                Book Your Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
