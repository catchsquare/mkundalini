import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, ArrowRight, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import logoFallback from "@/assets/logo.png";
import { CLINIC } from "@/lib/clinic-info";

const navigation = {
  services: [
    { name: "Dental Implants", href: "/services/single-implants" },
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
    { name: "Book Appointment", href: "/book" },
    { name: "Treatment Pricing", href: "/pricing" },
    { name: "FAQs", href: "/faq" },
  ],
};

export function Footer() {
  const { settings } = useGlobalSettings();
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* CTA Section */}
      <div className="border-b border-secondary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-foreground mb-2">
                Ready to Transform Your Smile?
              </h3>
              <p className="text-secondary-foreground/70 max-w-xl text-sm sm:text-base">
                Whether you're across town or across the world, we're here to help. 
                Book an appointment today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center lg:justify-end">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base">
                <Link to="/book">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground h-12 text-base">
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 justify-center sm:justify-start">
              <img
                src={settings.logo_url || settings.site_logo || logoFallback}
                alt={settings.clinic_name || "Kundalini Dental Clinic"}
                className="h-12 sm:h-14 w-auto object-contain"
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed max-w-sm text-center sm:text-left">
              {`Dental clinic in Chappal Karkhana, Kathmandu, established in ${settings.established_year}. Led by ${settings.managing_director}, practising dentistry since 2012, with visiting specialists in orthodontics and oral surgery. Patients from Nepal and abroad welcome.`}
            </p>
            
            {/* Contact Quick Links */}
            <div className="space-y-2.5">
              {settings.whatsapp_enabled && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^+\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary transition-colors justify-center sm:justify-start min-h-[44px] sm:min-h-0"
                >
                  <MessageCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  WhatsApp: {settings.phone}
                </a>
              )}
              <a
                href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary transition-colors justify-center sm:justify-start min-h-[44px] sm:min-h-0"
              >
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary transition-colors justify-center sm:justify-start min-h-[44px] sm:min-h-0 break-all sm:break-normal"
              >
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm">{settings.email}</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2 justify-center sm:justify-start">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 sm:h-4 sm:w-4" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 sm:h-4 sm:w-4" />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 sm:h-4 sm:w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-secondary-foreground mb-4 sm:mb-5">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors inline-block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-secondary-foreground mb-4 sm:mb-5">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors inline-block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Patients */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-secondary-foreground mb-4 sm:mb-5">For Patients</h3>
            <ul className="space-y-2 sm:space-y-3">
              {navigation.forPatients.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors inline-block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Clinic Hours */}
            <div className="mt-6 sm:mt-8">
              <h4 className="font-medium text-secondary-foreground mb-3 flex items-center gap-2 justify-center sm:justify-start">
                <Clock className="h-4 w-4 text-primary" />
                Clinic Hours
              </h4>
              <div className="text-sm text-secondary-foreground/70 space-y-1">
                <p>{settings.weekday_hours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-secondary-foreground/50">
              © {new Date().getFullYear()} {settings.clinic_name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-secondary-foreground/60">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <span className="text-secondary-foreground/20">·</span>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <span className="text-secondary-foreground/20">·</span>
              <Link to="/refund" className="hover:text-primary transition-colors">Refund</Link>
              <span className="text-secondary-foreground/20">·</span>
              <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-foreground/50">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              <a href={CLINIC.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                {settings.address}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}