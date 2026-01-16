import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  Clock, 
  DollarSign, 
  Sparkles,
  Globe,
  Star,
  ChevronRight,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const treatmentCategories = [
  {
    id: "implants-restorative",
    name: "Implants & Restorative",
    description: "Permanent solutions for missing or damaged teeth",
    highlight: "Most Popular for Dental Tourism",
    treatments: [
      {
        id: "single-implants",
        title: "Single Tooth Implants",
        shortDescription: "Replace individual missing teeth with natural-looking titanium implants.",
        price: "From $350",
        comparisonPrice: "$3,000+ in USA",
        duration: "2-3 visits",
        tourismFriendly: true,
        features: ["German/Swiss implants", "Lifetime warranty", "3D-guided placement"],
        link: "/services/dental-implants",
      },
      {
        id: "all-on-4",
        title: "All-on-4 Full Arch",
        shortDescription: "Complete smile restoration with just 4 implants supporting a full arch.",
        price: "From $4,500",
        comparisonPrice: "$25,000+ in USA",
        duration: "3-5 visits",
        tourismFriendly: true,
        features: ["Same-day teeth possible", "Full upper or lower arch", "Premium prosthetics"],
        link: "/services/dental-implants",
      },
      {
        id: "crowns-bridges",
        title: "Crowns & Bridges",
        shortDescription: "Restore damaged teeth or bridge gaps with precision-crafted restorations.",
        price: "From $150",
        comparisonPrice: "$1,200+ in USA",
        duration: "2 visits",
        tourismFriendly: true,
        features: ["Zirconia & E-max options", "CAD/CAM precision", "Same-day available"],
      },
      {
        id: "full-mouth",
        title: "Full Mouth Rehabilitation",
        shortDescription: "Comprehensive restoration for severely damaged or worn dentition.",
        price: "Custom quote",
        comparisonPrice: "Save 60-70%",
        duration: "Multiple visits",
        tourismFriendly: true,
        features: ["Complete assessment", "Phased treatment", "Smile design included"],
      },
    ],
  },
  {
    id: "cosmetic",
    name: "Cosmetic Dentistry",
    description: "Transform your smile with aesthetic enhancements",
    highlight: "Hollywood Smile Specialists",
    treatments: [
      {
        id: "veneers",
        title: "Porcelain Veneers",
        shortDescription: "Ultra-thin shells that transform the appearance of your teeth instantly.",
        price: "From $250/tooth",
        comparisonPrice: "$1,500+ in USA",
        duration: "2-3 visits",
        tourismFriendly: true,
        features: ["E-max porcelain", "Custom shade matching", "Minimal prep options"],
      },
      {
        id: "smile-makeover",
        title: "Complete Smile Makeover",
        shortDescription: "Comprehensive aesthetic transformation combining multiple treatments.",
        price: "From $2,000",
        comparisonPrice: "$15,000+ in USA",
        duration: "3-5 visits",
        tourismFriendly: true,
        features: ["Digital smile design", "Multiple treatment options", "Personalized plan"],
      },
      {
        id: "whitening",
        title: "Teeth Whitening",
        shortDescription: "Professional-grade whitening for a brighter, more youthful smile.",
        price: "From $150",
        comparisonPrice: "$500+ in USA",
        duration: "1 visit",
        tourismFriendly: true,
        features: ["In-office treatment", "Take-home kits available", "Up to 8 shades lighter"],
      },
      {
        id: "bonding",
        title: "Composite Bonding",
        shortDescription: "Quick, affordable repairs for chips, gaps, and minor imperfections.",
        price: "From $80/tooth",
        comparisonPrice: "$300+ in USA",
        duration: "1 visit",
        tourismFriendly: false,
        features: ["Same-day results", "Tooth-colored material", "No drilling required"],
      },
    ],
  },
  {
    id: "orthodontics",
    name: "Orthodontics",
    description: "Straighten teeth for a perfect, aligned smile",
    highlight: "Invisible Options Available",
    treatments: [
      {
        id: "invisalign",
        title: "Clear Aligners",
        shortDescription: "Virtually invisible aligners that straighten teeth without metal braces.",
        price: "From $1,500",
        comparisonPrice: "$5,000+ in USA",
        duration: "6-18 months",
        tourismFriendly: false,
        features: ["Removable aligners", "3D treatment preview", "Suitable for adults"],
      },
      {
        id: "braces",
        title: "Traditional Braces",
        shortDescription: "Time-tested solution for complex orthodontic cases at any age.",
        price: "From $800",
        comparisonPrice: "$4,000+ in USA",
        duration: "12-24 months",
        tourismFriendly: false,
        features: ["Metal or ceramic options", "Complex case expertise", "All ages welcome"],
      },
      {
        id: "retainers",
        title: "Retainers",
        shortDescription: "Maintain your perfect smile after orthodontic treatment.",
        price: "From $100",
        comparisonPrice: "$300+ in USA",
        duration: "1 visit",
        tourismFriendly: true,
        features: ["Fixed or removable", "Custom-made", "Long-term maintenance"],
      },
    ],
  },
  {
    id: "general",
    name: "General & Preventive",
    description: "Essential care for optimal oral health",
    highlight: "Foundation of Healthy Smiles",
    treatments: [
      {
        id: "root-canal",
        title: "Root Canal Treatment",
        shortDescription: "Save infected teeth with gentle, effective endodontic treatment.",
        price: "From $100",
        comparisonPrice: "$1,000+ in USA",
        duration: "1-2 visits",
        tourismFriendly: true,
        features: ["Microscope-enhanced", "Rotary instruments", "Pain-free experience"],
      },
      {
        id: "extractions",
        title: "Tooth Extractions",
        shortDescription: "Safe, comfortable removal of damaged or problematic teeth.",
        price: "From $30",
        comparisonPrice: "$200+ in USA",
        duration: "1 visit",
        tourismFriendly: true,
        features: ["Wisdom teeth included", "Sedation available", "Same-day service"],
      },
      {
        id: "cleaning",
        title: "Professional Cleaning",
        shortDescription: "Deep cleaning and scaling for healthy gums and fresh breath.",
        price: "From $40",
        comparisonPrice: "$150+ in USA",
        duration: "1 visit",
        tourismFriendly: true,
        features: ["Ultrasonic scaling", "Polishing included", "Oral hygiene guidance"],
      },
      {
        id: "fillings",
        title: "Dental Fillings",
        shortDescription: "Tooth-colored restorations that blend seamlessly with natural teeth.",
        price: "From $25",
        comparisonPrice: "$200+ in USA",
        duration: "1 visit",
        tourismFriendly: true,
        features: ["Composite material", "Mercury-free", "Natural appearance"],
      },
    ],
  },
  {
    id: "surgical",
    name: "Oral Surgery",
    description: "Advanced surgical procedures by specialists",
    highlight: "Expert Surgical Care",
    treatments: [
      {
        id: "wisdom-teeth",
        title: "Wisdom Tooth Surgery",
        shortDescription: "Expert removal of impacted or problematic wisdom teeth.",
        price: "From $80/tooth",
        comparisonPrice: "$400+ in USA",
        duration: "1 visit",
        tourismFriendly: true,
        features: ["Surgical extraction", "Sedation options", "Quick recovery"],
      },
      {
        id: "bone-grafting",
        title: "Bone Grafting",
        shortDescription: "Rebuild jaw bone for implant placement or structural support.",
        price: "From $200",
        comparisonPrice: "$1,500+ in USA",
        duration: "1-2 visits",
        tourismFriendly: true,
        features: ["Synthetic & natural options", "Implant preparation", "Sinus lift available"],
      },
      {
        id: "gum-surgery",
        title: "Gum Treatment",
        shortDescription: "Treat gum disease and restore periodontal health.",
        price: "From $150",
        comparisonPrice: "$800+ in USA",
        duration: "1-3 visits",
        tourismFriendly: true,
        features: ["Deep cleaning", "Gum grafting", "Laser treatment available"],
      },
    ],
  },
];

const popularTourismTreatments = [
  { name: "Dental Implants", savings: "Save 70-80%" },
  { name: "Veneers", savings: "Save 75-85%" },
  { name: "All-on-4", savings: "Save 80%" },
  { name: "Crowns", savings: "Save 70-80%" },
  { name: "Root Canals", savings: "Save 85-90%" },
  { name: "Smile Makeovers", savings: "Save 70%" },
];

export default function ServicesPage() {
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
              <Sparkles className="w-4 h-4" />
              Our Treatments
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              World-Class Dental{" "}
              <span className="text-primary">Treatments</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              From routine care to complex restorations, we offer comprehensive dental 
              services using advanced technology and premium materials — all at a 
              fraction of international costs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation - Fixed below header */}
      <section className="bg-background/95 backdrop-blur-lg py-4 border-b border-border/50 sticky top-20 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {treatmentCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="px-3 sm:px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Dental Tourism Highlight */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              <Plane className="w-4 h-4" />
              Dental Tourism
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-foreground mb-4">
              High-Value Treatments for International Patients
            </h2>
            <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
              These treatments offer the greatest savings for patients traveling from 
              abroad while maintaining the same quality as top clinics worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularTourismTreatments.map((treatment, index) => (
              <motion.div
                key={treatment.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-secondary-foreground/10 rounded-2xl p-5 text-center"
              >
                <h3 className="font-semibold text-secondary-foreground mb-1 text-sm">
                  {treatment.name}
                </h3>
                <p className="text-primary font-bold text-sm">{treatment.savings}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/dental-tourism">
                View Dental Tourism Packages
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Treatment Categories */}
      {treatmentCategories.map((category, categoryIndex) => (
        <section
          key={category.id}
          id={category.id}
          className={`section-padding ${categoryIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
                    {category.highlight}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {category.name}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.treatments.map((treatment, index) => (
                <motion.div
                  key={treatment.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-elevated card-hover overflow-hidden group"
                >
                  {/* Tourism Badge */}
                  {treatment.tourismFriendly && (
                    <div className="bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground flex items-center justify-center gap-1">
                      <Globe className="w-3 h-3" />
                      Ideal for Dental Tourism
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {treatment.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {treatment.shortDescription}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-5">
                      {treatment.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Pricing */}
                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span>Price</span>
                        </div>
                        <span className="font-semibold text-primary">{treatment.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Duration</span>
                        </div>
                        <span className="text-sm text-foreground">{treatment.duration}</span>
                      </div>
                      {treatment.comparisonPrice && (
                        <div className="bg-primary/5 rounded-lg px-3 py-2 text-center">
                          <span className="text-xs text-primary font-medium">
                            {treatment.comparisonPrice}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTAs */}
                    <div className="mt-5 space-y-2">
                      {treatment.link && (
                        <Link
                          to={treatment.link}
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 group/btn"
                        >
                          Learn More
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      )}
                      <Link
                        to="/contact"
                        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors group/btn ${
                          treatment.link 
                            ? 'bg-muted text-foreground hover:bg-muted/80' 
                            : 'bg-muted hover:bg-primary hover:text-primary-foreground text-foreground'
                        }`}
                      >
                        Book Consultation
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Price Comparison Table */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Value Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
              Your Savings at Kundalini Dental
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Same quality materials, same international standards — significantly lower costs.
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
                    <th className="text-center p-4 font-semibold text-foreground">USA Price</th>
                    <th className="text-center p-4 font-semibold text-primary bg-primary/5">Our Price</th>
                    <th className="text-center p-4 font-semibold text-foreground">You Save</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { treatment: "Single Dental Implant", usa: "$4,000", nepal: "$350", savings: "$3,650" },
                    { treatment: "Porcelain Veneer", usa: "$1,500", nepal: "$250", savings: "$1,250" },
                    { treatment: "All-on-4 (per arch)", usa: "$25,000", nepal: "$4,500", savings: "$20,500" },
                    { treatment: "Zirconia Crown", usa: "$1,200", nepal: "$180", savings: "$1,020" },
                    { treatment: "Root Canal", usa: "$1,000", nepal: "$100", savings: "$900" },
                    { treatment: "Teeth Whitening", usa: "$500", nepal: "$150", savings: "$350" },
                  ].map((row, index) => (
                    <tr key={row.treatment} className={index % 2 === 0 ? '' : 'bg-muted/20'}>
                      <td className="p-4 font-medium text-foreground">{row.treatment}</td>
                      <td className="p-4 text-center text-muted-foreground line-through">{row.usa}</td>
                      <td className="p-4 text-center font-semibold text-primary bg-primary/5">{row.nepal}</td>
                      <td className="p-4 text-center font-semibold text-accent">{row.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              * Prices are approximate and may vary based on complexity. Final pricing provided after consultation.
            </div>
          </motion.div>
        </div>
      </section>

      {/* Not Sure CTA */}
      <section className="section-padding bg-accent">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Star className="w-12 h-12 text-accent-foreground/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-accent-foreground mb-4">
              Not Sure Which Treatment You Need?
            </h2>
            <p className="text-lg text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
              Book a comprehensive dental examination. Our experts will assess your 
              oral health and recommend the best treatment plan tailored to your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
              >
                <Link to="/dental-tourism">
                  International Patient? Start Here
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
