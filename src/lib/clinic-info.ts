/**
 * Verified clinic entity information (confirmed by clinic management).
 * Single source of truth for NAP, structured data and doctor profiles.
 *
 * ZERO-PLACEHOLDER POLICY: never add unverified values here.
 * TODO (not rendered): operating days, geo coordinates, Dr. Bhawana Sharma NMC number.
 */
export const SITE_URL = "https://kundalinidentalclinic.com.np";

export const CLINIC = {
  name: "Kundalini Dental Clinic",
  url: `${SITE_URL}/`,
  phone: "+977-9802808008",
  phoneHref: "tel:+9779802808008",
  address: {
    street: "Ground Floor, Chappal Karkhana, Goreto Bhawan",
    locality: "Kathmandu",
    region: "Bagmati Province",
    postalCode: "44600",
    country: "NP",
    countryName: "Nepal",
  },
  fullAddress: "Ground Floor, Chappal Karkhana, Goreto Bhawan, Kathmandu, Bagmati Province 44600, Nepal",
  mapsUrl: "https://maps.app.goo.gl/aRKW1GMW5arimMcE6",
  /** Legacy daily-time string still used by other pages (unchanged in Phase 2A). */
  hours: "9:30 AM – 6:30 PM",
  /** Verified weekly schedule (confirmed Phase 2A): open 7 days. */
  openingSchedule: [
    { label: "Sunday–Friday", hours: "9:30 AM–6:30 PM" },
    { label: "Saturday", hours: "10:00 AM–2:00 PM" },
  ],
  whatsappHref: "https://wa.me/9779802808008",
  establishedYear: 2023,
  facebook: "https://www.facebook.com/kundalinidentalclinic",
  instagram: "https://www.instagram.com/kundalinidental",
} as const;

export const openingHoursSpecification = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:30",
    closes: "18:30",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "10:00",
    closes: "14:00",
  },
];

export interface VerifiedDoctor {
  slug: string;
  name: string;
  qualification: string;
  nmcNumber?: string;
  practisingSince: number;
}

export const VERIFIED_DOCTORS: VerifiedDoctor[] = [
  { slug: "dr-nitin-aryal", name: "Dr. Nitin Aryal", qualification: "BDS", nmcNumber: "12586", practisingSince: 2012 },
  // NMC number not yet provided — intentionally omitted.
  { slug: "dr-bhawana-sharma", name: "Dr. Bhawana Sharma", qualification: "BDS", practisingSince: 2018 },
];

export const clinicEntitySchema = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": `${SITE_URL}/#dentist`,
  name: CLINIC.name,
  url: CLINIC.url,
  telephone: CLINIC.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINIC.address.street,
    addressLocality: CLINIC.address.locality,
    addressRegion: CLINIC.address.region,
    postalCode: CLINIC.address.postalCode,
    addressCountry: CLINIC.address.country,
  },
  hasMap: CLINIC.mapsUrl,
  openingHoursSpecification,
  sameAs: [CLINIC.facebook, CLINIC.instagram],
};
