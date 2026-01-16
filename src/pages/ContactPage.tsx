import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Durbar Marg, Kathmandu", "Nepal 44600"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+977 1-234-5678", "+977 98-1234-5678 (WhatsApp)"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@kundalinidental.com", "tourism@kundalinidental.com"],
  },
  {
    icon: Clock,
    title: "Opening Hours",
    details: ["Sun - Fri: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              Contact Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-2 mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ready to start your smile transformation? Have questions about our 
              services or dental tourism packages? We're here to help. Reach out 
              and our team will respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="card-elevated p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        required
                      />
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
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country
                      </label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="appointment">Book an Appointment</option>
                      <option value="tourism">Dental Tourism Inquiry</option>
                      <option value="consultation">Free Virtual Consultation</option>
                      <option value="quote">Request a Quote</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your dental needs or questions..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {contactInfo.map((item) => (
                <div key={item.title} className="card-elevated p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      {item.details.map((detail) => (
                        <p key={detail} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Contact */}
              <div className="card-elevated p-6 bg-primary text-primary-foreground">
                <h3 className="font-semibold mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/9771234567890"
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Us
                  </a>
                  <a
                    href="tel:+9771234567890"
                    className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                  <a
                    href="mailto:info@kundalinidental.com"
                    className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                  >
                    <Mail className="w-5 h-5" />
                    Email Us
                  </a>
                </div>
              </div>

              {/* For International Patients */}
              <div className="card-elevated p-6 border-2 border-accent">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">
                    International Patients
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Planning dental tourism? Email us your X-rays and photos for a 
                  free virtual consultation and personalized treatment quote.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96 bg-muted">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Durbar Marg, Kathmandu, Nepal
            </p>
            <a
              href="https://maps.google.com/?q=Durbar+Marg+Kathmandu+Nepal"
              target="_blank"
              rel="noopener"
              className="text-primary text-sm hover:underline"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}