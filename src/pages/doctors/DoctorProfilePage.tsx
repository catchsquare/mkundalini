import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Phone, Stethoscope } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { CLINIC, SITE_URL, VERIFIED_DOCTORS } from "@/lib/clinic-info";
import NotFound from "@/pages/NotFound";

/**
 * Doctor profile — renders VERIFIED information only (see src/lib/clinic-info.ts).
 * Do not add university, specialty, training, memberships or awards until verified.
 */
export default function DoctorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const doctor = VERIFIED_DOCTORS.find((d) => d.slug === slug);
  const [photo, setPhoto] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    if (!doctor) return;
    supabase
      .from("team_members")
      .select("photo_url, photo_alt")
      .eq("full_name", doctor.name)
      .eq("status", "published")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.photo_url) setPhoto({ url: data.photo_url, alt: data.photo_alt || doctor.name });
      });
  }, [doctor]);

  if (!doctor) return <NotFound />;

  const path = `/doctors/${doctor.slug}`;
  const credentialLine = [doctor.qualification, doctor.nmcNumber && `NMC Registration No. ${doctor.nmcNumber}`]
    .filter(Boolean)
    .join(" · ");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}${path}#person`,
    name: doctor.name,
    url: `${SITE_URL}${path}`,
    jobTitle: "Dentist",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: doctor.qualification,
    },
    ...(doctor.nmcNumber && {
      identifier: { "@type": "PropertyValue", name: "Nepal Medical Council Registration", value: doctor.nmcNumber },
    }),
    worksFor: { "@id": `${SITE_URL}/#dentist` },
  };

  return (
    <Layout>
      <SEO
        title={`${doctor.name}, ${doctor.qualification} – Dentist in Kathmandu`}
        description={`${doctor.name}, ${credentialLine}, practising dentistry since ${doctor.practisingSince}, at ${CLINIC.name}, Kathmandu.`}
        path={path}
        jsonLd={personSchema}
      />
      <Breadcrumbs items={[{ label: "Doctors", href: "/doctors" }, { label: doctor.name }]} />
      <main className="section-padding bg-background">
        <article className="container-wide mx-auto max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="w-40 h-48 rounded-2xl overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
              {photo ? (
                <img src={photo.url} alt={photo.alt} className="w-full h-full object-cover" width={160} height={192} />
              ) : (
                <Stethoscope className="w-12 h-12 text-primary" aria-hidden="true" />
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{doctor.name}</h1>
              <p className="text-lg text-primary font-medium mb-4">{credentialLine}</p>
              <dl className="space-y-2 text-muted-foreground">
                <div>
                  <dt className="inline font-medium text-foreground">Qualification: </dt>
                  <dd className="inline">{doctor.qualification}</dd>
                </div>
                {doctor.nmcNumber && (
                  <div>
                    <dt className="inline font-medium text-foreground">NMC Registration No.: </dt>
                    <dd className="inline">{doctor.nmcNumber}</dd>
                  </div>
                )}
                <div>
                  <dt className="inline font-medium text-foreground">Experience: </dt>
                  <dd className="inline">Practising dentistry since {doctor.practisingSince}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-foreground">Clinic: </dt>
                  <dd className="inline">
                    <Link to="/contact" className="text-primary hover:underline">{CLINIC.name}</Link>, {CLINIC.address.locality}
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-3 mt-6">
                <Button asChild>
                  <Link to="/contact">Book a Consultation</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={CLINIC.phoneHref}>
                    <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                    {CLINIC.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
    </Layout>
  );
}
