import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, ArrowRight, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = {
  services: [
    { name: "Dental Implants", href: "/services/dental-implants" },
    { name: "Cosmetic Dentistry", href: "/services#cosmetic" },
    { name: "Orthodontics", href: "/services#orthodontics" },
    { name: "Root Canal Treatment", href: "/services#general" },
    { name: "View All Services", href: "/services" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Doctors", href: "/doctors" },
    { name: "Patient Reviews", href: "/reviews" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ],
  forPatients: [
    { name: "Dental Tourism Guide", href: "/dental-tourism" },
    { name: "Book Appointment", href: "/contact" },
    { name: "Treatment Pricing", href: "/pricing" },
    { name: "FAQs", href: "/dental-tourism#faqs" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* CTA Section */}
      <div className="border-b border-secondary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-secondary-foreground mb-2">
                Ready to Transform Your Smile?
              </h3>
              <p className="text-secondary-foreground/70 max-w-xl">
                Whether you're across town or across the world, we're here to help. 
                Book your free consultation today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/contact">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground">
                <Link to="/dental-tourism">
                  <Globe className="mr-2 h-4 w-4" />
                  International Patients
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">K</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-secondary-foreground">
                  Kundalini
                </span>
                <span className="text-xs text-secondary-foreground/70 -mt-0.5">
                  Dental Clinic
                </span>
              </div>
            </Link>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed max-w-sm">
              World-class dental care in the heart of Kathmandu. Serving local and 
              international patients with premium treatments at accessible prices 
              since 2009.
            </p>
            
            {/* Contact Quick Links */}
            <div className="space-y-3">
              <a
                href="https://wa.me/9779812345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                WhatsApp: +977 98-1234-5678
              </a>
              <a
                href="tel:+9771234567890"
                className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                +977 1-234-5678
              </a>
              <a
                href="mailto:info@kundalinidental.com"
                className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                info@kundalinidental.com
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com/kundalinidental"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/kundalinidental"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/company/kundalinidental"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-secondary-foreground mb-5">Services</h3>
            <ul className="space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-secondary-foreground mb-5">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Patients */}
          <div>
            <h3 className="font-semibold text-secondary-foreground mb-5">For Patients</h3>
            <ul className="space-y-3">
              {navigation.forPatients.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Clinic Hours */}
            <div className="mt-8">
              <h4 className="font-medium text-secondary-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Clinic Hours
              </h4>
              <div className="text-sm text-secondary-foreground/70 space-y-1">
                <p>Sun - Fri: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/50">
              © {new Date().getFullYear()} Kundalini Dental Clinic. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-secondary-foreground/50">
              <MapPin className="h-3.5 w-3.5" />
              <span>Durbar Marg, Kathmandu, Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}