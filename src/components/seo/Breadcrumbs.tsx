import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "./SEO";

export interface Crumb {
  label: string;
  href?: string; // omit for current page
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Accessible breadcrumb trail with BreadcrumbList JSON-LD for SEO.
 * Always prepends "Home" → /.
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className={`bg-muted/30 border-b border-border/50 ${className}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
            {trail.map((c, i) => {
              const isLast = i === trail.length - 1;
              return (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />}
                  {isLast || !c.href ? (
                    <span className="text-foreground font-medium truncate" aria-current="page">
                      {c.label}
                    </span>
                  ) : (
                    <Link
                      to={c.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {c.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
