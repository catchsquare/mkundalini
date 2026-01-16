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
import heroImage from "@/assets/hero-dental.jpg";

const trustIndicators = [
  {
    icon: Stethoscope,
    label: "Advanced Technology",
    description: "Modern dental equipment",
  },
  {
    icon: Shield,
    label: "Hospital-Grade Hygiene",
    description: "Strict sterilization protocols",
  },
  {
    icon: Award,
    label: "15 Years Experience",
    description: "Led by Dr. Nitin Aryal",
  },
  {
    icon: HeartPulse,
    label: "Patient Safety First",
    description: "International safety standards",
  },
];

const services = [
  {
    title: "Dental Implants",
    description: "Premium titanium implants with lifetime warranty. Same-day procedures available for qualified patients.",
    icon: "🦷",
    highlight: "Save up to 70%",
  },
  {
    title: "Cosmetic Dentistry",
    description: "Veneers, professional whitening, and complete smile makeovers designed for natural, lasting beauty.",
    icon: "✨",
    highlight: "Hollywood Smile",
  },
  {
    title: "Orthodontics",
    description: "Invisible aligners and modern braces for beautifully aligned teeth. Suitable for all ages.",
    icon: "😁",
    highlight: "Invisible Options",
  },
  {
    title: "Full Mouth Restoration",
    description: "Comprehensive treatment plans for complex cases. Rebuild your smile with confidence.",
    icon: "💎",
    highlight: "Complete Care",
  },
];

const whyChooseUs = [
  {
    icon: BadgeCheck,
    title: "FDA-Approved Materials",
    description: "We exclusively use internationally certified, premium-grade materials for every procedure.",
  },
  {
    icon: GraduationCap,
    title: "Internationally Trained Team",
    description: "Our specialists trained in the USA, UK, and Europe bring world-class expertise to Nepal.",
  },
  {
    icon: Clock,
    title: "Efficient Treatment",
    description: "Advanced technology means faster procedures, less chair time, and quicker recovery.",
  },
  {
    icon: Users,
    title: "Personalized Care",
    description: "Every treatment plan is customized to your unique needs, goals, and budget.",
  },
];

const doctorCredentials = [
  "Bachelor of Dental Surgery (BDS)",
  "15 years of clinical experience",
  "Managing Director, Kundalini Dental Clinic",
  "Committed to patient-centered care",
  "Expertise in comprehensive dental treatments",
];

const internationalBenefits = [
  {
    icon: Plane,
    title: "Airport Pickup",
    description: "Complimentary transportation from Tribhuvan International Airport",
  },
  {
    icon: Hotel,
    title: "Hotel Arrangements",
    description: "Partnered hotels with special rates for our patients",
  },
  {
    icon: Globe,
    title: "Virtual Consultation",
    description: "Free video consultation before you travel",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Dedicated coordinator throughout your stay",
  },
];

const testimonials = [
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

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-[92vh] flex items-center pt-16 sm:pt-18 lg:pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Kundalini Dental Clinic - Modern dental treatment room with state-of-the-art equipment in Kathmandu, Nepal"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/30 sm:to-background/20" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl sm:max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Nepal's Leading Dental Care Destination
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-4 sm:mb-6">
              Exceptional Dental Care,{" "}
              <span className="text-primary">Exceptional Value</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-xl">
              Quality dental treatments at accessible prices. 
              Led by Dr. Nitin Aryal with 15 years of experience, 
              we deliver professional care and beautiful, lasting results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Button asChild size="lg" className="h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8">
                <Link to="/contact">
                  Book Your Appointment
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8">
                <Link to="/dental-tourism">
                  <span className="sm:hidden">International Patients</span>
                  <span className="hidden sm:inline">International Patient? Start Here</span>
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 pt-6 border-t border-border/50">
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">15</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">2023</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Established</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Premium</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Quality Care</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-muted/50 py-8 sm:py-10 lg:py-12 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {trustIndicators.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm sm:text-base">{item.label}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{item.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
              Our Expertise
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-2 sm:mt-3 mb-4 sm:mb-5">
              Premium Dental Services
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From routine care to complex restorations, we deliver exceptional results 
              using the latest techniques and premium materials.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated card-hover p-5 sm:p-6 lg:p-8 text-center group"
              >
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">{service.icon}</div>
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
                  to="/services"
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
              <Link to="/services">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Kundalini */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
                Why Kundalini Dental
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-2 sm:mt-3 mb-4 sm:mb-6 leading-tight">
                Where World-Class Care Meets Compassionate Service
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                We combine the precision of international dental standards with the warmth 
                of Nepali hospitality. Every patient receives personalized attention and 
                treatment that exceeds expectations.
              </p>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  "Same quality as clinics in USA, UK & Australia",
                  "Save 50-70% compared to Western prices",
                  "No waiting lists — appointments within days",
                  "English-speaking staff for international patients",
                ].map((item, index) => (
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
                <Link to="/about">
                  Learn About Our Clinic
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-elevated p-5 sm:p-6"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Highlight */}
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
                  <span className="font-bold text-xl sm:text-2xl text-foreground">15</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Years of clinical experience</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
                Meet Your Doctor
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-2 sm:mt-3 mb-3 sm:mb-4 leading-tight">
                Dr. Nitin Aryal
              </h2>
              <p className="text-lg sm:text-xl text-accent font-medium mb-4 sm:mb-6">
                BDS • Managing Director
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                With 15 years of experience in dental care, Dr. Nitin Aryal leads 
                Kundalini Dental Clinic with a commitment to excellence and 
                patient-centered care. His expertise spans comprehensive dental 
                treatments, ensuring every patient receives personalized attention.
              </p>

              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {doctorCredentials.map((credential, index) => (
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
                <Link to="/doctors">
                  View Full Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* International Patients Section */}
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
              Dental Tourism
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary-foreground mb-4 sm:mb-6 leading-tight">
              Flying In for Treatment?<br className="hidden sm:block" /> We Make It Easy
            </h2>
            <p className="text-base sm:text-lg text-secondary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Join the many international patients who've discovered world-class dental care 
              in Nepal. We handle everything from your first inquiry to your flight home.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {internationalBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-secondary-foreground/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-secondary-foreground/70">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full sm:w-auto">
              <Link to="/dental-tourism">
                Learn About Dental Tourism
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
              Patient Stories
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-2 sm:mt-3 mb-4 sm:mb-5">
              What Our Patients Say
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from patients who trusted us with their dental care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-5 sm:p-6 lg:p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
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
              <Link to="/reviews">
                Read More Reviews
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Ready to Start Your Smile Journey?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Book a free consultation today and discover how we can help you achieve 
              the healthy, beautiful smile you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild size="lg" className="h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8">
                <Link to="/contact">
                  Book Free Consultation
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8">
                <a href="tel:+9779802808008">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}