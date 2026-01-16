import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  Clock, 
  Shield,
  Award,
  Globe,
  Phone,
  ChevronDown,
  Stethoscope,
  Zap,
  Calendar,
  DollarSign,
  Star,
  BadgeCheck,
  HeartPulse,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const processSteps = [
  {
    step: 1,
    title: "Initial Consultation",
    duration: "60 minutes",
    description: "Comprehensive examination including 3D CT scan, oral health assessment, and discussion of your goals. We'll evaluate bone density and create a personalized treatment plan.",
    details: ["Full oral examination", "3D CT scan imaging", "Bone density assessment", "Treatment planning", "Cost estimate provided"],
  },
  {
    step: 2,
    title: "Treatment Planning",
    duration: "1-2 days",
    description: "Using advanced 3D software, we plan the exact position of your implant for optimal results. You'll see a digital preview of your new smile.",
    details: ["Digital smile design", "Surgical guide creation", "Implant selection", "Timeline confirmation"],
  },
  {
    step: 3,
    title: "Implant Placement",
    duration: "30-60 minutes per implant",
    description: "The titanium implant is placed into the jawbone using minimally invasive techniques. Local anesthesia ensures you feel no pain during the procedure.",
    details: ["Local anesthesia", "Guided implant placement", "Immediate temporary crown (if applicable)", "Post-operative instructions"],
  },
  {
    step: 4,
    title: "Healing Period",
    duration: "3-6 months",
    description: "The implant fuses with your jawbone through a process called osseointegration. During this time, you'll have a temporary restoration if needed.",
    details: ["Osseointegration process", "Regular check-ups", "Temporary crown care", "Bone-implant fusion"],
  },
  {
    step: 5,
    title: "Final Restoration",
    duration: "2 visits",
    description: "Once healed, we attach the custom-made crown, bridge, or denture to your implant. The result is a natural-looking tooth that functions just like your own.",
    details: ["Abutment placement", "Final crown fitting", "Bite adjustment", "Aftercare guidance"],
  },
];

const technology = [
  {
    name: "3D CT Imaging",
    description: "Precise 3D scans of your jaw for accurate implant planning and placement.",
    icon: Zap,
  },
  {
    name: "Guided Surgery",
    description: "Computer-guided placement for predictable results and faster healing.",
    icon: Stethoscope,
  },
  {
    name: "Premium Implants",
    description: "German and Swiss titanium implants with proven long-term success rates.",
    icon: Award,
  },
  {
    name: "Digital Design",
    description: "CAD/CAM technology for perfectly fitting, natural-looking crowns.",
    icon: Sparkles,
  },
];

const implantTypes = [
  {
    title: "Single Tooth Implant",
    description: "Replace one missing tooth without affecting adjacent teeth.",
    price: "From $350",
    usaPrice: "$3,000 - $5,000",
    idealFor: "Single missing tooth",
  },
  {
    title: "Multiple Implants",
    description: "Replace several missing teeth with individual implants.",
    price: "From $300/implant",
    usaPrice: "$2,500 - $4,000 each",
    idealFor: "Multiple gaps",
  },
  {
    title: "Implant Bridge",
    description: "Replace 3-4 teeth using 2 implants to support a bridge.",
    price: "From $1,200",
    usaPrice: "$6,000 - $10,000",
    idealFor: "Adjacent missing teeth",
  },
  {
    title: "All-on-4",
    description: "Full arch restoration using just 4 strategically placed implants.",
    price: "From $4,500",
    usaPrice: "$20,000 - $30,000",
    idealFor: "Full arch replacement",
  },
  {
    title: "All-on-6",
    description: "Enhanced stability with 6 implants for a complete arch.",
    price: "From $6,000",
    usaPrice: "$25,000 - $35,000",
    idealFor: "Maximum stability",
  },
];

const faqs = [
  {
    question: "Are dental implants painful?",
    answer: "The procedure itself is painless as it's performed under local anesthesia. Most patients report less discomfort than they expected. After the procedure, mild soreness is normal for a few days and is easily managed with over-the-counter pain medication. Many patients return to normal activities within 1-2 days.",
  },
  {
    question: "How long do dental implants last?",
    answer: "With proper care, dental implants can last a lifetime. The implant itself (the titanium post) is designed to be permanent. The crown on top may need replacement after 10-15 years due to normal wear, but the implant remains stable. We provide lifetime warranty on our implants.",
  },
  {
    question: "Am I a candidate for dental implants?",
    answer: "Most adults with good general health are candidates. Key factors include adequate jawbone density, healthy gums, and no uncontrolled medical conditions. Even if you have bone loss, bone grafting can often make implants possible. We'll conduct a thorough evaluation during your consultation.",
  },
  {
    question: "Can I get implants if I have bone loss?",
    answer: "Yes, in most cases. We offer bone grafting procedures that can rebuild lost jawbone and create a solid foundation for implants. Sinus lift procedures are also available for upper jaw bone loss. Our 3D imaging helps us assess your bone and plan accordingly.",
  },
  {
    question: "How long does the entire process take?",
    answer: "The complete process typically takes 3-6 months, with most of that time being the healing period. The actual surgical procedures require only a few visits. For international patients, we can often place implants during your first visit and fit the final crown during a follow-up visit 3-4 months later.",
  },
  {
    question: "What is the success rate of dental implants?",
    answer: "Dental implants have a success rate of 95-98% when placed by experienced professionals. At Kundalini Dental, our success rate exceeds 97%. We use premium implant systems and advanced technology to maximize success rates.",
  },
  {
    question: "Can I travel immediately after getting implants?",
    answer: "For international patients, we recommend staying in Kathmandu for 2-3 days after implant placement to ensure proper healing and address any concerns. After that, you're free to travel. We provide detailed aftercare instructions and remain available via WhatsApp for any questions.",
  },
  {
    question: "How do I care for dental implants?",
    answer: "Caring for implants is similar to caring for natural teeth: brush twice daily, floss regularly, and visit your dentist for check-ups. Implants can't get cavities, but gum health around them is important. We'll provide specific care instructions tailored to your situation.",
  },
];

const beforeAfterCases = [
  {
    title: "Single Front Tooth Replacement",
    description: "Patient lost front tooth due to trauma. Single implant with custom-matched crown.",
    treatment: "Single implant + E-max crown",
    duration: "4 months total",
  },
  {
    title: "Multiple Back Teeth",
    description: "Missing molars on both sides replaced with implant-supported crowns.",
    treatment: "4 implants + Zirconia crowns",
    duration: "5 months total",
  },
  {
    title: "Full Mouth Restoration",
    description: "Complete upper and lower arch restoration using All-on-4 technique.",
    treatment: "All-on-4 upper + lower",
    duration: "6 months total",
  },
];

export default function DentalImplantsPage() {
  return (
    <Layout>
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
                <span className="text-sm text-primary font-medium">Dental Implants</span>
              </div>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Globe className="w-4 h-4" />
                #1 Treatment for Dental Tourism
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Dental Implants
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                Permanent, natural-looking replacement for missing teeth. Our premium 
                titanium implants restore your smile, confidence, and ability to eat 
                comfortably — at a fraction of international costs.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Lifetime Warranty</div>
                    <div className="text-sm text-muted-foreground">On all implants</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">97%+ Success Rate</div>
                    <div className="text-sm text-muted-foreground">3,000+ procedures</div>
                  </div>
                </div>
              </div>

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
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-muted overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-9xl mb-4">🦷</div>
                    <p className="text-muted-foreground">Dental Implant Illustration</p>
                  </div>
                </div>
              </div>

              {/* Price Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -left-4 lg:-left-8 bottom-8 card-elevated p-5"
              >
                <div className="text-sm text-muted-foreground mb-1">Starting from</div>
                <div className="text-3xl font-bold text-primary">$350</div>
                <div className="text-sm text-muted-foreground line-through">$3,000+ in USA</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Overview */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-6">
              Missing Teeth Affect More Than Your Smile
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              When you lose a tooth, the consequences go beyond appearance. Understanding 
              these effects helps you appreciate why replacement matters.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "😔",
                title: "Confidence Loss",
                description: "Hiding your smile affects social interactions and self-esteem.",
              },
              {
                icon: "🦴",
                title: "Bone Deterioration",
                description: "Jawbone begins shrinking without tooth root stimulation.",
              },
              {
                icon: "🔄",
                title: "Teeth Shifting",
                description: "Adjacent teeth move into the gap, causing misalignment.",
              },
              {
                icon: "🍎",
                title: "Eating Difficulty",
                description: "Chewing becomes harder, affecting nutrition and enjoyment.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-6 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Explanation */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                The Solution
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6 leading-tight">
                What Are Dental Implants?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                A dental implant is a small titanium post that's surgically placed into 
                your jawbone, where it fuses with the bone to create a strong foundation 
                for a replacement tooth. Think of it as an artificial tooth root.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Once the implant has integrated with your bone, a custom-made crown is 
                attached on top. The result is a tooth that looks, feels, and functions 
                exactly like your natural teeth — often even better.
              </p>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">An implant consists of three parts:</h3>
                {[
                  { part: "The Implant", desc: "Titanium post placed in the jawbone (the 'root')" },
                  { part: "The Abutment", desc: "Connector piece that attaches to the implant" },
                  { part: "The Crown", desc: "The visible tooth that matches your natural teeth" },
                ].map((item) => (
                  <div key={item.part} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{item.part}:</span>
                      <span className="text-muted-foreground ml-1">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-elevated p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Why Choose Implants Over Other Options?
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      title: "Permanent Solution",
                      desc: "Unlike dentures, implants are fixed and don't need removal.",
                    },
                    {
                      title: "Preserve Bone Health",
                      desc: "The implant stimulates the jawbone, preventing deterioration.",
                    },
                    {
                      title: "No Impact on Adjacent Teeth",
                      desc: "Unlike bridges, neighboring teeth aren't ground down.",
                    },
                    {
                      title: "Natural Function",
                      desc: "Eat, speak, and smile with complete confidence.",
                    },
                    {
                      title: "Long-Lasting",
                      desc: "With proper care, implants can last a lifetime.",
                    },
                  ].map((item, index) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Used */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Advanced Technology
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-5">
              Technology Behind Your Treatment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We use the same advanced equipment and premium implant systems as 
              leading clinics in the USA and Europe.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technology.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <tech.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 card-elevated p-8 bg-secondary text-secondary-foreground"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-secondary-foreground mb-3">
                  Premium Implant Brands We Use
                </h3>
                <p className="text-secondary-foreground/80">
                  We exclusively use implants from world-renowned manufacturers with 
                  decades of clinical research and proven long-term success rates.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {["Straumann (Swiss)", "Nobel Biocare (Swedish)", "Osstem (Korean)", "Dentium (German)"].map((brand) => (
                  <span
                    key={brand}
                    className="px-4 py-2 rounded-full bg-secondary-foreground/10 text-secondary-foreground text-sm font-medium"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Your Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-5">
              Step-by-Step Treatment Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here's exactly what to expect during your dental implant journey with us.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border transform lg:-translate-x-0.5" />

            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-start gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'} pl-20 lg:pl-0`}>
                    <div className={`card-elevated p-6 ${index % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'} max-w-md`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          Step {step.step}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {step.duration}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                      <ul className="space-y-1">
                        {step.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-3 h-3 text-primary flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Step number circle */}
                  <div className="absolute left-8 lg:left-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm transform -translate-x-1/2 z-10">
                    {step.step}
                  </div>

                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline & Recovery */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Timeline & Recovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-5">
              What to Expect After Treatment
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-elevated p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Typical Timeline</h3>
              </div>
              <div className="space-y-4">
                {[
                  { phase: "Day 1", desc: "Implant placement surgery" },
                  { phase: "Days 2-3", desc: "Mild swelling, rest recommended" },
                  { phase: "Week 1", desc: "Return to normal activities" },
                  { phase: "Week 2", desc: "Suture removal (if applicable)" },
                  { phase: "Months 3-6", desc: "Osseointegration (bone fusion)" },
                  { phase: "Final Visit", desc: "Permanent crown placement" },
                ].map((item) => (
                  <div key={item.phase} className="flex items-start gap-4">
                    <div className="w-20 flex-shrink-0">
                      <span className="text-primary font-semibold text-sm">{item.phase}</span>
                    </div>
                    <div className="flex-1 text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-elevated p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <HeartPulse className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Recovery Tips</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Take prescribed medications as directed",
                  "Apply ice packs to reduce swelling",
                  "Eat soft foods for the first few days",
                  "Avoid smoking and alcohol during healing",
                  "Rinse gently with salt water after 24 hours",
                  "Attend all follow-up appointments",
                  "Contact us immediately if you have concerns",
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-accent/10 rounded-2xl p-6 text-center"
          >
            <p className="text-foreground">
              <span className="font-semibold">For International Patients:</span>
              {" "}Plan to stay in Kathmandu for 3-5 days for initial placement. 
              Return after 3-4 months for the final crown, or we can coordinate 
              with a dentist in your home country for the final step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Investment
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-5">
              Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium implants at a fraction of Western costs. All prices include 
              consultation, surgery, and final restoration.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {implantTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated p-6"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">{type.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{type.description}</p>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">{type.price}</span>
                </div>
                <p className="text-sm text-muted-foreground line-through mb-4">
                  {type.usaPrice} in USA
                </p>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Ideal for: {type.idealFor}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 card-elevated p-8 text-center"
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">
              What's Included in Our Price
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Consultation & 3D Scan",
                "Premium Implant",
                "Abutment",
                "Zirconia Crown",
                "All Follow-up Visits",
                "Lifetime Implant Warranty",
              ].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-6 text-muted-foreground text-sm">
              * Final pricing confirmed after consultation. Bone grafting, if needed, is quoted separately.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Before & After */}
      <section className="section-padding bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Real Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-5">
              Before & After Transformations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See the life-changing results our patients have achieved with dental implants.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {beforeAfterCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-elevated overflow-hidden"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <div className="w-16 h-16 rounded-lg bg-red-100 flex items-center justify-center">
                        <span className="text-2xl">😔</span>
                      </div>
                      <ArrowRight className="w-6 h-6 text-primary" />
                      <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
                        <span className="text-2xl">😁</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Before & After Photos</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{caseItem.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{caseItem.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                      {caseItem.treatment}
                    </span>
                    <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">
                      {caseItem.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                See More Cases During Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-5">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="card-elevated px-6 border-none"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Have a question not answered here?
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-primary">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Ready to Restore Your Smile?
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              Take the first step toward a complete, confident smile. Book your free 
              consultation and get a personalized treatment plan with transparent pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="bg-background text-primary hover:bg-background/90 shadow-lg"
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
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <a href="tel:+9771234567890">
                  <Phone className="w-5 h-5 mr-2" />
                  Call: +977 1-234-567890
                </a>
              </Button>
            </div>
            <p className="text-primary-foreground/70 text-sm mt-8">
              International patients: We offer free virtual consultations before your trip
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
