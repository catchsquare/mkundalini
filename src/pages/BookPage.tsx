import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, CalendarPlus, CheckCircle2, Clock, Globe, Loader2, MessageCircle, Phone } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLINIC } from "@/lib/clinic-info";
import {
  BOOKING_TREATMENTS,
  type BookingResult,
  type Slot,
  bookingErrorMessage,
  buildIcs,
  clinicToday,
  fetchBookingCalendar,
  fetchSlots,
  formatClinicTime,
  formatLocalTime,
  formatLongDate,
  isAbroad,
  submitBooking,
  toIsoDate,
  visitorTimeZone,
  whatsappBookingLink,
} from "@/lib/booking";

const COUNTRIES = [
  "Nepal", "India", "Australia", "United States", "United Kingdom", "Canada", "Germany",
  "Netherlands", "France", "Japan", "South Korea", "China", "Qatar", "United Arab Emirates",
  "Saudi Arabia", "Malaysia", "Singapore", "Hong Kong", "Israel", "New Zealand",
];

function StepHeading({ n, title, done }: { n: number; title: string; done?: boolean }) {
  return (
    <h2 className="flex items-center gap-3 text-lg sm:text-xl font-semibold text-foreground mb-4">
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          done ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
        }`}
        aria-hidden="true"
      >
        {done ? <CheckCircle2 className="h-5 w-5" /> : n}
      </span>
      {title}
    </h2>
  );
}

export default function BookPage() {
  const abroad = useMemo(() => isAbroad(), []);
  const tz = useMemo(() => visitorTimeZone(), []);

  const [treatment, setTreatment] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [time, setTime] = useState<string>("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(abroad ? "" : "Nepal");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const [calendar, setCalendar] = useState({
    closedWeekdays: [] as number[],
    blockedDates: [] as string[],
    maxDaysAhead: 60,
    enabled: true,
  });

  useEffect(() => {
    fetchBookingCalendar().then(setCalendar).catch(() => undefined);
  }, []);

  const isoDate = date ? toIsoDate(date) : "";

  useEffect(() => {
    if (!isoDate) return;
    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError(null);
    setTime("");
    fetchSlots(isoDate)
      .then((s) => !cancelled && setSlots(s))
      .catch(() => !cancelled && setSlotsError("Could not load times. Please try again."))
      .finally(() => !cancelled && setSlotsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isoDate]);

  const today = clinicToday();
  const lastDay = useMemo(() => {
    const d = new Date(`${today}T12:00:00`);
    d.setDate(d.getDate() + calendar.maxDaysAhead);
    return d;
  }, [today, calendar.maxDaysAhead]);

  const isDisabled = (d: Date) => {
    const iso = toIsoDate(d);
    return (
      iso < today ||
      d > lastDay ||
      calendar.closedWeekdays.includes(d.getDay()) ||
      calendar.blockedDates.includes(iso)
    );
  };

  const detailsValid = fullName.trim().length >= 2 && phone.replace(/\D/g, "").length >= 7;
  const canSubmit = Boolean(treatment && isoDate && time && detailsValid && !submitting);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const r = await submitBooking({
        date: isoDate,
        startTime: time,
        treatment,
        fullName,
        phone,
        email,
        country,
        message,
      });
      setResult(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(bookingErrorMessage(err));
      // The slot may have just been taken: refresh the list.
      if (isoDate) fetchSlots(isoDate).then(setSlots).catch(() => undefined);
    } finally {
      setSubmitting(false);
    }
  }

  function downloadIcs() {
    if (!result) return;
    const blob = new Blob([buildIcs(result, treatment)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kundalini-dental-${result.booking_ref}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Layout showFloatingWidgets={false}>
      <SEO
        title="Book a Dental Appointment Online"
        description="Book an appointment at Kundalini Dental Clinic, Chappal Karkhana, Kathmandu. Choose a treatment, date and time online. Patients travelling to Nepal see times in their own time zone."
        path="/book"
      />
      <Breadcrumbs items={[{ label: "Book Appointment" }]} />

      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
            <CalendarCheck className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose a treatment, a day and a time. We confirm every booking by phone, WhatsApp or email,
            usually within clinic hours on the same day.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {result ? (
            <div className="rounded-2xl border border-primary/30 bg-card p-6 sm:p-8 text-center" role="status">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary mb-4" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Booking request received</h2>
              <p className="text-muted-foreground mb-6">
                Your reference is{" "}
                <span className="font-mono font-bold text-foreground text-lg">{result.booking_ref}</span>
              </p>
              <dl className="mx-auto max-w-sm text-left space-y-2 mb-6">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Treatment</dt>
                  <dd className="font-medium text-foreground text-right">{treatment}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-medium text-foreground text-right">{formatLongDate(result.date)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Time (Nepal)</dt>
                  <dd className="font-medium text-foreground text-right">
                    {formatClinicTime(result.date, result.start_time)}
                  </dd>
                </div>
                {abroad && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Your time</dt>
                    <dd className="font-medium text-foreground text-right">
                      {formatLocalTime(result.date, result.start_time, tz)}
                    </dd>
                  </div>
                )}
              </dl>
              <p className="text-sm text-muted-foreground mb-6">
                This time is held for you until we confirm it. If anything needs to change, we will
                contact you on {phone}
                {email ? ` or ${email}` : ""}.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href={whatsappBookingLink(result)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                    Send reference on WhatsApp
                  </a>
                </Button>
                <Button size="lg" variant="outline" onClick={downloadIcs}>
                  <CalendarPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Add to calendar
                </Button>
              </div>
            </div>
          ) : !calendar.enabled ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-foreground font-medium mb-4">
                Online booking is paused right now. Please call or WhatsApp us to book.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild><a href={CLINIC.phoneHref}><Phone className="h-4 w-4 mr-2" />{CLINIC.phone}</a></Button>
                <Button asChild variant="outline"><a href={CLINIC.whatsappHref}><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</a></Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10" noValidate>
              {/* 1. Treatment */}
              <div>
                <StepHeading n={1} title="What do you need?" done={Boolean(treatment)} />
                <Select value={treatment} onValueChange={setTreatment}>
                  <SelectTrigger className="h-12" aria-label="Treatment">
                    <SelectValue placeholder="Choose a treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOKING_TREATMENTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 2. Date */}
              <div>
                <StepHeading n={2} title="Pick a day" done={Boolean(date)} />
                <div className="rounded-xl border border-border bg-card inline-block">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={isDisabled}
                    fromDate={new Date(`${today}T12:00:00`)}
                    toDate={lastDay}
                    weekStartsOn={0}
                  />
                </div>
              </div>

              {/* 3. Time */}
              <div>
                <StepHeading n={3} title="Pick a time" done={Boolean(time)} />
                {abroad && (
                  <p className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                    <Globe className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    Times are Nepal time (GMT+5:45). Your local time ({tz.replace(/_/g, " ")}) is shown under each one.
                  </p>
                )}
                {!isoDate ? (
                  <p className="text-sm text-muted-foreground">Choose a day first.</p>
                ) : slotsLoading ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading free times…
                  </p>
                ) : slotsError ? (
                  <p className="text-sm text-destructive">{slotsError}</p>
                ) : slots && slots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No free times on this day. Please choose another day, or{" "}
                    <a className="text-primary underline" href={CLINIC.whatsappHref}>message us on WhatsApp</a>.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2" role="radiogroup" aria-label="Available times">
                    {(slots || []).map((s) => {
                      const selected = time === s.start_time;
                      return (
                        <button
                          key={s.start_time}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setTime(s.start_time)}
                          className={`rounded-lg border px-2 py-2.5 text-center text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:border-primary hover:bg-primary/5 text-foreground"
                          }`}
                        >
                          <span className="block font-semibold">{formatClinicTime(isoDate, s.start_time)}</span>
                          {abroad && (
                            <span className={`block text-xs mt-0.5 ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                              {formatLocalTime(isoDate, s.start_time, tz)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Details */}
              <div>
                <StepHeading n={4} title="Your details" done={detailsValid} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="b-name">Full name *</Label>
                    <Input id="b-name" className="h-12 mt-1.5" autoComplete="name" maxLength={100}
                      value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="b-phone">Phone / WhatsApp *</Label>
                    <Input id="b-phone" className="h-12 mt-1.5" type="tel" autoComplete="tel" maxLength={25}
                      placeholder={abroad ? "+61 400 000 000" : "98XXXXXXXX"}
                      value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    {abroad && (
                      <p className="text-xs text-muted-foreground mt-1">Include your country code.</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="b-email">Email {abroad ? "(recommended)" : "(optional)"}</Label>
                    <Input id="b-email" className="h-12 mt-1.5" type="email" autoComplete="email" maxLength={254}
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="b-country">Country you live in</Label>
                    <Input id="b-country" className="h-12 mt-1.5" list="b-countries" autoComplete="country-name" maxLength={60}
                      value={country} onChange={(e) => setCountry(e.target.value)} />
                    <datalist id="b-countries">
                      {COUNTRIES.map((c) => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="b-message">Anything we should know? (optional)</Label>
                    <Textarea id="b-message" className="mt-1.5" rows={3} maxLength={1000}
                      placeholder={abroad ? "Your travel dates, how long you are in Kathmandu, any X-rays you can send…" : "Symptoms, preferred dentist, questions…"}
                      value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>
                </div>
              </div>

              {submitError && (
                <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
                  {submitError}
                </p>
              )}

              <div className="rounded-xl bg-muted/50 p-5 sm:flex sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-muted-foreground mb-4 sm:mb-0 flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  {treatment && isoDate && time
                    ? `${treatment}, ${formatLongDate(isoDate)} at ${formatClinicTime(isoDate, time)} Nepal time`
                    : "Choose a treatment, day and time to continue."}
                </p>
                <Button type="submit" size="lg" className="w-full sm:w-auto h-12" disabled={!canSubmit}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />}
                  Request appointment
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                We use your details only to arrange your appointment. See our{" "}
                <Link to="/privacy" className="underline">privacy policy</Link>. Prefer to talk?{" "}
                <a href={CLINIC.phoneHref} className="underline">Call {CLINIC.phone}</a> or{" "}
                <a href={CLINIC.whatsappHref} className="underline">WhatsApp us</a>.
              </p>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
