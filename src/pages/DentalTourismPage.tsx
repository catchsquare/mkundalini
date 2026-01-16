import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Plane,
  Hotel,
  Car,
  Stethoscope,
  Calendar,
  DollarSign,
  MessageCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const savingsComparison = [
  { treatment: "Single Dental Implant", usa: "$3,000-$5,000", nepal: "$400-$600" },
  { treatment: "Full Mouth Implants (All-on-4)", usa: "$20,000-$30,000", nepal: "$4,000-$6,000" },
  { treatment: "Porcelain Veneer (per tooth)", usa: "$1,000-$2,500", nepal: "$150-$250" },
  { treatment: "Root Canal + Crown", usa: "$2,000-$3,500", nepal: "$200-$350" },
  { treatment: "Teeth Whitening", usa: "$500-$1,000", nepal: "$100-$150" },
];

const process = [
  {
    step: 1,
    icon: MessageCircle,
    title: "Free Virtual Consultation",
    description:
      "Send us your X-rays and photos. Our specialists will assess your case and provide a detailed treatment plan with costs — all for free.",
  },
  {
    step: 2,
    icon: Calendar,
    title: "Plan Your Trip",
    description:
      "We'll recommend the optimal duration for your visit based on your treatment. Most procedures can be completed in 7-14 days.",
  },
  {
    step: 3,
    icon: Plane,
    title: "Arrive in Nepal",
    description:
      "We'll arrange airport pickup and transfer to your hotel. Take a day to rest and explore beautiful Kathmandu.",
  },
  {
    step: 4,
    icon: Stethoscope,
    title: "Begin Treatment",
    description:
      "Receive world-class dental care in our modern facility. We schedule multiple appointments efficiently to maximize your time.",
  },
  {
    step: 5,
    icon: Hotel,
    title: "Recover & Explore",
    description:
      "Between appointments, explore Nepal's wonders — from Himalayan views to ancient temples. We can arrange tours and activities.",
  },
];

const packages = [
  {
    name: "Smile Makeover Package",
    duration: "10-14 days",
    includes: [
      "8-10 porcelain veneers",
      "Professional whitening",
      "Smile design consultation",
      "Airport transfers",
      "4-star hotel accommodation",
      "City tour of Kathmandu",
    ],
    price: "From $2,500",
    savings: "Save up to $15,000 vs USA",
  },
  {
    name: "Implant Package",
    duration: "7-10 days (+ return visit)",
    includes: [
      "Dental implant(s) placement",
      "3D CT scan & planning",
      "Bone graft if needed",
      "Airport transfers",
      "3-star hotel accommodation",
      "Healing cap placement",
    ],
    price: "From $800 per implant",
    savings: "Save up to $3,000 per implant",
  },
  {
    name: "Full Mouth Restoration",
    duration: "14-21 days",
    includes: [
      "All-on-4 or All-on-6 implants",
      "Full arch restoration",
      "Premium zirconia prosthesis",
      "Airport transfers",
      "4-star hotel accommodation",
      "Post-op care kit",
    ],
    price: "From $6,000",
    savings: "Save up to $25,000 vs USA",
  },
];

const faqs = [
  {
    question: "Is dental treatment in Nepal safe?",
    answer:
      "Absolutely. Our clinic follows international sterilization protocols, uses FDA-approved materials from leading European and American manufacturers, and our dentists are trained at top institutions globally. We're happy to share our certifications and patient testimonials.",
  },
  {
    question: "How much can I really save?",
    answer:
      "Most patients save 60-80% compared to US, UK, or Australian prices — even after including flights and accommodation. For major treatments like implants or veneers, savings can be $10,000-$25,000.",
  },
  {
    question: "What about follow-up care when I return home?",
    answer:
      "We provide detailed records for your home dentist. Most treatments are completed during your stay. For implants requiring a healing period, we schedule a return visit 3-4 months later, or coordinate with a trusted dentist in your country.",
  },
  {
    question: "Do you accept international insurance?",
    answer:
      "We provide itemized invoices that most international insurance companies will accept for reimbursement. We recommend checking with your insurer before treatment.",
  },
];

export default function DentalTourismPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-accent py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-foreground/10 text-accent-foreground text-sm font-medium mb-6">
              <Plane className="w-4 h-4" />
              Dental Tourism
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-accent-foreground mt-2 mb-6">
              World-Class Dentistry. Himalayan Adventure.{" "}
              <span className="text-background/90">Incredible Savings.</span>
            </h1>
            <p className="text-lg text-accent-foreground/80 leading-relaxed mb-8">
              Join hundreds of international patients who combine exceptional dental 
              care with an unforgettable Nepal experience. Save up to 80% on treatments 
              while exploring one of the world's most beautiful destinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="xl"
                className="bg-background text-accent hover:bg-background/90"
              >
                <Link to="/contact">
                  Get Free Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
              >
                <a href="https://wa.me/9771234567890" target="_blank" rel="noopener">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Cost Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              See How Much You Can Save
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Same quality materials. Same expertise. A fraction of the price.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Treatment
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-muted-foreground">
                    USA Price
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">
                    Nepal Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {savingsComparison.map((item) => (
                  <tr key={item.treatment} className="border-b border-border/50">
                    <td className="py-4 px-4 text-foreground">{item.treatment}</td>
                    <td className="py-4 px-4 text-center text-muted-foreground line-through">
                      {item.usa}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-primary">
                      {item.nepal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <p className="text-sm text-muted-foreground text-center mt-6">
            * Prices are approximate and may vary based on individual cases. 
            Contact us for a personalized quote.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              Your Dental Tourism Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We handle everything so you can focus on your treatment and enjoying Nepal.
            </p>
          </motion.div>

          <div className="space-y-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="card-elevated p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Step {item.step}
                        </span>
                        <h3 className="text-xl font-semibold text-foreground">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="hidden md:flex w-16 h-16 rounded-full bg-primary text-primary-foreground items-center justify-center text-2xl font-bold shrink-0">
                  {item.step}
                </div>
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Treatment Packages
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              All-Inclusive Dental Packages
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything arranged for a seamless experience. Customize any package to your needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-8 flex flex-col"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.duration}</p>
                <ul className="space-y-3 mb-6 flex-1">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border pt-6">
                  <div className="text-2xl font-bold text-primary mb-1">{pkg.price}</div>
                  <div className="text-sm text-accent font-medium mb-4">{pkg.savings}</div>
                  <Button asChild className="w-full">
                    <Link to="/contact">Get Quote</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              FAQs
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
              Common Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-6"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
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
              Ready to Start Your Dental Tourism Journey?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Send us your X-rays and photos for a free, no-obligation quote. 
              We'll create a personalized treatment plan within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="bg-background text-primary hover:bg-background/90"
              >
                <Link to="/contact">
                  Get Free Quote
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
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}