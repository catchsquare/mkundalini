import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, Check, Clock, DollarSign, Sparkles,
  Globe, Star, ChevronRight, Plane, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { usePageContent } from "@/hooks/use-page-content";
import { useServicesByCategory } from "@/hooks/use-services";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export default function ServicesPage() {
  const { getSectionByType } = usePageContent("services");
  const { data: categories, isLoading } = useServicesByCategory();
  
  const heroSection = getSectionByType("hero");
  const tourismSection = getSectionByType("tourism_highlight");

  // Get tourism-friendly services for the highlight section
  const tourismServices = categories
    ?.flatMap(c => c.treatments)
    .filter(t => t.tourism_friendly && t.comparison_price)
    .slice(0, 6) || [];

  return (
    <Layout>
      <SEO
        title="Dental Services & Treatments"
        description="Explore our full range of dental treatments — implants, veneers, orthodontics, root canals, cosmetic dentistry and more, all at international standards in Kathmandu."
        path="/services"
      />
      <Breadcrumbs items={[{ label: "Services" }]} />
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
              {heroSection?.badge || "Our Treatments"}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              {heroSection?.title || "World-Class Dental"}{" "}
              <span className="text-primary">{heroSection?.titleHighlight || "Treatments"}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {heroSection?.description || "From routine care to complex restorations, we offer comprehensive dental services using advanced technology and premium materials — all at a fraction of international costs."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && categories && categories.length > 0 && (
        <>
          {/* Quick Navigation */}
          <section className="bg-background/95 backdrop-blur-lg py-4 border-b border-border/50 sticky top-20 z-30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`#${category.slug}`}
                    className="px-3 sm:px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Dental Tourism Highlight */}
          {tourismServices.length > 0 && (
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
                    {tourismSection?.badge || "Dental Tourism"}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-secondary-foreground mb-4">
                    {tourismSection?.title || "High-Value Treatments for International Patients"}
                  </h2>
                  <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
                    {tourismSection?.description || "These treatments offer the greatest savings for patients traveling from abroad while maintaining the same quality as top clinics worldwide."}
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {tourismServices.map((treatment, index) => (
                    <motion.div
                      key={treatment.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="bg-secondary-foreground/10 rounded-2xl p-5 text-center"
                    >
                      <h3 className="font-semibold text-secondary-foreground mb-1 text-sm">
                        {treatment.title}
                      </h3>
                      <p className="text-primary font-bold text-sm">{treatment.comparison_price}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-10">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link to={tourismSection?.ctaLink || "/dental-tourism"}>
                      {tourismSection?.ctaLabel || "View Dental Tourism Packages"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Treatment Categories */}
          {categories.map((category, categoryIndex) => (
            <section
              key={category.id}
              id={category.slug}
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
                      {category.highlight && (
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
                          {category.highlight}
                        </span>
                      )}
                      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-lg text-muted-foreground">
                          {category.description}
                        </p>
                      )}
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
                      {treatment.tourism_friendly && (
                        <div className="bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground flex items-center justify-center gap-1">
                          <Globe className="w-3 h-3" />
                          Ideal for Dental Tourism
                        </div>
                      )}

                      {/* Service Image */}
                      {treatment.image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={treatment.image_url} 
                            alt={treatment.image_alt || treatment.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {treatment.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {treatment.short_description}
                        </p>

                        {/* Features */}
                        {treatment.features.length > 0 && (
                          <ul className="space-y-2 mb-5">
                            {treatment.features.map((feature) => (
                              <li key={feature} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Pricing */}
                        <div className="border-t border-border pt-4 space-y-2">
                          {treatment.price && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                <span>Price</span>
                              </div>
                              <span className="font-semibold text-primary">{treatment.price}</span>
                            </div>
                          )}
                          {treatment.duration && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>Duration</span>
                              </div>
                              <span className="text-sm text-foreground">{treatment.duration}</span>
                            </div>
                          )}
                          {treatment.comparison_price && (
                            <div className="bg-primary/5 rounded-lg px-3 py-2 text-center">
                              <span className="text-xs text-primary font-medium">
                                {treatment.comparison_price}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* CTAs */}
                        <div className="mt-5 space-y-2">
                          {treatment.body_content && (
                            <Link
                              to={`/services/${treatment.slug}`}
                              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 group/btn"
                            >
                              Learn More
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          )}
                          <Link
                            to="/contact"
                            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors group/btn ${
                              treatment.body_content 
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

          {/* Price Comparison Table - dynamic from services data */}
          {(() => {
            const comparisonData = categories
              .flatMap(c => c.treatments)
              .filter(t => t.price && t.comparison_price && t.price !== 'Custom quote')
              .slice(0, 6);
            
            if (comparisonData.length === 0) return null;

            return (
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
                            <th className="text-center p-4 font-semibold text-foreground">Comparison</th>
                            <th className="text-center p-4 font-semibold text-primary bg-primary/5">Our Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonData.map((row, index) => (
                            <tr key={row.id} className={index % 2 === 0 ? '' : 'bg-muted/20'}>
                              <td className="p-4 font-medium text-foreground">{row.title}</td>
                              <td className="p-4 text-center text-muted-foreground line-through">{row.comparison_price}</td>
                              <td className="p-4 text-center font-semibold text-primary bg-primary/5">{row.price}</td>
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
            );
          })()}
        </>
      )}

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
