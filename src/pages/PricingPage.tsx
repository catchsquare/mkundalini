import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Heart,
  Shield,
  FileText,
  DollarSign,
  CheckCircle,
  HelpCircle,
  Globe,
  Sparkles,
  Calculator,
  MessageCircle,
  ArrowRight,
  Stethoscope,
  Users,
  Clock,
} from "lucide-react";
import { usePageContent } from "@/hooks/use-page-content";

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

const pricingPhilosophy = [
  {
    icon: Heart,
    title: "Care Before Commerce",
    description:
      "We believe excellent dental care should be accessible. Our pricing reflects honest costs, not inflated margins designed to maximize profit at your expense.",
  },
  {
    icon: Shield,
    title: "No Hidden Fees",
    description:
      "The price we quote is the price you pay. No surprise charges, no hidden consultation fees, no unexpected costs added after treatment begins.",
  },
  {
    icon: FileText,
    title: "Detailed Estimates",
    description:
      "Before any treatment, you receive a comprehensive written estimate breaking down every cost. You'll understand exactly what you're paying for.",
  },
  {
    icon: DollarSign,
    title: "Fair Value",
    description:
      "We use the same premium materials and techniques as clinics charging 5-10x more. The difference? Lower overhead, not lower quality.",
  },
];

const treatmentPricing = [
  {
    category: "Dental Implants",
    description: "Titanium implants with porcelain crowns",
    treatments: [
      {
        name: "Single Tooth Implant",
        priceRange: "$800 - $1,200",
        includes: "Implant, abutment, porcelain crown, all follow-ups",
        note: "Premium Swiss/Korean titanium implants",
      },
      {
        name: "All-on-4 Full Arch",
        priceRange: "$6,000 - $9,000",
        includes: "4 implants, full arch prosthesis, all procedures",
        note: "Complete smile restoration",
      },
      {
        name: "All-on-6 Full Arch",
        priceRange: "$8,000 - $12,000",
        includes: "6 implants, full arch prosthesis, all procedures",
        note: "Maximum stability option",
      },
    ],
  },
  {
    category: "Cosmetic Dentistry",
    description: "Aesthetic smile enhancements",
    treatments: [
      {
        name: "Porcelain Veneer (per tooth)",
        priceRange: "$250 - $400",
        includes: "Consultation, preparation, custom veneer, bonding",
        note: "E-max or Zirconia options",
      },
      {
        name: "Complete Smile Makeover",
        priceRange: "$3,000 - $8,000",
        includes: "Comprehensive treatment plan, 8-20 veneers",
        note: "Customized to your goals",
      },
      {
        name: "Teeth Whitening",
        priceRange: "$150 - $300",
        includes: "Professional in-office treatment",
        note: "Immediate visible results",
      },
    ],
  },
  {
    category: "Restorative Dentistry",
    description: "Repair and rebuild damaged teeth",
    treatments: [
      {
        name: "Dental Crown",
        priceRange: "$150 - $350",
        includes: "Preparation, custom crown, fitting",
        note: "Zirconia or porcelain options",
      },
      {
        name: "Root Canal Treatment",
        priceRange: "$100 - $250",
        includes: "Complete procedure, all visits",
        note: "Per tooth, complexity varies",
      },
      {
        name: "Dental Bridge (3-unit)",
        priceRange: "$400 - $700",
        includes: "Preparation, custom bridge, fitting",
        note: "Replace missing teeth",
      },
    ],
  },
  {
    category: "Orthodontics",
    description: "Teeth alignment and correction",
    treatments: [
      {
        name: "Traditional Braces",
        priceRange: "$1,200 - $2,500",
        includes: "Complete treatment, all adjustments, retainers",
        note: "12-24 month treatment",
      },
      {
        name: "Clear Aligners",
        priceRange: "$1,500 - $3,500",
        includes: "Full set of aligners, monitoring, retainers",
        note: "Invisalign-style treatment",
      },
      {
        name: "Ceramic Braces",
        priceRange: "$1,500 - $3,000",
        includes: "Complete treatment, all adjustments, retainers",
        note: "Tooth-colored brackets",
      },
    ],
  },
];

const pricingFactors = [
  {
    icon: Stethoscope,
    factor: "Treatment Complexity",
    description:
      "Simple extractions cost less than surgical extractions. Single implants are more straightforward than full-arch restorations. Your specific condition determines the complexity.",
  },
  {
    icon: Sparkles,
    factor: "Material Selection",
    description:
      "We offer good, better, and best material options. All meet international standards, but premium materials (like E-max veneers) cost more than standard options.",
  },
  {
    icon: Clock,
    factor: "Treatment Duration",
    description:
      "Some treatments require multiple visits over months (orthodontics, staged implants). Longer treatment timelines may affect total cost.",
  },
  {
    icon: Users,
    factor: "Additional Procedures",
    description:
      "Bone grafting before implants, gum treatment before cosmetic work, or tooth extractions may be necessary. These are quoted separately and only recommended when truly needed.",
  },
];

const ethicalBilling = [
  {
    title: "We Only Recommend What You Need",
    description:
      "Our dentists are salaried professionals, not commission-based salespeople. They have no financial incentive to recommend unnecessary treatments. If a filling works, we won't push for a crown.",
  },
  {
    title: "Second Opinions Are Welcome",
    description:
      "Uncertain about a recommendation? We encourage you to seek a second opinion—even from another clinic. We're confident in our diagnoses and believe informed patients make better decisions.",
  },
  {
    title: "Payment Before Treatment Starts",
    description:
      "We collect payment or confirm payment arrangements before beginning treatment. This protects both parties and ensures no financial surprises during your care journey.",
  },
  {
    title: "Written Guarantees",
    description:
      "Major treatments come with written warranties. If a crown fails within the warranty period due to workmanship, we'll replace it at no additional cost.",
  },
];

const internationalComparison = [
  {
    treatment: "Single Dental Implant (with crown)",
    nepal: "$800 - $1,200",
    usa: "$3,000 - $5,000",
    uk: "$2,500 - $4,000",
    australia: "$4,000 - $6,000",
  },
  {
    treatment: "All-on-4 Full Arch",
    nepal: "$6,000 - $9,000",
    usa: "$20,000 - $30,000",
    uk: "$15,000 - $25,000",
    australia: "$22,000 - $35,000",
  },
  {
    treatment: "Porcelain Veneer (per tooth)",
    nepal: "$250 - $400",
    usa: "$1,000 - $2,500",
    uk: "$800 - $1,500",
    australia: "$1,200 - $2,000",
  },
  {
    treatment: "Dental Crown (Zirconia)",
    nepal: "$200 - $350",
    usa: "$1,000 - $1,500",
    uk: "$700 - $1,200",
    australia: "$1,000 - $1,800",
  },
  {
    treatment: "Root Canal + Crown",
    nepal: "$250 - $500",
    usa: "$1,500 - $2,500",
    uk: "$1,200 - $2,000",
    australia: "$1,500 - $2,500",
  },
  {
    treatment: "Complete Smile Makeover (12 veneers)",
    nepal: "$3,000 - $4,800",
    usa: "$12,000 - $30,000",
    uk: "$10,000 - $18,000",
    australia: "$15,000 - $24,000",
  },
];

export default function PricingPage() {
  const { getSectionByType } = usePageContent("pricing");
  
  const heroSection = getSectionByType("hero");
  const philosophySection = getSectionByType("philosophy");

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
              <DollarSign className="w-4 h-4" />
              {heroSection?.badge || "Honest, Transparent Pricing"}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {heroSection?.title || "Clear Pricing,"}{" "}
              <span className="text-primary">{heroSection?.titleHighlight || "No Surprises"}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {heroSection?.description || "We believe you deserve to know exactly what your dental care will cost before treatment begins. No hidden fees, no unexpected charges—just honest pricing for world-class care."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Philosophy */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Pricing Philosophy
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At Kundalini Dental Clinic, transparent pricing isn't just a policy—it's 
              a core value that guides how we treat every patient.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {pricingPhilosophy.map((item, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border/50 card-hover"
                variants={fadeInUp}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Treatment Pricing */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Treatment Cost Ranges
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These ranges represent typical costs for common treatments. Your specific 
              price depends on individual factors discussed during consultation.
            </p>
          </motion.div>

          <div className="space-y-8">
            {treatmentPricing.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden"
                {...fadeInUp}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="bg-primary/5 px-8 py-6 border-b border-border/50">
                  <h3 className="text-xl font-bold text-foreground">
                    {category.category}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {category.description}
                  </p>
                </div>
                <div className="divide-y divide-border/50">
                  {category.treatments.map((treatment, treatmentIndex) => (
                    <div
                      key={treatmentIndex}
                      className="px-8 py-6 flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          {treatment.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {treatment.includes}
                        </p>
                        <span className="text-xs text-accent mt-1 inline-block">
                          {treatment.note}
                        </span>
                      </div>
                      <div className="md:text-right">
                        <span className="text-2xl font-bold text-primary">
                          {treatment.priceRange}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          USD equivalent
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8 p-6 bg-accent/10 rounded-2xl border border-accent/20"
            {...fadeInUp}
          >
            <div className="flex items-start gap-4">
              <HelpCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Important Note About Pricing
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  These are indicative ranges based on typical cases. Your actual cost will 
                  be determined after a thorough examination and consultation. We always 
                  provide a detailed written estimate before beginning any treatment, and 
                  we never proceed without your explicit approval.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Affects Pricing */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Affects Your Final Price
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every patient is unique. Here's what determines the final cost of your 
              treatment plan.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {pricingFactors.map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-6"
                variants={fadeInUp}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.factor}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ethical Billing */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Ethical Standards
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Our Commitment to Ethical Billing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                At Kundalini Dental Clinic, we've built our practice on trust. Our billing 
                practices reflect our core belief: dental care should be honest, 
                straightforward, and focused on your wellbeing—not our revenue.
              </p>
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Over 5,000 patients treated with transparent, ethical billing practices
                </p>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {ethicalBilling.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border/50"
                  variants={fadeInUp}
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* International Cost Comparison */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              International Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How Our Prices Compare
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Quality dental care shouldn't require a fortune. Compare our prices with 
              typical costs in other countries—using the same materials, techniques, and 
              standards.
            </p>
          </motion.div>

          <motion.div
            className="overflow-x-auto"
            {...fadeInUp}
          >
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">
                    Treatment
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-primary bg-primary/5 rounded-t-lg">
                    Kundalini Dental
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-muted-foreground">
                    USA
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-muted-foreground">
                    UK
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-muted-foreground">
                    Australia
                  </th>
                </tr>
              </thead>
              <tbody>
                {internationalComparison.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-4 px-6 text-foreground font-medium">
                      {row.treatment}
                    </td>
                    <td className="py-4 px-6 text-center bg-primary/5">
                      <span className="font-bold text-primary">{row.nepal}</span>
                    </td>
                    <td className="py-4 px-6 text-center text-muted-foreground">
                      {row.usa}
                    </td>
                    <td className="py-4 px-6 text-center text-muted-foreground">
                      {row.uk}
                    </td>
                    <td className="py-4 px-6 text-center text-muted-foreground">
                      {row.australia}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            className="mt-8 p-6 bg-muted/50 rounded-2xl"
            {...fadeInUp}
          >
            <div className="flex items-start gap-4">
              <Globe className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Why the Difference?
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our significantly lower prices don't mean lower quality. Nepal has lower 
                  operational costs, including rent, utilities, and staff salaries—without 
                  compromising on education, training, or materials. Our dentists trained 
                  internationally and use the same premium materials as clinics worldwide. 
                  You benefit from economic differences, not quality differences.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get a Quote CTA */}
      <section className="section-padding bg-primary">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center"
            {...fadeInUp}
          >
            <Calculator className="w-16 h-16 text-primary-foreground/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Get Your Personalized Quote
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Ready to know exactly what your treatment will cost? Request a free consultation 
              and receive a detailed, no-obligation quote tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-primary"
              >
                <Link to="/contact">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Request Free Consultation
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

      {/* Trust Note */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <motion.div
            className="text-center"
            {...fadeInUp}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              A Final Word on Pricing
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We understand that cost is a significant factor in dental care decisions. 
              But we also believe that choosing based solely on the lowest price isn't 
              always wise. At Kundalini Dental Clinic, we offer the best possible value: 
              exceptional care at honest prices, delivered by skilled professionals who 
              genuinely care about your wellbeing. We're not the cheapest option—we're 
              the smartest investment in your dental health.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
