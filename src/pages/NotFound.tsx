import { Link, useLocation, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { SEO } from "@/components/seo/SEO";
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

/**
 * Explicit legacy aliases only. No fuzzy/keyword matching: unknown URLs must
 * render a genuine 404 (noindex, follow) instead of redirecting to a
 * loosely related page (soft 404).
 * NOTE: static hosting serves HTTP 200 for every path, so these are
 * client-side redirects, not server 301s.
 */
function findRedirect(pathname: string): string | null {
  if (pathname.startsWith("/admin")) return null;
  const cleaned = pathname.replace(/\/+$/g, "").toLowerCase();
  if (!cleaned) return null;

  // Trailing slash / case variants of known routes
  if (KNOWN_ROUTES.includes(cleaned) && cleaned !== pathname) return cleaned;

  const segments = cleaned.split("/").filter(Boolean);
  if (segments.length === 2 && segments[0] === "services") {
    const s = segments[1];
    if (VALID_SERVICE_SLUGS.has(s)) return cleaned !== pathname ? `/services/${s}` : null;
    if (SERVICE_SLUG_ALIASES[s]) return `/services/${SERVICE_SLUG_ALIASES[s]}`;
  }
  if (segments.length === 2 && segments[0] === "doctors" && cleaned !== pathname) {
    return cleaned;
  }
  return null;
}

const NotFound = () => {
  const location = useLocation();

  const redirectTo = useMemo(
    () => findRedirect(location.pathname),
    [location.pathname]
  );

  if (redirectTo && redirectTo !== location.pathname) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Layout>
      <SEO
        title="Page Not Found"
        description="The page you requested could not be found."
        path={location.pathname}
        noindex
      />
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
              <Link to="/services">Our Services</Link>
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
