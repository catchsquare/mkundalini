import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Sparkles, HandHeart, Quote, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useContentBlocks } from "@/hooks/use-content-blocks";
import { useTeamMembers } from "@/hooks/use-team-members";
import { useHeroSlide } from "@/hooks/use-hero-slide";
import { Skeleton } from "@/components/ui/skeleton";
import { getIcon } from "@/lib/icon-map";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export default function AboutPage() {
  const { byKey, loading } = useContentBlocks("about");
  const { members, loading: teamLoading } = useTeamMembers();
  const { slide: hero } = useHeroSlide("about");

  const coreValues = byKey("core_values");
  const safetyCommitments = byKey("safety_commitments");
  const milestones = byKey("milestones");
  const philosophy = byKey("philosophy");
  const ethicalPillars = byKey("ethical_pillars");
  const promiseChips = byKey("promise_chips");

  return (
    <Layout>
      <SEO
        title="About Us"
        description="Learn about Kundalini Dental Clinic — our mission, ethics, safety standards, and team delivering world-class dental care in Kathmandu, Nepal."
        path="/about"
      />
      <Breadcrumbs items={[{ label: "About" }]} />
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
              {hero?.badge_text || "Our Story"}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              {hero?.title || "Dentistry Built on"}{" "}
              <span className="text-primary">{hero?.subtitle || "Trust"}</span>
            </h1>
<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {hero?.description ||
                "At Kundalini Dental Clinic, we believe exceptional dental care begins with genuine human connection. Founded in 2023, we combine the experience of Dr. Nitin Aryal (practising dentistry since 2012) with modern facilities to serve you better."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6 leading-tight">
                More Than Dentistry — A Commitment to Your Well-Being
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                The name "Kundalini" reflects our holistic approach to care. We understand 
                that your oral health is deeply connected to your physical health, 
                confidence, and quality of life. This understanding shapes everything we do.
              </p>
              
              <div className="space-y-4">
                {philosophy.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5" />
                    <span className="text-foreground leading-relaxed">{item.description}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-muted overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <Quote className="w-16 h-16 text-primary/30 mx-auto mb-6" />
<blockquote className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed italic mb-6">
                      "We don't just fix teeth — we restore confidence, relieve pain, 
                      and help people reclaim their quality of life."
                    </blockquote>
                    <div className="text-primary font-semibold">Dr. Nitin Aryal</div>
                    <div className="text-sm text-muted-foreground">Managing Director</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-5">
              The Principles That Guide Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These aren't just words on a wall. They're the foundation of every 
              interaction, every treatment, and every decision we make.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              const Icon = getIcon(value.icon);
              return (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-elevated p-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety & Hygiene Commitment */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                {safetyCommitments.map((item, index) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-muted/50 rounded-2xl p-6 border border-border/50"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Your Safety
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6 leading-tight">
                Hospital-Grade Standards in Every Procedure
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Your safety is non-negotiable. We maintain sterilization and infection 
                control protocols that meet or exceed international hospital standards. 
                Every instrument, every surface, every procedure follows strict guidelines.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We use only FDA-approved, internationally certified materials from 
                reputable manufacturers in Germany, Switzerland, and Japan. You can 
                request documentation for any material used in your treatment — 
                we believe in complete transparency.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ethical Care Approach */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              <HandHeart className="w-4 h-4" />
              Ethical Care
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-6 leading-tight">
              Honest Dentistry, Always
            </h2>
            <p className="text-lg sm:text-xl text-secondary-foreground/80 mb-10 leading-relaxed max-w-3xl mx-auto">
              We believe trust is earned through honesty. That means giving you a 
              truthful assessment of your dental health — not recommending procedures 
              you don't need, and not minimizing problems that require attention.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              {ethicalPillars.map((pillar) => (
                <div key={pillar.id} className="bg-secondary-foreground/10 rounded-2xl p-6">
                  <h3 className="font-semibold text-secondary-foreground mb-2">{pillar.title}</h3>
                  <p className="text-secondary-foreground/70 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
<span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-5">
              Our Story
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border transform lg:-translate-x-0.5" />
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} pl-20 lg:pl-0`}>
                    <div className="card-elevated p-6 inline-block text-left">
                      <div className="text-2xl font-bold text-primary mb-1">{milestone.title}</div>
                      <div className="text-foreground">{milestone.description}</div>
                    </div>
                  </div>

                  <div className="absolute left-8 lg:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2 lg:-translate-x-2" />

                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-5">
              Experienced, Compassionate Specialists
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our team combines international training with genuine care. Each specialist 
              is committed to your comfort and the best possible outcomes.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 w-full rounded-2xl" />
                ))
              : members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card-elevated p-6 flex flex-col"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-5 flex items-center justify-center overflow-hidden">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.photo_alt || member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="w-10 h-10 text-primary" />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground text-lg text-center">{member.full_name}</h3>
                    <p className="text-sm text-primary text-center mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground text-center mb-4 flex-grow leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="text-xs text-muted-foreground border-t border-border pt-4 space-y-1">
                      {member.qualifications && member.qualifications.length > 0 && (
                        <p><span className="text-foreground/70">Education:</span> {member.qualifications.join(", ")}</p>
                      )}
                      {member.experience_years != null && (
                        <p><span className="text-foreground/70">Experience:</span> {member.experience_years} years</p>
                      )}
                      {member.specialties && member.specialties.length > 0 && (
                        <p><span className="text-foreground/70">Focus:</span> {member.specialties.join(", ")}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* Patient-Centric Mindset */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Promise
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6 leading-tight">
              You Are at the Center of Everything We Do
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              From the moment you contact us to your final follow-up, your experience 
              matters. We listen. We explain. We respect your time, your concerns, 
              and your decisions. This is dentistry done differently.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {promiseChips.map((item) => (
                <span
                  key={item.id}
                  className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {item.title}
                </span>
              ))}
            </div>
          </motion.div>
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Experience the Kundalini Difference
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              We invite you to visit our clinic, meet our team, and discover 
              what patient-centered dental care truly feels like.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="bg-background text-primary hover:bg-background/90 shadow-lg"
              >
                <Link to="/contact">
                  Book Your Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link to="/services">
                  Explore Our Services
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
