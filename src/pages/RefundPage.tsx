import { Layout } from "@/components/layout/Layout";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function RefundPage() {
  const { settings } = useGlobalSettings();
  const lastUpdated = "October 1, 2025";

  return (
    <Layout>
      <title>Refund Policy | {settings.clinic_name}</title>
      <meta
        name="description"
        content={`${settings.clinic_name} refund and cancellation policy for dental treatments, deposits, and tourism packages.`}
      />

      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Refund Policy
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Clear, fair guidelines on cancellations, deposits, and refunds for treatments and tourism packages.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" /> 1. Consultation Fees
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Initial consultation fees are non-refundable once the consultation has taken place. If you cancel at
              least 24 hours in advance, the fee can be applied as credit toward a future appointment within 90 days.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> 2. Treatment Deposits
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>Deposits secure your treatment slot, lab work, and materials.</li>
              <li>Cancellations more than 14 days before treatment: 80% refund of deposit.</li>
              <li>Cancellations 7–14 days before treatment: 50% refund.</li>
              <li>Cancellations within 7 days of treatment: deposit is non-refundable as lab work and materials have already been ordered.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">3. Completed Treatments</h2>
            <p className="text-muted-foreground leading-relaxed">
              Payments for completed dental procedures are non-refundable. If you experience any clinical issue with
              your treatment, please contact us immediately — we offer complimentary review appointments and stand
              behind the quality of our work with applicable warranties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">4. Multi-Stage Treatments</h2>
            <p className="text-muted-foreground leading-relaxed">
              For treatments paid in stages (e.g. orthodontics, full-mouth rehabilitation, implants), refunds for
              incomplete stages are calculated based on the work already performed and any lab/material costs
              incurred. A detailed breakdown will be provided.
            </p>
          </div>

          <div>
            <h2 className="text-2xl function-bold font-bold text-foreground mb-3">5. Dental Tourism Packages</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dental tourism deposits cover treatment planning, slot reservation, and coordination services. Refund
              eligibility:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed mt-3">
              <li>More than 30 days before arrival: 90% refund</li>
              <li>15–30 days before arrival: 50% refund</li>
              <li>Less than 15 days: non-refundable, but may be transferred to a new date within 6 months</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-primary" /> 6. Non-Refundable Items
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>Custom lab work (crowns, veneers, aligners, dentures) once production has begun</li>
              <li>Imaging and diagnostic reports already issued</li>
              <li>Third-party charges (travel, accommodation, visa fees)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">7. How to Request a Refund</h2>
            <p className="text-muted-foreground leading-relaxed">
              To request a refund, please email{" "}
              <a href={`mailto:${settings.email}`} className="text-primary hover:underline">{settings.email}</a> with
              your name, treatment date, and reason for the request. Approved refunds are processed within 7–14
              business days using the original payment method.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">8. Disputes</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to resolving any concerns fairly and quickly. Please contact us first so we can work
              together toward a resolution before pursuing other options.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
