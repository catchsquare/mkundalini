import { Layout } from "@/components/layout/Layout";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  const { settings } = useGlobalSettings();
  const lastUpdated = "October 1, 2025";

  return (
    <Layout>
      <title>Privacy Policy | {settings.clinic_name}</title>
      <meta
        name="description"
        content={`How ${settings.clinic_name} collects, uses, and protects your personal and health information. Read our full privacy policy.`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your trust matters to us. This policy explains how we collect, use, and protect your personal and medical information.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> 1. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us when you book an appointment, request a consultation,
              fill out a contact form, or visit our clinic. This may include your name, phone number, email address,
              age, medical and dental history, and any details you share about your treatment needs.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" /> 2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>Provide and improve dental care, treatment planning, and follow-up</li>
              <li>Schedule, confirm, and remind you of appointments</li>
              <li>Respond to your enquiries, consultations, and dental tourism requests</li>
              <li>Maintain accurate medical and billing records as required by law</li>
              <li>Send important updates, offers, or oral-health information (only if you opt in)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> 3. How We Protect Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All patient records are stored on secure, access-controlled systems. Only authorised clinical and
              administrative staff can view your data. Digital records are encrypted in transit and at rest, and
              physical files are kept in restricted areas of the clinic.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">4. Sharing of Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, rent, or trade your personal information. We may share limited information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed mt-3">
              <li>Specialists or laboratories directly involved in your treatment</li>
              <li>Insurance providers (only with your consent)</li>
              <li>Government or regulatory bodies when legally required</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">5. Cookies & Website Analytics</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website uses essential cookies to function properly and analytics tools to understand how visitors
              use the site. You can disable cookies in your browser settings at any time. We do not use cookies to
              identify you personally.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">6. Patient Photos & Testimonials</h2>
            <p className="text-muted-foreground leading-relaxed">
              Before-and-after photos, video testimonials, and reviews are only published with your explicit written
              consent. You can withdraw consent at any time by contacting us.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">7. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>Request access to the personal information we hold about you</li>
              <li>Ask us to correct or update inaccurate information</li>
              <li>Request deletion of your records (subject to legal retention requirements)</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or how your data is handled, please contact us at{" "}
              <a href={`mailto:${settings.email}`} className="text-primary hover:underline">{settings.email}</a> or
              call <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="text-primary hover:underline">{settings.phone}</a>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
