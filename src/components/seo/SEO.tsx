import { Helmet } from "react-helmet-async";

const SITE_URL = "https://kundalinidentalclinic.com.np";

interface SEOProps {
  title: string;
  description?: string;
  path?: string; // e.g. "/about" — canonical & og:url derived from this
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function SEO({
  title,
  description,
  path = "",
  image,
  type = "website",
  noindex = false,
  jsonLd,
}: SEOProps) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes("Kundalini")
    ? title
    : `${title} | Kundalini Dental Clinic`;

  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
      {!noindex && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="Kundalini Dental Clinic" />

      {/* Twitter */}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export { SITE_URL };
