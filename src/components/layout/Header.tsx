import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/hooks/use-navigation";
import { useGlobalSettings } from "@/hooks/use-global-settings";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { navigation } = useNavigation();
  const { settings } = useGlobalSettings();

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
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background shadow-md border-b border-border/50" 
          : "bg-background"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
          {settings.site_logo ? (
            <img 
              src={settings.site_logo} 
              alt={settings.clinic_name || "Kundalini Dental Clinic"}
              className="h-9 sm:h-10 lg:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <>
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
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
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-6 xl:gap-x-8">
          {navigation.header.map((item) => (
            <Link
              key={item.id}
              to={item.url || "/"}
              target={item.target === "_blank" ? "_blank" : undefined}
              className={`text-sm font-medium transition-colors hover:text-primary relative py-2 whitespace-nowrap ${
                location.pathname === item.url
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
              {location.pathname === item.url && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex lg:items-center lg:gap-3 flex-shrink-0">
          <Button asChild variant="outline" size="sm" className="whitespace-nowrap">
            <Link to="/dental-tourism">
              <Globe className="h-4 w-4 mr-1.5 flex-shrink-0" />
              International
            </Link>
          </Button>
          <Button asChild size="sm" className="whitespace-nowrap">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              style={{ top: '64px' }}
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
              className="lg:hidden absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg z-50 max-h-[calc(100vh-8rem)] overflow-y-auto"
            >
              <div className="px-4 py-4 space-y-1">
                {navigation.header.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url || "/"}
                    target={item.target === "_blank" ? "_blank" : undefined}
                    onClick={closeMobileMenu}
                    className={`block text-base font-medium transition-colors py-3.5 px-4 rounded-lg min-h-[48px] flex items-center ${
                      location.pathname === item.url
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:bg-muted active:bg-muted/80"
                    }`}
                  >
                    {item.label}
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
                    href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                    className="flex items-center justify-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors py-3 min-h-[48px] bg-primary/5 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call: {settings.phone}</span>
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