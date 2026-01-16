import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Doctors", href: "/doctors" },
  { name: "About", href: "/about" },
  { name: "Dental Tourism", href: "/dental-tourism" },
  { name: "Pricing", href: "/pricing" },
  { name: "Reviews", href: "/reviews" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/98 backdrop-blur-lg shadow-sm border-b border-border/50" 
          : "bg-background/95 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-primary-foreground font-bold text-xl">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight text-foreground">
              Kundalini
            </span>
            <span className="text-xs text-muted-foreground -mt-0.5">
              Dental Clinic
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-7">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary relative py-2 ${
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
              {location.pathname === item.href && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <a
            href="tel:+9771234567890"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2"
            aria-label="Call us"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">+977 1-234-5678</span>
          </a>
          <Button asChild variant="outline" size="sm">
            <Link to="/dental-tourism">
              <Globe className="h-4 w-4 mr-1.5" />
              International
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/contact">Book Appointment</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2.5 text-foreground rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block text-base font-medium transition-colors py-3 px-4 rounded-lg ${
                    location.pathname === item.href
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-border space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dental-tourism">
                    <Globe className="h-4 w-4 mr-2" />
                    International Patients
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/contact">
                    Book Appointment
                  </Link>
                </Button>
                <a
                  href="tel:+9771234567890"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-3"
                >
                  <Phone className="h-4 w-4" />
                  <span>+977 1-234-5678</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}