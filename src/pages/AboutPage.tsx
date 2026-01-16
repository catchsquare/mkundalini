import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award, GraduationCap, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const team = [
  {
    name: "Dr. Rajesh Sharma",
    role: "Chief Dental Surgeon & Founder",
    education: "BDS (TU), MDS Prosthodontics (AIIMS Delhi)",
    experience: "18 years",
    specialization: "Implantology & Full Mouth Rehabilitation",
  },
  {
    name: "Dr. Anita Thapa",
    role: "Lead Cosmetic Dentist",
    education: "BDS (KU), Fellowship in Aesthetic Dentistry (USA)",
    experience: "12 years",
    specialization: "Veneers, Smile Design & Whitening",
  },
  {
    name: "Dr. Sanjay Adhikari",
    role: "Orthodontist",
    education: "BDS (BPKIHS), MDS Orthodontics (Manipal)",
    experience: "10 years",
    specialization: "Invisible Aligners & Complex Orthodontics",
  },
  {
    name: "Dr. Priya Gurung",
    role: "Endodontist",
    education: "BDS (TU), MDS Endodontics (KGMU)",
    experience: "8 years",
    specialization: "Microscopic Root Canal Treatment",
  },
];

const values = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description:
      "Every treatment decision is made with your comfort, goals, and well-being as the priority.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We continuously update our skills and technology to deliver the highest standard of care.",
  },
  {
    icon: Users,
    title: "Compassion",
    description:
      "We understand dental anxiety and create a calm, supportive environment for all patients.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "We empower patients with knowledge to make informed decisions about their oral health.",
  },
];

const milestones = [
  { year: "2009", event: "Kundalini Dental Clinic founded in Kathmandu" },
  { year: "2012", event: "Expanded to 4-chair clinic with specialist team" },
  { year: "2015", event: "Introduced digital dentistry & CAD/CAM technology" },
  { year: "2018", event: "Launched Dental Tourism program for international patients" },
  { year: "2021", event: "Moved to state-of-the-art facility at Durbar Marg" },
  { year: "2024", event: "10,000+ successful treatments milestone" },
];

export default function AboutPage() {
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
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-2 mb-6">
              Your Smile, Our Mission
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Since 2009, Kundalini Dental Clinic has been transforming smiles in 
              Nepal and beyond. We combine international expertise with genuine care 
              to deliver exceptional dental experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Kundalini Dental Clinic was founded by Dr. Rajesh Sharma with a 
                  vision: to bring world-class dental care to Nepal. After completing 
                  his advanced training at AIIMS Delhi and observerships in Germany 
                  and USA, Dr. Sharma returned home determined to raise the bar for 
                  dental treatment in the country.
                </p>
                <p>
                  What started as a modest two-chair clinic has grown into Kathmandu's 
                  premier dental destination. Today, we serve thousands of patients 
                  annually, including a growing number of international visitors who 
                  choose Nepal for affordable, high-quality dental tourism.
                </p>
                <p>
                  Our name "Kundalini" reflects our belief in holistic wellness — 
                  understanding that oral health is deeply connected to overall 
                  physical and emotional well-being. We treat the whole person, 
                  not just teeth.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-elevated p-8"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Our Journey
              </h3>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-semibold text-primary">
                        {milestone.year}
                      </div>
                      <div className="text-foreground">{milestone.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
              What Drives Us
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section-padding">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              Meet Your Dental Experts
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team combines decades of experience with continuous education 
              to stay at the forefront of dental medicine.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-6 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{member.education}</p>
                  <p>{member.experience} experience</p>
                  <p className="font-medium text-foreground/70">
                    {member.specialization}
                  </p>
                </div>
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
              Experience the Kundalini Difference
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who've trusted us with their smiles. 
              Book your appointment today and discover compassionate, expert dental care.
            </p>
            <Button
              asChild
              size="xl"
              className="bg-background text-primary hover:bg-background/90"
            >
              <Link to="/contact">
                Book Appointment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}