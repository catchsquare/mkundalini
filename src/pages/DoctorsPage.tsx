import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Award, 
  GraduationCap, 
  Globe,
  Languages,
  BadgeCheck,
  Stethoscope,
  Clock,
  MapPin,
  Star,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const doctors = [
  {
    name: "Dr. Rajesh Sharma",
    role: "Chief Dental Surgeon & Founder",
    image: null,
    qualifications: [
      "BDS — Tribhuvan University, Nepal",
      "MDS (Prosthodontics) — AIIMS, New Delhi, India",
      "Fellowship in Implantology — ICOI, USA",
      "Advanced Training — University of Freiburg, Germany",
    ],
    experience: "18+ years",
    specialties: [
      "Dental Implants",
      "Full Mouth Rehabilitation",
      "Complex Prosthodontics",
      "All-on-4 Implants",
    ],
    languages: ["English", "Nepali", "Hindi"],
    bio: "Dr. Rajesh Sharma founded Kundalini Dental Clinic with a vision to bring world-class dental care to Nepal. After completing his advanced training at India's premier medical institution AIIMS and observerships in Germany and the USA, he returned home determined to raise the standard of dental treatment in the country. With over 3,000 successful implant procedures, Dr. Sharma is recognized as one of Nepal's leading implantologists.",
    achievements: [
      "3,000+ successful implant procedures",
      "Published researcher in prosthodontics",
      "International speaker at dental conferences",
      "Pioneer of CAD/CAM dentistry in Nepal",
    ],
    featured: true,
  },
  {
    name: "Dr. Anita Thapa",
    role: "Lead Cosmetic Dentist",
    image: null,
    qualifications: [
      "BDS — Kathmandu University, Nepal",
      "Fellowship in Aesthetic Dentistry — UCLA, USA",
      "Certification in Smile Design — DSD, Spain",
    ],
    experience: "12+ years",
    specialties: [
      "Porcelain Veneers",
      "Smile Makeovers",
      "Teeth Whitening",
      "Composite Bonding",
    ],
    languages: ["English", "Nepali"],
    bio: "Dr. Anita Thapa is a highly trained cosmetic dentist who studied advanced aesthetic techniques at UCLA in Los Angeles. She specializes in creating natural, beautiful smile transformations using the latest techniques including digital smile design. Her artistic eye and attention to detail have earned her a reputation as one of Nepal's finest cosmetic dentists.",
    achievements: [
      "500+ smile makeover transformations",
      "Certified Digital Smile Design practitioner",
      "Featured in national health publications",
    ],
    featured: false,
  },
  {
    name: "Dr. Sanjay Adhikari",
    role: "Consultant Orthodontist",
    image: null,
    qualifications: [
      "BDS — BP Koirala Institute, Nepal",
      "MDS (Orthodontics) — Manipal University, India",
      "Invisalign Certified Provider",
    ],
    experience: "10+ years",
    specialties: [
      "Invisible Aligners",
      "Traditional Braces",
      "Complex Orthodontics",
      "Adult Orthodontics",
    ],
    languages: ["English", "Nepali", "Hindi"],
    bio: "Dr. Sanjay Adhikari is an expert in modern orthodontic solutions, helping patients of all ages achieve perfectly aligned smiles. As a certified Invisalign provider, he offers the latest in clear aligner technology alongside traditional braces for complex cases. His gentle approach makes him particularly popular with younger patients and those with dental anxiety.",
    achievements: [
      "1,000+ orthodontic cases completed",
      "Invisalign Gold Provider",
      "Specialist in adult orthodontics",
    ],
    featured: false,
  },
  {
    name: "Dr. Priya Gurung",
    role: "Consultant Endodontist",
    image: null,
    qualifications: [
      "BDS — Tribhuvan University, Nepal",
      "MDS (Endodontics) — KGMU, India",
      "Microscopic Endodontics Training — Singapore",
    ],
    experience: "8+ years",
    specialties: [
      "Root Canal Treatment",
      "Microscopic Endodontics",
      "Retreatment Cases",
      "Dental Trauma",
    ],
    languages: ["English", "Nepali"],
    bio: "Dr. Priya Gurung uses advanced microscopic techniques to perform precise, pain-free root canal treatments with exceptional success rates. Her expertise in saving severely damaged teeth has helped countless patients avoid extraction. She is known for her calm demeanor and ability to put anxious patients at ease.",
    achievements: [
      "98% root canal success rate",
      "Specialist in complex retreatment cases",
      "Microscopic endodontics pioneer in Nepal",
    ],
    featured: false,
  },
  {
    name: "Dr. Amit Shrestha",
    role: "Oral & Maxillofacial Surgeon",
    image: null,
    qualifications: [
      "BDS — Kathmandu University, Nepal",
      "MDS (Oral Surgery) — Rajiv Gandhi University, India",
      "Fellowship in Maxillofacial Surgery — Bangkok, Thailand",
    ],
    experience: "9+ years",
    specialties: [
      "Wisdom Tooth Extraction",
      "Dental Implant Surgery",
      "Jaw Surgery",
      "Oral Pathology",
    ],
    languages: ["English", "Nepali", "Thai"],
    bio: "Dr. Amit Shrestha is a skilled oral surgeon who handles complex surgical procedures including impacted wisdom teeth, implant placements, and corrective jaw surgery. His extensive training in Thailand and India has equipped him with expertise in the latest surgical techniques, ensuring minimal discomfort and optimal healing for patients.",
    achievements: [
      "2,000+ successful surgical extractions",
      "Specialist in complex implant cases",
      "Expert in bone grafting procedures",
    ],
    featured: false,
  },
  {
    name: "Dr. Sunita Rai",
    role: "Pediatric Dentist",
    image: null,
    qualifications: [
      "BDS — Tribhuvan University, Nepal",
      "MDS (Pediatric Dentistry) — Bangalore, India",
      "Certification in Child Psychology",
    ],
    experience: "7+ years",
    specialties: [
      "Children's Dentistry",
      "Preventive Care",
      "Behavior Management",
      "Special Needs Patients",
    ],
    languages: ["English", "Nepali"],
    bio: "Dr. Sunita Rai specializes in making dental visits positive experiences for children. Her training in child psychology helps her communicate effectively with young patients and manage dental anxiety. She is passionate about preventive care and educating families about oral health habits that last a lifetime.",
    achievements: [
      "Specialist in anxious children",
      "Certified in pediatric sedation",
      "School oral health program leader",
    ],
    featured: false,
  },
];

const trustFactors = [
  {
    icon: GraduationCap,
    title: "International Training",
    description: "Our doctors trained at leading institutions in USA, UK, India, Germany, and Singapore.",
  },
  {
    icon: BadgeCheck,
    title: "Board Certified",
    description: "All specialists hold advanced degrees and certifications in their respective fields.",
  },
  {
    icon: Globe,
    title: "Global Standards",
    description: "We follow international protocols and use the same techniques as top clinics worldwide.",
  },
  {
    icon: Languages,
    title: "Multilingual Team",
    description: "Communicate comfortably in English, Nepali, Hindi, and other languages.",
  },
];

export default function DoctorsPage() {
  const featuredDoctor = doctors.find((d) => d.featured);
  const otherDoctors = doctors.filter((d) => !d.featured);

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
              <Stethoscope className="w-4 h-4" />
              Our Medical Team
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Meet Your{" "}
              <span className="text-primary">Dental Specialists</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Our team of internationally trained specialists brings world-class 
              expertise to Nepal. Each doctor is committed to delivering exceptional 
              care with compassion and precision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="bg-muted/30 py-12 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {trustFactors.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctor - Lead Specialist */}
      {featuredDoctor && (
        <section className="section-padding bg-background">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Lead Specialist
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
                Clinic Director & Founder
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-primary/15 via-accent/10 to-muted overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border-4 border-primary/20">
                        <Stethoscope className="w-20 h-20 text-primary/50" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Professional portrait
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="absolute -right-4 lg:-right-8 top-8 card-elevated p-4"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-bold text-xl text-foreground">{featuredDoctor.experience}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                </motion.div>

                {/* Achievement Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="absolute -left-4 lg:-left-8 bottom-12 card-elevated p-4"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="font-bold text-xl text-foreground">3,000+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Implant Procedures</p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {featuredDoctor.name}
                </h3>
                <p className="text-xl text-primary font-medium mb-6">
                  {featuredDoctor.role}
                </p>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  {featuredDoctor.bio}
                </p>

                {/* Qualifications */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    Qualifications
                  </h4>
                  <ul className="space-y-2">
                    {featuredDoctor.qualifications.map((qual) => (
                      <li key={qual} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialties */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredDoctor.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-primary" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredDoctor.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <Button asChild size="lg">
                  <Link to="/contact">
                    Book Consultation with Dr. Sharma
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Other Specialists */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Specialist Team
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-5">
              Our Expert Specialists
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each specialist brings years of focused training and expertise to ensure 
              you receive the best possible care in their field.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated overflow-hidden"
              >
                {/* Doctor Image Placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-accent/5 to-muted flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <Stethoscope className="w-12 h-12 text-primary/40" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-4">
                    {doctor.role}
                  </p>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-3">
                    {doctor.bio}
                  </p>

                  {/* Experience & Location */}
                  <div className="flex items-center gap-4 mb-5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{doctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Kathmandu</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-5">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {doctor.specialties.slice(0, 3).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                      {doctor.specialties.length > 3 && (
                        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                          +{doctor.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-5">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {doctor.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="border-t border-border pt-4">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                      Key Achievements
                    </h4>
                    <ul className="space-y-1">
                      {doctor.achievements.slice(0, 2).map((achievement) => (
                        <li key={achievement} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Award className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* International Patient Assurance */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              For International Patients
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-6 leading-tight">
              Your Care Is in Trusted Hands
            </h2>
            <p className="text-lg sm:text-xl text-secondary-foreground/80 mb-10 leading-relaxed max-w-3xl mx-auto">
              Traveling for dental care requires trust. Our team has treated patients 
              from over 25 countries, and we understand the unique needs of international 
              visitors. From your first consultation to post-treatment follow-up, 
              you'll receive clear communication and compassionate care.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left">
              <div className="bg-secondary-foreground/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Languages className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary-foreground mb-2">
                  English-Speaking Staff
                </h3>
                <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                  All doctors and key staff speak fluent English for clear communication.
                </p>
              </div>
              <div className="bg-secondary-foreground/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <BadgeCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary-foreground mb-2">
                  Verified Credentials
                </h3>
                <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                  All qualifications are verified and available for review upon request.
                </p>
              </div>
              <div className="bg-secondary-foreground/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary-foreground mb-2">
                  Global Experience
                </h3>
                <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                  500+ international patients treated with understanding and cultural sensitivity.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/dental-tourism">
                  Dental Tourism Information
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
              >
                <Link to="/contact">
                  Request Virtual Consultation
                </Link>
              </Button>
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
              Ready to Meet Your Dentist?
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              Book a consultation with one of our specialists and take the first step 
              toward the smile you deserve.
            </p>
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
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
