import { Layout } from "@/components/layout/Layout";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqGroups = [
  {
    title: "General",
    items: [
      {
        q: "Where is your clinic located and what are your hours?",
        a: "We're located in Kathmandu, Nepal. Sunday to Friday we're open during regular clinic hours, and we have shortened hours on Saturday. Exact timings are listed on our Contact page.",
      },
      {
        q: "Do I need an appointment, or can I walk in?",
        a: "We strongly recommend booking an appointment so our team can prepare for your visit and minimise your wait. Walk-ins are accepted when slots are available, but priority is given to scheduled patients.",
      },
      {
        q: "Do you treat children?",
        a: "Yes. We provide gentle, child-friendly dentistry including cleanings, fluoride treatment, sealants, and minor restorative work for children of all ages.",
      },
      {
        q: "What languages do you speak?",
        a: "Our team is fluent in English, Nepali, and Hindi, making communication easy for both local and international patients.",
      },
    ],
  },
  {
    title: "Treatments & Procedures",
    items: [
      {
        q: "How long does a dental implant take?",
        a: "A standard single implant is typically completed over 3–6 months, allowing time for the implant to integrate with the jawbone before placing the final crown. Some cases qualify for same-day implants.",
      },
      {
        q: "Are root canals painful?",
        a: "Modern root canal therapy is performed under local anaesthesia and is no more uncomfortable than getting a filling. Most patients feel immediate relief from the original tooth pain.",
      },
      {
        q: "How white can teeth whitening make my smile?",
        a: "Professional whitening typically lightens teeth 4–8 shades, depending on starting colour and treatment plan. Results last 1–3 years with good oral hygiene and follow-up care.",
      },
      {
        q: "Do you offer clear aligners like Invisalign?",
        a: "Yes. We provide clear aligner treatment as well as traditional braces. Your dentist will recommend the best option based on your case complexity and lifestyle.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    items: [
      {
        q: "Why are your prices lower than in Western countries?",
        a: "Lower operational costs in Nepal — not lower quality — allow us to offer international-standard care at a fraction of the price. We use the same materials, brands, and protocols used in top clinics worldwide.",
      },
      {
        q: "Do you accept insurance?",
        a: "We provide detailed receipts and treatment summaries for international insurance reimbursement. For local insurance providers, please contact us to confirm coverage before treatment.",
      },
      {
        q: "Can I pay in instalments?",
        a: "Yes — for multi-stage treatments such as orthodontics, implants, or full-mouth rehabilitation, payments can be split across treatment milestones.",
      },
    ],
  },
  {
    title: "Dental Tourism",
    items: [
      {
        q: "How does dental tourism with you work?",
        a: "Send us your photos or x-rays for a free remote consultation. We'll prepare a treatment plan and quote, help coordinate your visit, and complete your treatment in as few trips as possible.",
      },
      {
        q: "Do you help with travel arrangements?",
        a: "We can recommend trusted hotels near the clinic and provide guidance on visas, airport pickup, and local transport. Booking and payment for travel are handled directly by you.",
      },
      {
        q: "Is it safe to fly soon after dental treatment?",
        a: "Most patients can fly the same day or the day after routine treatments. For surgical procedures like implants or extractions, we recommend waiting 24–48 hours before flying.",
      },
    ],
  },
  {
    title: "Safety & Hygiene",
    items: [
      {
        q: "What sterilization protocols do you follow?",
        a: "We follow international hospital-grade sterilization standards: autoclave sterilization for all reusable instruments, single-use disposables wherever possible, and strict cross-contamination protocols.",
      },
      {
        q: "Are your materials FDA-approved?",
        a: "Yes. We use FDA-approved and CE-marked materials from globally recognised manufacturers for implants, crowns, fillings, and other restorations.",
      },
    ],
  },
];

export default function FaqPage() {
  const { settings } = useGlobalSettings();

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  };

  return (
    <Layout>
      <title>Frequently Asked Questions | {settings.clinic_name}</title>
      <meta
        name="description"
        content="Answers to the most common questions about treatments, pricing, dental tourism, safety, and appointments at Kundalini Dental Clinic."
      />
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our treatments, pricing, and what to expect — all in one place.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-2xl font-bold text-foreground mb-4">{group.title}</h2>
              <Accordion type="single" collapsible className="w-full">
                {group.items.map((item, idx) => (
                  <AccordionItem key={idx} value={`${group.title}-${idx}`}>
                    <AccordionTrigger className="text-left text-base font-medium hover:text-primary">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-muted/30 border-t border-border/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our team is happy to help. Reach out and we'll get back to you within one business day.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
