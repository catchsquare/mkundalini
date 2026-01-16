import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background shadow-md border-b border-border/50" 
          : "bg-background"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-18 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-primary-foreground font-bold text-lg sm:text-xl">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg leading-tight text-foreground">
              Kundalini
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground -mt-0.5">
              Dental Clinic
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-5 xl:gap-x-7">
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
        <div className="hidden lg:flex lg:items-center lg:gap-2 xl:gap-3">
          <a
            href="tel:+9779802808008"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-2 py-2"
            aria-label="Call us"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">+977-9802808008</span>
          </a>
          <Button asChild variant="outline" size="sm">
            <Link to="/dental-tourism">
              <Globe className="h-4 w-4 mr-1.5" />
              <span className="hidden xl:inline">International</span>
              <span className="xl:hidden">Intl</span>
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/contact">Book Appointment</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2.5 -mr-2 text-foreground rounded-lg hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu - Full screen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 top-16 sm:top-18 bg-black/20 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            
            {/* Menu Panel */}
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed left-0 right-0 top-16 sm:top-18 bg-background border-b border-border shadow-lg z-50 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-4.5rem)] overflow-y-auto"
            >
              <div className="px-4 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`block text-base font-medium transition-colors py-3.5 px-4 rounded-lg min-h-[48px] flex items-center ${
                      location.pathname === item.href
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:bg-muted active:bg-muted/80"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Divider and CTAs */}
                <div className="pt-4 mt-4 border-t border-border space-y-3">
                  <Button asChild variant="outline" className="w-full h-12 text-base">
                    <Link to="/dental-tourism" onClick={closeMobileMenu}>
                      <Globe className="h-5 w-5 mr-2" />
                      International Patients
                    </Link>
                  </Button>
                  <Button asChild className="w-full h-12 text-base">
                    <Link to="/contact" onClick={closeMobileMenu}>
                      Book Appointment
                    </Link>
                  </Button>
                  <a
                    href="tel:+9779802808008"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-3 min-h-[48px]"
                    onClick={closeMobileMenu}
                  >
                    <Phone className="h-4 w-4" />
                    <span>+977-9802808008</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}