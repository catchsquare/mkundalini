import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Users, Globe, Phone, Star, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import heroImage from "@/assets/hero-dental.jpg";

const stats = [
  { label: "Years of Experience", value: "15+" },
  { label: "Happy Patients", value: "10,000+" },
  { label: "International Patients", value: "500+" },
  { label: "Expert Dentists", value: "8" },
];

const services = [
  {
    title: "Dental Implants",
    description: "Premium titanium implants with lifetime warranty. Same-day procedures available.",
    icon: "🦷",
  },
  {
    title: "Cosmetic Dentistry",
    description: "Veneers, whitening, and smile makeovers for the perfect Hollywood smile.",
    icon: "✨",
  },
  {
    title: "Orthodontics",
    description: "Invisible aligners and braces for beautifully aligned teeth at any age.",
    icon: "😁",
  },
  {
    title: "Root Canal",
    description: "Pain-free root canal treatment with advanced technology and sedation options.",
    icon: "💪",
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: "International Standards",
    description: "We follow strict sterilization protocols and use FDA-approved materials.",
  },
  {
    icon: Award,
    title: "Expert Team",
    description: "Our dentists are trained in the USA, UK, and Europe with decades of experience.",
  },
  {
    icon: Globe,
    title: "Dental Tourism",
    description: "Complete packages for international patients including airport pickup and hotel.",
  },
  {
    icon: Users,
    title: "Patient-First Care",
    description: "Personalized treatment plans and 24/7 support for all our patients.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "California, USA",
    quote: "I saved over $15,000 on my dental implants. The clinic is world-class and the care was exceptional. Highly recommend for dental tourism!",
    rating: 5,
  },
  {
    name: "James Peterson",
    location: "Sydney, Australia",
    quote: "Best dental experience I've ever had. Dr. Sharma and team made me feel completely at ease. My smile transformation is incredible.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Kathmandu, Nepal",
    quote: "Finally found a dental clinic in Nepal that matches international quality. The staff is professional and the facilities are top-notch.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Modern dental clinic interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              Dental Tourism Specialists
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              World-Class Dental Care in{" "}
              <span className="text-primary">Nepal</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Experience premium dental treatments at a fraction of international costs. 
              Our internationally trained team delivers exceptional care for local and 
              global patients alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">
                  Book Appointment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/dental-tourism">
                  International Patients
                  <Globe className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              Comprehensive Dental Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From routine check-ups to complex reconstructive procedures, we offer 
              a full range of dental services with the latest technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated card-hover p-8 text-center"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center text-sm text-primary font-medium hover:gap-2 transition-all"
                >
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/services">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
                Nepal's Premier Dental Destination
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Kundalini Dental Clinic combines international expertise with Nepali hospitality. 
                We're committed to providing exceptional care that rivals the best clinics 
                in the USA, Europe, and Australia — at a fraction of the cost.
              </p>
              <div className="space-y-4">
                {[
                  "State-of-the-art German & Japanese equipment",
                  "Internationally trained dental specialists",
                  "Transparent pricing with no hidden costs",
                  "Multilingual staff for international patients",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {whyChooseUs.map((item, index) => (
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
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
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
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from patients around the world who trusted us with their smiles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Smile?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Book a free consultation today. International patients receive complimentary 
              virtual consultations before your trip to Nepal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="bg-background text-primary hover:bg-background/90"
              >
                <Link to="/contact">
                  Book Appointment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <a href="tel:+9771234567890">
                  <Phone className="w-5 h-5 mr-2" />
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