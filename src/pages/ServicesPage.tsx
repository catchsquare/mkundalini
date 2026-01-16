import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const services = [
  {
    id: "implants",
    title: "Dental Implants",
    description:
      "Replace missing teeth with permanent, natural-looking implants. Our titanium implants are sourced from leading European manufacturers and come with a lifetime warranty.",
    features: [
      "Single tooth implants",
      "All-on-4 full arch restoration",
      "Same-day implants available",
      "3D-guided implant placement",
      "Bone grafting if required",
    ],
    price: "From NPR 45,000",
    duration: "1-3 visits over 3-6 months",
    icon: "🦷",
  },
  {
    id: "cosmetic",
    title: "Cosmetic Dentistry",
    description:
      "Achieve your dream smile with our comprehensive cosmetic treatments. From subtle enhancements to complete smile makeovers, we customize every treatment to your goals.",
    features: [
      "Porcelain veneers",
      "Teeth whitening (in-office & take-home)",
      "Composite bonding",
      "Smile design consultation",
      "Gum contouring",
    ],
    price: "From NPR 15,000",
    duration: "1-4 visits",
    icon: "✨",
  },
  {
    id: "orthodontics",
    title: "Orthodontics",
    description:
      "Straighten your teeth at any age with our range of orthodontic solutions. We offer both traditional braces and modern invisible aligners for discreet treatment.",
    features: [
      "Invisible aligners (Invisalign-type)",
      "Ceramic braces",
      "Metal braces",
      "Lingual braces (behind teeth)",
      "Retainers",
    ],
    price: "From NPR 80,000",
    duration: "6-24 months",
    icon: "😁",
  },
  {
    id: "root-canal",
    title: "Root Canal Treatment",
    description:
      "Save your natural tooth with our gentle, effective root canal treatment. Using rotary instruments and apex locators, we ensure precise and comfortable procedures.",
    features: [
      "Single-visit root canals",
      "Rotary endodontics",
      "Microscope-enhanced treatment",
      "Sedation options available",
      "Post and crown restoration",
    ],
    price: "From NPR 8,000",
    duration: "1-2 visits",
    icon: "💪",
  },
  {
    id: "crowns",
    title: "Crowns & Bridges",
    description:
      "Restore damaged or missing teeth with our premium crowns and bridges. We use CAD/CAM technology for precise fitting and natural aesthetics.",
    features: [
      "Zirconia crowns",
      "E-max porcelain crowns",
      "Metal-ceramic crowns",
      "Same-day crowns available",
      "Multi-unit bridges",
    ],
    price: "From NPR 12,000",
    duration: "2 visits",
    icon: "👑",
  },
  {
    id: "general",
    title: "General Dentistry",
    description:
      "Maintain optimal oral health with our comprehensive general dentistry services. Prevention is the foundation of all our treatments.",
    features: [
      "Routine check-ups & cleaning",
      "Digital X-rays",
      "Fillings (composite & ceramic)",
      "Extractions",
      "Gum disease treatment",
    ],
    price: "From NPR 2,000",
    duration: "1 visit",
    icon: "🏥",
  },
];

export default function ServicesPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-2 mb-6">
              Comprehensive Dental Care
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From preventive care to complex restorations, we offer a complete range 
              of dental services using the latest technology and techniques. Every 
              treatment is tailored to your unique needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-20">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-primary" />
                      {service.price}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {service.duration}
                    </div>
                  </div>
                  <Button asChild>
                    <Link to="/contact">
                      Book Consultation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                <div
                  className={`card-elevated p-8 lg:p-12 ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
                    <span className="text-8xl">{service.icon}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-accent">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-accent-foreground mb-4">
              Not Sure Which Treatment You Need?
            </h2>
            <p className="text-lg text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
              Book a comprehensive dental examination. Our experts will assess your 
              oral health and recommend the best treatment plan for you.
            </p>
            <Button
              asChild
              size="xl"
              className="bg-background text-accent hover:bg-background/90"
            >
              <Link to="/contact">
                Book Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}