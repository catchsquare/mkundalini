import { Layout } from "@/components/layout/Layout";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { ScrollText } from "lucide-react";

export default function TermsPage() {
  const { settings } = useGlobalSettings();
  const lastUpdated = "October 1, 2025";

  return (
    <Layout>
      <title>Terms of Service | {settings.clinic_name}</title>
      <meta
        name="description"
        content={`Terms and conditions governing the use of ${settings.clinic_name} services, website, and treatments.`}
      />

      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <ScrollText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using our website or booking treatment with us.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing our website, booking an appointment, or receiving treatment at {settings.clinic_name},
              you agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">2. Services Provided</h2>
            <p className="text-muted-foreground leading-relaxed">
              We provide dental and oral healthcare services including consultations, preventive care, restorative
              treatments, cosmetic dentistry, orthodontics, implants, and dental tourism coordination. All
              treatments are performed by licensed dental professionals.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">3. Appointments & Cancellations</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>Appointments can be booked online, by phone, or in person.</li>
              <li>We require at least 24 hours' notice for cancellations or rescheduling.</li>
              <li>Late arrivals may result in a shortened appointment or rescheduling.</li>
              <li>Repeated no-shows may require a non-refundable deposit for future bookings.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">4. Treatment Consent</h2>
            <p className="text-muted-foreground leading-relaxed">
              All major treatments require informed written consent. Our clinicians will explain the procedure,
              risks, alternatives, and expected outcomes before obtaining your consent. You may withdraw consent
              at any time before treatment begins.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">5. Pricing & Payment</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>Prices listed online are starting estimates and may vary based on individual diagnosis.</li>
              <li>A formal treatment plan with final pricing is provided after consultation.</li>
              <li>We accept cash, card, bank transfer, and major digital payment methods.</li>
              <li>For multi-stage treatments, payment may be split into agreed milestones.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">6. Dental Tourism Patients</h2>
            <p className="text-muted-foreground leading-relaxed">
              International patients are responsible for their own travel, visa, and accommodation arrangements
              unless explicitly included in a tourism package. Treatment timelines provided are estimates and may
              change based on clinical findings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">7. Website Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              Content on this website is for informational purposes only and is not a substitute for professional
              dental advice, diagnosis, or treatment. Always consult a qualified dentist for personalised advice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to deliver the highest standard of care, but treatment outcomes may vary based on individual
              biology, compliance with aftercare, and underlying conditions. Our liability is limited to the cost of
              the specific treatment provided.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">9. Changes to These Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms of Service from time to time. Material changes will be posted on this page
              with an updated revision date.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these terms? Reach us at{" "}
              <a href={`mailto:${settings.email}`} className="text-primary hover:underline">{settings.email}</a> or
              call <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="text-primary hover:underline">{settings.phone}</a>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
