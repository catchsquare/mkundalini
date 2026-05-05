import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Globe,
  MessageCircle,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Video,
  FileText,
  Heart,
  ArrowRight,
  Smartphone,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { submitLead } from "@/lib/leads";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { usePageContent } from "@/hooks/use-page-content";
import { useContentBlocks } from "@/hooks/use-content-blocks";
import { useHeroSlide } from "@/hooks/use-hero-slide";
import { Skeleton } from "@/components/ui/skeleton";
import { getIcon } from "@/lib/icon-map";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1 },
  },
  viewport: { once: true },
};

const fallbackContactMethods = [
  { icon: "MessageCircle", title: "WhatsApp", subtitle: "Fastest Response", value: "+977-9802808008", href: "https://wa.me/9779802808008", description: "Get instant responses. Share photos, X-rays, and questions directly.", responseTime: "Usually within 1 hour", color: "bg-green-500" },
  { icon: "Phone", title: "Phone", subtitle: "Call Us Directly", value: "+977-9802808008", href: "tel:+9779802808008", description: "Speak directly with our team during clinic hours.", responseTime: "During clinic hours", color: "bg-purple-500" },
  { icon: "Video", title: "Video Consultation", subtitle: "Face-to-Face Online", value: "Book a Session", href: "#booking-form", description: "Schedule a video call with our dental team.", responseTime: "By appointment", color: "bg-accent" },
  { icon: "Mail", title: "Email", subtitle: "Detailed Inquiries", value: "info@kundalinidentalclinic.com.np", href: "mailto:info@kundalinidentalclinic.com.np", description: "Best for sending X-rays, photos, and detailed treatment histories.", responseTime: "Within 24 hours", color: "bg-primary" },
];

const fallbackBookingSteps = [
  { step: 1, title: "Submit Your Inquiry", description: "Fill out the form below or contact us via WhatsApp with your dental concerns and goals." },
  { step: 2, title: "Free Virtual Consultation", description: "We'll review your case and schedule a video call to discuss treatment options and costs." },
  { step: 3, title: "Receive Your Treatment Plan", description: "Get a detailed, personalized treatment plan with transparent pricing—no obligations." },
  { step: 4, title: "Confirm Your Visit", description: "Once you're ready, we'll help coordinate your appointment dates and travel logistics." },
];

const fallbackTreatmentOptions = [
  { value: "implants", label: "Dental Implants" },
  { value: "veneers", label: "Veneers / Smile Makeover" },
  { value: "crowns", label: "Crowns & Bridges" },
  { value: "orthodontics", label: "Braces / Aligners" },
  { value: "whitening", label: "Teeth Whitening" },
  { value: "rootcanal", label: "Root Canal Treatment" },
  { value: "extraction", label: "Tooth Extraction" },
  { value: "checkup", label: "General Checkup" },
  { value: "other", label: "Other / Not Sure" },
];

const fallbackClinicHours = [
  { day: "Sunday - Friday", hours: "9:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
  { day: "Public Holidays", hours: "Closed" },
];

const fallbackReassurances = [
  { icon: "Shield", title: "No Obligation", description: "Free consultations with zero pressure to proceed" },
  { icon: "Clock", title: "Quick Response", description: "We respond within 24 hours, often much faster" },
  { icon: "Users", title: "Dedicated Support", description: "A personal coordinator assigned to your case" },
  { icon: "Heart", title: "Patient-First", description: "Your comfort and satisfaction is our priority" },
];

export default function ContactPage() {
  const { toast } = useToast();
  const { settings } = useGlobalSettings();
  const { getSectionByType } = usePageContent("contact");
  const { byKey, loading: blocksLoading } = useContentBlocks("contact");
  const { slide: heroSlide } = useHeroSlide("contact");

  const contactMethodBlocks = byKey("contact_methods");
  const bookingStepBlocks = byKey("booking_steps");
  const treatmentOptionBlocks = byKey("treatment_options");
  const clinicHourBlocks = byKey("clinic_hours");
  const reassuranceBlocks = byKey("reassurances");

  const contactMethods = contactMethodBlocks.length > 0
    ? contactMethodBlocks.map((b) => {
        const m = (b.metadata || {}) as any;
        return {
          icon: b.icon || "Phone",
          title: b.title || "",
          subtitle: m.subtitle || "",
          value: m.value || b.title || "",
          href: b.link_url || "#",
          description: b.description || "",
          responseTime: m.response_time || "",
          color: m.color || "bg-primary",
        };
      })
    : fallbackContactMethods;

  const bookingSteps = bookingStepBlocks.length > 0
    ? bookingStepBlocks.map((b, i) => ({ step: ((b.metadata || {}) as any).step || i + 1, title: b.title || "", description: b.description || "" }))
    : fallbackBookingSteps;

  const treatmentOptions = treatmentOptionBlocks.length > 0
    ? treatmentOptionBlocks.map((b) => ({ value: b.title || "", label: b.description || b.title || "" }))
    : fallbackTreatmentOptions;

  const clinicHours = clinicHourBlocks.length > 0
    ? clinicHourBlocks.map((b) => ({ day: b.title || "", hours: b.description || "" }))
    : fallbackClinicHours;

  const reassurances = reassuranceBlocks.length > 0
    ? reassuranceBlocks.map((b) => ({ icon: b.icon || "Sparkles", title: b.title || "", description: b.description || "" }))
    : fallbackReassurances;

  const heroSection = heroSlide
    ? { badge: heroSlide.badge_text, title: heroSlide.title, titleHighlight: heroSlide.subtitle, description: heroSlide.description }
    : getSectionByType("hero");
  const contactMethodsSection = getSectionByType("contact_methods");
  const bookingSection = getSectionByType("booking_process");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    treatment: "",
    preferredDate: "",
    isInternational: false,
    hasXrays: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.country.trim()) {
      newErrors.country = "Please enter your country";
    }
    
    if (!formData.treatment) {
      newErrors.treatment = "Please select a treatment type";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please check the form",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    const result = await submitLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      source: "website",
      form_type: "contact",
      treatment_interest: formData.treatment,
      metadata: {
        country: formData.country,
        preferred_date: formData.preferredDate,
        is_international: formData.isInternational,
        has_xrays: formData.hasXrays,
      },
    });

    if (result.success) {
      toast({
        title: "Inquiry Received!",
        description: "Our team will contact you within 24 hours to schedule your consultation.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        treatment: "",
        preferredDate: "",
        isInternational: false,
        hasXrays: false,
        message: "",
      });
      setErrors({});
    } else {
      toast({
        title: "Something went wrong",
        description: result.error || "Please try again or contact us directly via WhatsApp.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Layout>
      {/* Hero - with proper padding for fixed header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              {heroSection?.badge || "Book Your Appointment"}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {heroSection?.title || "Your Smile Journey"}{" "}
              <span className="text-primary">{heroSection?.titleHighlight || "Starts Here"}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {heroSection?.description || "Whether you're across town or across the world, reaching us is easy. Choose your preferred way to connect, and we'll guide you through every step of your dental care journey."}
            </p>
          </motion.div>

          {/* Reassurance Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {reassurances.map((item, index) => {
              const Icon = getIcon(item.icon);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border/50"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground font-medium">{item.title}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Choose How to Connect
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're available through multiple channels to suit your preference. 
              International patients especially love our WhatsApp support.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="bg-card rounded-2xl p-6 border border-border/50 card-hover group block"
                variants={fadeInUp}
              >
                <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center mb-4`}>
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{method.title}</h3>
                <span className="text-xs text-accent font-medium">{method.subtitle}</span>
                <p className="text-primary font-medium mt-3 group-hover:underline">
                  {method.value}
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {method.description}
                </p>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {method.responseTime}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How Booking Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From first contact to sitting in our chair, we make the process 
              smooth and stress-free.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {bookingSteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={fadeInUp}
              >
                {index < bookingSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}
                <div className="relative bg-card rounded-2xl p-6 border border-border/50 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Booking Form */}
      <section id="booking-form" className="section-padding bg-background scroll-mt-24">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <motion.div
              className="lg:col-span-2"
              {...fadeInUp}
            >
              <div className="bg-card rounded-2xl p-8 md:p-10 border border-border/50">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Request Your Consultation
                </h2>
                <p className="text-muted-foreground mb-8">
                  Fill out this form and we'll get back to you within 24 hours with 
                  next steps. No commitment required.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1.5">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1.5">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone / WhatsApp *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country *
                      </label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Your country"
                        required
                      />
                    </div>
                  </div>

                  {/* Treatment & Date */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Treatment Interest *
                      </label>
                      <select
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleChange}
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      >
                        <option value="">Select treatment type</option>
                        {treatmentOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Preferred Visit Date
                      </label>
                      <Input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isInternational"
                        checked={formData.isInternational}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">
                        I'm an international patient traveling to Nepal for treatment
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasXrays"
                        checked={formData.hasXrays}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">
                        I have X-rays or photos to share for initial assessment
                      </span>
                    </label>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tell Us About Your Dental Needs
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your dental concerns, goals, or any questions you have..."
                      rows={5}
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Consultation Request
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 sm:mt-3">
                      By submitting, you agree to our privacy policy. We'll never 
                      share your information.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* WhatsApp CTA */}
              <div className="bg-green-500 rounded-2xl p-6 text-white">
                <MessageCircle className="w-10 h-10 mb-4" />
                <h3 className="font-bold text-lg mb-2">Prefer WhatsApp?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Skip the form! Send us a message directly and get a response 
                  within an hour during business hours.
                </p>
<a
                  href="https://wa.me/9779802808008?text=Hello!%20I'm%20interested%20in%20dental%20treatment%20at%20Kundalini%20Dental%20Clinic."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* For International Patients */}
              <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
                <Globe className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-bold text-foreground mb-2">International Patients</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Send us your dental X-rays and photos for a comprehensive 
                  remote assessment and detailed treatment quote before you travel.
                </p>
                <Link
                  to="/dental-tourism"
                  className="inline-flex items-center gap-2 text-accent font-medium text-sm hover:underline"
                >
                  Learn About Dental Tourism
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Clinic Hours */}
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="font-bold text-foreground">Clinic Hours</h3>
                </div>
                <div className="space-y-2">
                  {clinicHours.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.day}</span>
                      <span className="text-foreground font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Nepal Standard Time (UTC+5:45)
                </p>
              </div>

              {/* What to Prepare */}
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <FileText className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-bold text-foreground mb-3">What to Prepare</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Recent dental X-rays (if available)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Photos of your teeth/smile
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    List of current medications
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Medical history summary
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide mx-auto">
          <motion.div
            className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 md:p-10"
            {...fadeInUp}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Dental Emergency?
                </h3>
                <p className="text-muted-foreground">
                  For urgent dental issues outside regular hours, including severe pain, 
                  trauma, or swelling, contact our emergency line. We provide 24/7 
                  guidance for existing patients and emergency walk-ins when possible.
                </p>
              </div>
              <div className="flex flex-col gap-3">
<a
                  href="tel:+9779802808008"
                  className="inline-flex items-center justify-center gap-2 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-medium hover:bg-destructive/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Emergency: +977-9802808008
                </a>
                <p className="text-xs text-muted-foreground text-center">
                  Available 24/7 for emergencies
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location & Map */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Visit Our Clinic
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Located in the heart of Kathmandu, our modern clinic is easily 
              accessible from major hotels and the international airport.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <motion.div
              className="aspect-[4/3] bg-muted rounded-2xl overflow-hidden relative"
              {...fadeInUp}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
<h3 className="font-bold text-foreground mb-2">
                    Kundalini Dental Clinic
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Goreto Bhawan, Chappal Karkhana, Kathmandu
                  </p>
                  <a
                    href="https://maps.google.com/?q=Chappal+Karkhana+Kathmandu+Nepal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Location Details */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-card rounded-2xl p-6 border border-border/50">
<h3 className="font-bold text-foreground mb-4">Address</h3>
                <p className="text-muted-foreground">
                  Kundalini Dental Clinic<br />
                  Goreto Bhawan, Chappal Karkhana<br />
                  Kathmandu, Nepal
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-bold text-foreground mb-4">Getting Here</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">From Airport:</strong> 25-minute 
                    drive from Tribhuvan International Airport. Taxi fare approximately $5-8 USD.
                  </p>
                  <p>
                    <strong className="text-foreground">From Thamel:</strong> 10-minute 
                    walk or short taxi ride from the popular tourist area.
                  </p>
                  <p>
                    <strong className="text-foreground">Landmarks:</strong> Near Hotel 
                    Annapurna and the Royal Palace Museum.
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-bold text-foreground mb-4">Airport Pickup</h3>
                <p className="text-muted-foreground text-sm">
                  For international patients, we offer complimentary airport pickup 
                  for treatments over $1,000. Just let us know your flight details!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-primary">
        <div className="container-wide mx-auto text-center">
          <motion.div {...fadeInUp}>
            <Smartphone className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Smile?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Take the first step today. Our friendly team is ready to answer your 
              questions and help you begin your journey to a healthier, more 
              confident smile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
<a
                href="https://wa.me/9779802808008"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us Now
              </a>
              <a
                href="#booking-form"
                className="inline-flex items-center justify-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                Fill Out Form
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
