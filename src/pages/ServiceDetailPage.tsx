import { useParams, Link } from "react-router-dom";
import { sanitizeHTML } from "@/lib/sanitize";
import { motion } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Phone, Globe, Check, 
  Loader2, Clock, DollarSign, Shield, Star,
  ChevronRight, Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useServiceBySlug, useServicesByCategory } from "@/hooks/use-services";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, error } = useServiceBySlug(slug || '');
  const { data: categories } = useServicesByCategory();

  // Get related services from the same category
  const relatedServices = categories
    ?.flatMap(c => c.treatments)
    .filter(t => t.slug !== slug && t.is_active)
    .slice(0, 3) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-3xl font-bold text-foreground mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/services">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* SEO Meta */}
      {(service.seo_title || service.hero_title) && (
        <title>{service.seo_title || service.hero_title || service.title}</title>
      )}

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-foreground font-medium truncate">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {service.hero_badge && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  {service.hero_badge}
                </span>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5">
                {service.hero_title || service.title}
              </h1>

              {service.hero_description && (
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                  {service.hero_description}
                </p>
              )}

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {service.price && (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Price</span>
                    </div>
                    <p className="font-bold text-foreground">{service.price}</p>
                    {service.comparison_price && (
                      <p className="text-xs text-muted-foreground line-through">{service.comparison_price}</p>
                    )}
                  </div>
                )}
                {service.duration && (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Duration</span>
                    </div>
                    <p className="font-bold text-foreground">{service.duration}</p>
                  </div>
                )}
              </div>

              {/* Features */}
              {service.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {service.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-sm text-foreground"
                    >
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="rounded-xl">
                  <Link to="/contact">
                    Book Free Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl">
                  <a href="tel:+9771234567890">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              {service.hero_image_url ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={service.hero_image_url}
                    alt={service.image_alt || service.title}
                    className="w-full object-cover aspect-[4/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-muted overflow-hidden relative flex items-center justify-center border border-border/50 shadow-lg">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Stethoscope className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">{service.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">Professional Dental Care</p>
                  </div>
                </div>
              )}

              {/* Tourism Badge Overlay */}
              {service.tourism_friendly && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <Globe className="w-3.5 h-3.5" />
                  Tourism Friendly
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rich Text Body Content */}
      {service.body_content && (
        <section className="py-14 lg:py-20 bg-background">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rich-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.body_content) }}
            />
          </div>
        </section>
      )}

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mt-2">
                Everything you need to know about {service.title.toLowerCase()}
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-3">
              {service.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem
                    value={`faq-${index}`}
                    className="bg-card border border-border rounded-xl px-6 shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary text-sm sm:text-base py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm sm:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            {/* FAQ Schema Markup for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: service.faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: faq.answer,
                    },
                  })),
                }),
              }}
            />
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 lg:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Other Services You May Need
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedServices.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/services/${related.slug}`}
                    className="block bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {related.title}
                    </h3>
                    {related.short_description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {related.short_description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {related.price && (
                        <span className="text-sm font-semibold text-primary">{related.price}</span>
                      )}
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shield className="w-12 h-12 text-primary-foreground/80 mx-auto mb-5" />
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
              Ready to Get Started with {service.title}?
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Book a free consultation to discuss your treatment plan. Our experts will guide you through every step.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-background text-primary hover:bg-background/90 rounded-xl"
              >
                <Link to="/contact">
                  Book Free Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl"
              >
                <Link to="/services">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  View All Services
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: service.title,
            description: service.hero_description || service.short_description,
            ...(service.price && {
              offers: {
                "@type": "Offer",
                price: service.price,
                priceCurrency: "USD",
              },
            }),
          }),
        }}
      />
    </Layout>
  );
}