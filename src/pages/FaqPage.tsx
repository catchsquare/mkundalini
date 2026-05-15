import { Layout } from "@/components/layout/Layout";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { useFaqs } from "@/hooks/use-faqs";
import { useHeroSlide } from "@/hooks/use-hero-slide";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export default function FaqPage() {
  const { settings } = useGlobalSettings();
  const { grouped, faqs, loading } = useFaqs();
  const { slide: hero } = useHeroSlide("faq");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <Layout>
      <SEO
        title="Frequently Asked Questions"
        description="Answers to the most common questions about treatments, pricing, dental tourism, safety, and appointments at Kundalini Dental Clinic."
        path="/faq"
        jsonLd={faqs.length ? faqSchema : undefined}
      />
      <Breadcrumbs items={[{ label: "FAQs" }]} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {hero?.title || "Frequently Asked Questions"}
            {hero?.subtitle && <> <span className="text-primary">{hero.subtitle}</span></>}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {hero?.description ||
              "Everything you need to know about our treatments, pricing, and what to expect — all in one place."}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-7 w-40" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ))
            : Object.entries(grouped).map(([title, items]) => (
                <div key={title}>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {items.map((item, idx) => (
                      <AccordionItem key={item.id} value={`${title}-${idx}`}>
                        <AccordionTrigger className="text-left text-base font-medium hover:text-primary">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.answer}
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
