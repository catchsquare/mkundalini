import { supabase } from "@/integrations/supabase/client";
import { CLINIC } from "@/lib/clinic-info";

/** Nepal has no daylight saving, so the offset is fixed. */
export const CLINIC_TZ = "Asia/Kathmandu";
const CLINIC_OFFSET = "+05:45";

/** Treatments a patient can choose when booking. Keep names short. */
export const BOOKING_TREATMENTS = [
  "Check-up & consultation",
  "Scaling & cleaning",
  "Tooth pain / emergency",
  "Filling",
  "Root canal treatment",
  "Braces & aligners consultation",
  "Dental implant consultation",
  "Crown or bridge",
  "Tooth extraction / wisdom tooth",
  "Teeth whitening",
  "Veneers / smile makeover",
  "Kids dentistry",
  "Other",
] as const;

export interface Slot {
  start_time: string; // "HH:MM:SS" Nepal time
  end_time: string;
  remaining: number;
}

export interface BookingResult {
  booking_ref: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface BookingInput {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM:SS
  treatment: string;
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  message?: string;
}

/** Messages for the error codes raised by public.book_appointment. */
const ERRORS: Record<string, string> = {
  SLOT_UNAVAILABLE: "Sorry, that time was just taken. Please choose another time.",
  TOO_MANY_PENDING:
    "You already have several bookings waiting for confirmation. We will contact you shortly, or message us on WhatsApp.",
  INVALID_NAME: "Please enter your full name.",
  INVALID_PHONE: "Please enter a valid phone number, including the country code if you are outside Nepal.",
  INVALID_EMAIL: "Please check your email address.",
  INVALID_TREATMENT: "Please choose a treatment.",
  MESSAGE_TOO_LONG: "Your message is too long. Please keep it under 1000 characters.",
  BOOKING_DISABLED: "Online booking is paused right now. Please call or WhatsApp us to book.",
};

export function bookingErrorMessage(err: unknown): string {
  const raw = err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : "";
  const code = Object.keys(ERRORS).find((k) => raw.includes(k));
  return code
    ? ERRORS[code]
    : `Something went wrong. Please try again, or call ${CLINIC.phone}.`;
}

export function visitorTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || CLINIC_TZ;
  } catch {
    return CLINIC_TZ;
  }
}

/** True when the visitor's clock is not on Nepal time. */
export function isAbroad(tz = visitorTimeZone()): boolean {
  const now = new Date();
  const fmt = (zone: string) =>
    new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now);
  try {
    return fmt(tz) !== fmt(CLINIC_TZ);
  } catch {
    return false;
  }
}

/** A Nepal-time slot as an absolute instant. */
export function slotInstant(date: string, time: string): Date {
  return new Date(`${date}T${time.slice(0, 5)}:00${CLINIC_OFFSET}`);
}

export function formatClinicTime(date: string, time: string): string {
  return slotInstant(date, time).toLocaleTimeString("en-US", { timeZone: CLINIC_TZ, hour: "numeric", minute: "2-digit" });
}

/** e.g. "Mon 9:15 PM" in the visitor's own time zone. */
export function formatLocalTime(date: string, time: string, tz = visitorTimeZone()): string {
  return slotInstant(date, time).toLocaleString("en-US", {
    timeZone: tz,
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatLongDate(date: string): string {
  return new Date(`${date}T12:00:00${CLINIC_OFFSET}`).toLocaleDateString("en-US", {
    timeZone: CLINIC_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Today's date in Nepal as YYYY-MM-DD. */
export function clinicToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TZ }).format(new Date());
}

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function fetchSlots(date: string): Promise<Slot[]> {
  const { data, error } = await supabase.rpc("get_available_slots", { p_date: date });
  if (error) throw error;
  return (data || []) as Slot[];
}

export async function fetchBookingCalendar(): Promise<{
  closedWeekdays: number[];
  blockedDates: string[];
  maxDaysAhead: number;
  enabled: boolean;
}> {
  const [hours, blocked, settings] = await Promise.all([
    supabase.from("working_hours").select("day_of_week, is_closed, open_time"),
    supabase.from("blocked_dates").select("blocked_date"),
    supabase.from("booking_settings").select("max_days_ahead, is_enabled").eq("id", 1).maybeSingle(),
  ]);
  const rows = (hours.data || []) as Array<{ day_of_week: number; is_closed: boolean | null; open_time: string | null }>;
  const open = new Set(rows.filter((r) => !r.is_closed && r.open_time).map((r) => r.day_of_week));
  return {
    // If working hours could not be loaded, do not block any weekday.
    closedWeekdays: rows.length ? [0, 1, 2, 3, 4, 5, 6].filter((d) => !open.has(d)) : [],
    blockedDates: ((blocked.data || []) as Array<{ blocked_date: string }>).map((b) => b.blocked_date),
    maxDaysAhead: settings.data?.max_days_ahead ?? 60,
    enabled: settings.data?.is_enabled ?? true,
  };
}

export async function submitBooking(input: BookingInput): Promise<BookingResult> {
  const { data, error } = await supabase.rpc("book_appointment", {
    p_date: input.date,
    p_start_time: input.startTime,
    p_treatment: input.treatment,
    p_full_name: input.fullName,
    p_phone: input.phone,
    p_email: input.email || null,
    p_country: input.country || null,
    p_timezone: visitorTimeZone(),
    p_message: input.message || null,
  });
  if (error) throw error;
  const result = data as unknown as BookingResult;

  // Email alert to the clinic. The booking is already saved, so a failure
  // here must not show the patient an error.
  supabase.functions
    .invoke("notify-lead", {
      body: {
        name: input.fullName.trim(),
        email: input.email || null,
        phone: input.phone,
        form_type: "appointment",
        treatment_interest: input.treatment,
        source: "website",
        message: `Online booking ${result.booking_ref}: ${formatLongDate(result.date)} at ${formatClinicTime(
          result.date,
          result.start_time,
        )} (Nepal time)`,
      },
    })
    .catch(() => undefined);

  return result;
}

/** Calendar file so the patient can add the appointment to their phone. */
export function buildIcs(r: BookingResult, treatment: string): string {
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = slotInstant(r.date, r.start_time);
  const end = slotInstant(r.date, r.end_time);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kundalini Dental Clinic//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${r.booking_ref}@kundalinidentalclinic.com.np`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:Dental appointment (requested) - ${treatment}`,
    `DESCRIPTION:Booking ${r.booking_ref}. The clinic will confirm this time. Phone/WhatsApp ${CLINIC.phone}.`,
    `LOCATION:${CLINIC.name}, ${CLINIC.fullAddress}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function whatsappBookingLink(r: BookingResult): string {
  const text = `Hello, I booked online. Reference ${r.booking_ref} for ${formatLongDate(r.date)} at ${formatClinicTime(
    r.date,
    r.start_time,
  )} (Nepal time).`;
  return `${CLINIC.whatsappHref}?text=${encodeURIComponent(text)}`;
}
