import { Layout } from "@/components/layout/Layout";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { useLegalPage } from "@/hooks/use-legal-page";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollText } from "lucide-react";

export default function TermsPage() {
  const { settings } = useGlobalSettings();
  const { page, loading } = useLegalPage("terms");

  const title = page?.title || "Terms of Service";
  const lastUpdated = page?.last_updated
    ? new Date(page.last_updated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "October 1, 2025";

  return (
    <Layout>
      <title>{`${page?.seo_title || title} | ${settings.clinic_name}`}</title>
      <meta
        name="description"
        content={
          page?.seo_description ||
          `Terms and conditions governing the use of ${settings.clinic_name} services, website, and treatments.`
        }
      />

      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <ScrollText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using our website or booking treatment with us.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <article
              className="rich-content prose prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(page?.content || "") }}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
