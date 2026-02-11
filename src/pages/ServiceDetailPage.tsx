import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Phone, Globe, Check, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useServiceBySlug } from "@/hooks/use-services";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, error } = useServiceBySlug(slug || '');

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
      {/* SEO */}
      {(service.seo_title || service.hero_title) && (
        <title>{service.seo_title || service.hero_title || service.title}</title>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Link 
                  to="/services" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Treatments
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm text-primary font-medium">{service.title}</span>
              </div>

              {service.hero_badge && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Globe className="w-4 h-4" />
                  {service.hero_badge}
                </span>
              )}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                {service.hero_title || service.title}
              </h1>

              {service.hero_description && (
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                  {service.hero_description}
                </p>
              )}

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                {service.price && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">$</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{service.price}</div>
                      {service.comparison_price && (
                        <div className="text-sm text-muted-foreground line-through">{service.comparison_price}</div>
                      )}
                    </div>
                  </div>
                )}
                {service.duration && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">⏱</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{service.duration}</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              {service.features.length > 0 && (
                <div className="space-y-2 mb-8">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="xl">
                  <Link to="/contact">
                    Book Free Consultation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="heroOutline" size="xl">
                  <a href="tel:+9771234567890">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {service.hero_image_url ? (
                <img
                  src={service.hero_image_url}
                  alt={service.image_alt || service.title}
                  className="rounded-3xl w-full object-cover aspect-square"
                />
              ) : (
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-muted overflow-hidden relative flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-9xl mb-4">🦷</div>
                    <p className="text-muted-foreground">{service.title}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rich Text Body Content */}
      {service.body_content && (
        <section className="section-padding bg-background">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: service.body_content }}
            />
          </div>
        </section>
      )}

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-4">
              {service.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="card-elevated px-6"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-accent">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-accent-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
              Book a free consultation to discuss your {service.title.toLowerCase()} treatment plan.
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
                <Link to="/services">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  View All Services
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
