import { Layout } from "@/components/layout/Layout";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { useLegalPage } from "@/hooks/use-legal-page";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

export default function RefundPage() {
  const { settings } = useGlobalSettings();
  const { page, loading } = useLegalPage("refund");

  const title = page?.title || "Refund Policy";
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
          `${settings.clinic_name} refund and cancellation policy for dental treatments, deposits, and tourism packages.`
        }
      />

      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Clear, fair guidelines on cancellations, deposits, and refunds for treatments and tourism packages.
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
              dangerouslySetInnerHTML={{ __html: page?.content || "" }}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
