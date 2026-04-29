import { Link, useLocation, Navigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

// Known top-level routes for fuzzy matching
const KNOWN_ROUTES = [
  "/", "/services", "/about", "/doctors", "/dental-tourism",
  "/pricing", "/reviews", "/contact", "/privacy", "/terms",
  "/refund", "/faq",
];

// Pattern-based redirects: keyword in path -> destination
const REDIRECT_PATTERNS: Array<{ test: RegExp; to: string }> = [
  // Services / treatments
  { test: /(service|treatment|procedure)/i, to: "/services" },
  { test: /(implant|crown|bridge|veneer|root[-\s]?canal|whitening|braces|aligner|invisalign|orthodont|cosmetic|cleaning|scaling|extraction|denture|filling|cavity|gum|periodont|pediatric|kids|smile|surger)/i, to: "/services" },

  // Doctors / team
  { test: /(doctor|dentist|team|staff|specialist|surgeon|md|profile)/i, to: "/doctors" },

  // About
  { test: /(about|story|mission|vision|history|clinic)/i, to: "/about" },

  // Tourism
  { test: /(tourism|tourist|travel|international|abroad|foreigner|visit|package)/i, to: "/dental-tourism" },

  // Pricing
  { test: /(pricing|price|cost|fee|charge|rate|payment|insurance)/i, to: "/pricing" },

  // Reviews / testimonials
  { test: /(review|testimonial|feedback|rating|story|patient[-\s]?story)/i, to: "/reviews" },

  // Contact / appointment / booking
  { test: /(contact|appointment|book|schedule|consult|call|location|address|map|direction|reach)/i, to: "/contact" },

  // FAQ
  { test: /(faq|question|help|support)/i, to: "/faq" },

  // Legal
  { test: /(privacy|gdpr|data[-\s]?protection)/i, to: "/privacy" },
  { test: /(terms|tos|conditions|agreement)/i, to: "/terms" },
  { test: /(refund|return|cancel)/i, to: "/refund" },

  // Blog -> reviews/news fallback
  { test: /(blog|news|article|post)/i, to: "/" },

  // Home
  { test: /(home|index|main|landing)/i, to: "/" },
];

function findRedirect(pathname: string): string | null {
  // Skip admin & asset paths
  if (pathname.startsWith("/admin")) return null;
  if (/\.(xml|json|txt|ico|png|jpg|jpeg|svg|webp|css|js|map|pdf)$/i.test(pathname)) return null;

  // Strip trailing slashes and normalize
  const cleaned = pathname.replace(/\/+$/g, "").toLowerCase();
  if (!cleaned) return null;

  // Exact match without trailing slash
  if (KNOWN_ROUTES.includes(cleaned) && cleaned !== pathname) return cleaned;

  // If first segment looks like a service slug, route to service detail
  const segments = cleaned.split("/").filter(Boolean);
  if (segments.length >= 2 && segments[0] === "services") {
    return `/services/${segments[1]}`;
  }

  // Pattern matching across full path
  for (const { test, to } of REDIRECT_PATTERNS) {
    if (test.test(cleaned)) return to;
  }

  return null;
}

const NotFound = () => {
  const location = useLocation();

  const redirectTo = useMemo(
    () => findRedirect(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    if (redirectTo) {
      console.info(
        `404 redirect: ${location.pathname} -> ${redirectTo}`
      );
    } else {
      console.error(
        "404 Error: No redirect match for:",
        location.pathname
      );
    }
  }, [location.pathname, redirectTo]);

  if (redirectTo && redirectTo !== location.pathname) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="text-8xl sm:text-9xl font-bold text-primary/20 select-none">
              404
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Sorry, the page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/services" className="text-primary hover:underline">
                Our Services
              </Link>
              <Link to="/dental-tourism" className="text-primary hover:underline">
                Dental Tourism
              </Link>
              <Link to="/pricing" className="text-primary hover:underline">
                Pricing
              </Link>
              <Link to="/doctors" className="text-primary hover:underline">
                Our Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
