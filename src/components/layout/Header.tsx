import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X, Phone, Globe, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/hooks/use-navigation";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { useServicesByCategory } from "@/hooks/use-services";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { navigation } = useNavigation();
  const { settings } = useGlobalSettings();
  const { data: serviceCategories, isLoading: servicesLoading } = useServicesByCategory();

  const servicesNavItems = ["Services", "services"];
  const isServicesLink = (label: string, url: string | null) =>
    servicesNavItems.some(s => label.toLowerCase() === s || url === "/services");

  const openMegaMenu = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(true);
  };
  const closeMegaMenu = () => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 200);
  };
  const cancelCloseMegaMenu = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
  };

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
    setMegaMenuOpen(false);
    setMobileServicesOpen(false);
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
        <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <AnimatedLogo size="sm" showGlow={false} animate={false} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-6 xl:gap-x-8">
          {navigation.header.map((item) => {
            if (isServicesLink(item.label, item.url)) {
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={openMegaMenu}
                  onMouseLeave={closeMegaMenu}
                  ref={megaMenuRef}
                >
                  <Link
                    to={item.url || "/services"}
                    className={`text-sm font-medium transition-colors hover:text-primary relative py-2 whitespace-nowrap inline-flex items-center gap-1 ${
                      location.pathname.startsWith("/services")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
                    {location.pathname.startsWith("/services") && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {megaMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50"
                        onMouseEnter={cancelCloseMegaMenu}
                        onMouseLeave={closeMegaMenu}
                      >
                        <div className="bg-popover border border-border rounded-xl shadow-xl w-[680px] p-6 grid grid-cols-3 gap-6">
                          {serviceCategories && serviceCategories.length > 0 ? (
                            serviceCategories.map((cat) => (
                              <div key={cat.id}>
                                <Link
                                  to={`/services#${cat.slug}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors mb-2 block"
                                >
                                  {cat.name}
                                </Link>
                                {cat.description && (
                                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{cat.description}</p>
                                )}
                                <ul className="space-y-1">
                                  {cat.treatments.filter(t => t.is_active).slice(0, 5).map((treatment) => (
                                    <li key={treatment.id}>
                                      <Link
                                        to={`/services/${treatment.slug}`}
                                        onClick={() => setMegaMenuOpen(false)}
                                        className="text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors block py-1 px-2 rounded-md"
                                      >
                                        {treatment.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))
                          ) : servicesLoading ? (
                            <div className="col-span-3 text-center py-4 text-sm text-muted-foreground">Loading...</div>
                          ) : (
                            <div className="col-span-3 text-center py-4 text-sm text-muted-foreground">No services available</div>
                          )}
                          <div className="col-span-3 border-t border-border pt-3">
                            <Link
                              to="/services"
                              onClick={() => setMegaMenuOpen(false)}
                              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                            >
                              View All Services <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
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
            );
          })}
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
                {navigation.header.map((item) => {
                  if (isServicesLink(item.label, item.url)) {
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className={`w-full text-left text-base font-medium transition-colors py-3.5 px-4 rounded-lg min-h-[48px] flex items-center justify-between ${
                            location.pathname.startsWith("/services")
                              ? "text-primary bg-primary/5"
                              : "text-foreground hover:bg-muted active:bg-muted/80"
                          }`}
                        >
                          {item.label}
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 py-2 space-y-1">
                                <Link
                                  to="/services"
                                  onClick={closeMobileMenu}
                                  className="block text-sm font-medium text-primary py-2 px-4 rounded-md hover:bg-muted/50"
                                >
                                  All Services
                                </Link>
                                {serviceCategories?.map((cat) => (
                                  <div key={cat.id} className="py-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1">
                                      {cat.name}
                                    </p>
                                    {cat.treatments.filter(t => t.is_active).map((treatment) => (
                                      <Link
                                        key={treatment.id}
                                        to={`/services/${treatment.slug}`}
                                        onClick={closeMobileMenu}
                                        className="block text-sm text-foreground hover:text-primary hover:bg-muted/50 py-2 px-6 rounded-md transition-colors"
                                      >
                                        {treatment.title}
                                      </Link>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
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
                  );
                })}
                
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
