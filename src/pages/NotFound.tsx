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

// Valid service slugs (keep in sync with DB)
const VALID_SERVICE_SLUGS = new Set([
  "all-on-4", "bonding", "bone-grafting", "braces", "cleaning",
  "clear-aligners", "crowns-bridges", "extractions", "fillings",
  "full-mouth", "gum-surgery", "retainers", "root-canal",
  "single-implants", "smile-makeover", "veneers", "whitening",
  "wisdom-teeth",
]);

// Legacy / alternate service slug aliases -> current valid slug
const SERVICE_SLUG_ALIASES: Record<string, string> = {
  "dental-implants": "single-implants",
  "implants": "single-implants",
  "tooth-implant": "single-implants",
  "implant": "single-implants",
  "all-on-four": "all-on-4",
  "all-on-6": "all-on-4",
  "full-mouth-implants": "full-mouth",
  "full-mouth-rehabilitation": "full-mouth",
  "full-mouth-reconstruction": "full-mouth",
  "crowns": "crowns-bridges",
  "bridges": "crowns-bridges",
  "dental-crowns": "crowns-bridges",
  "dental-bridges": "crowns-bridges",
  "cap": "crowns-bridges",
  "rct": "root-canal",
  "root-canal-treatment": "root-canal",
  "endodontics": "root-canal",
  "teeth-whitening": "whitening",
  "bleaching": "whitening",
  "dental-veneers": "veneers",
  "porcelain-veneers": "veneers",
  "invisalign": "clear-aligners",
  "aligners": "clear-aligners",
  "orthodontics": "braces",
  "orthodontic": "braces",
  "metal-braces": "braces",
  "ceramic-braces": "braces",
  "scaling": "cleaning",
  "scaling-polishing": "cleaning",
  "teeth-cleaning": "cleaning",
  "prophylaxis": "cleaning",
  "extraction": "extractions",
  "tooth-extraction": "extractions",
  "wisdom-tooth": "wisdom-teeth",
  "wisdom-tooth-removal": "wisdom-teeth",
  "third-molar": "wisdom-teeth",
  "filling": "fillings",
  "tooth-filling": "fillings",
  "composite-filling": "fillings",
  "cavity": "fillings",
  "gum-treatment": "gum-surgery",
  "periodontics": "gum-surgery",
  "periodontal": "gum-surgery",
  "gingivectomy": "gum-surgery",
  "smile-design": "smile-makeover",
  "cosmetic-dentistry": "smile-makeover",
  "dental-bonding": "bonding",
  "tooth-bonding": "bonding",
  "bone-graft": "bone-grafting",
  "sinus-lift": "bone-grafting",
  "retainer": "retainers",
  "dentures": "smile-makeover",
  "denture": "smile-makeover",
  "pediatric": "cleaning",
  "kids-dentistry": "cleaning",
  "childrens-dentistry": "cleaning",
};

function resolveServiceSlug(slug: string): string | null {
  const s = slug.toLowerCase().trim();
  if (VALID_SERVICE_SLUGS.has(s)) return s;
  if (SERVICE_SLUG_ALIASES[s]) return SERVICE_SLUG_ALIASES[s];
  // Fuzzy: try matching against known slugs
  for (const valid of VALID_SERVICE_SLUGS) {
    if (s.includes(valid) || valid.includes(s)) return valid;
  }
  for (const [alias, target] of Object.entries(SERVICE_SLUG_ALIASES)) {
    if (s.includes(alias) || alias.includes(s)) return target;
  }
  return null;
}

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

  // If first segment looks like a service slug, resolve to a real service or /services
  const segments = cleaned.split("/").filter(Boolean);
  if (segments.length >= 2 && segments[0] === "services") {
    const resolved = resolveServiceSlug(segments[1]);
    return resolved ? `/services/${resolved}` : "/services";
  }
  // Bare slug at root that matches a service alias
  if (segments.length === 1) {
    const resolved = resolveServiceSlug(segments[0]);
    if (resolved) return `/services/${resolved}`;
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
