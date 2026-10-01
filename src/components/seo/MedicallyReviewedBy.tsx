import { Link } from "react-router-dom";
import { VERIFIED_DOCTORS } from "@/lib/clinic-info";

interface MedicallyReviewedByProps {
  /** Slug of a verified doctor, e.g. "dr-nitin-aryal". */
  doctorSlug: string;
  /** ISO date (YYYY-MM-DD) of the ACTUAL review by the dentist. */
  reviewedOn: string;
}

/**
 * "Medically reviewed by" byline.
 * IMPORTANT: Mount only on pages a dentist has actually reviewed and approved.
 * Not mounted anywhere in Phase 1 — do not add automatically.
 */
export function MedicallyReviewedBy({ doctorSlug, reviewedOn }: MedicallyReviewedByProps) {
  const doctor = VERIFIED_DOCTORS.find((d) => d.slug === doctorSlug);
  if (!doctor || !reviewedOn) return null;
  const date = new Date(reviewedOn);
  const label = isNaN(date.getTime())
    ? reviewedOn
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <p className="text-sm text-muted-foreground">
      Medically reviewed by{" "}
      <Link to={`/doctors/${doctor.slug}`} className="text-primary hover:underline">
        {doctor.name}, {doctor.qualification}
      </Link>
      <span className="mx-2" aria-hidden="true">·</span>
      Last reviewed: <time dateTime={reviewedOn}>{label}</time>
    </p>
  );
}
