import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { getSafeErrorMessage } from "@/lib/errorHandling";
import { appointmentSchema } from "@/lib/validationSchemas";

interface Appointment {
  id: string;
  patient_id: string;
  dentist_id: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  treatment_type: string;
  status: string;
  notes: string | null;
  booking_ref?: string | null;
  source?: string | null;
  patient_timezone?: string | null;
  patient_message?: string | null;
  patient: { first_name: string; last_name: string; phone: string; email?: string | null; country?: string | null } | null;
}

interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
}

export default function Appointments() {
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [requests, setRequests] = useState<Appointment[]>([]);
  const [moving, setMoving] = useState<{ appt: Appointment; date: string; time: string } | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [isDialogOpen, setIsDialogOpen] = useState(searchParams.get("action") === "new");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patient_id: "",
    appointment_date: format(new Date(), "yyyy-MM-dd"),
    start_time: "09:00",
    end_time: "10:00",
    treatment_type: "",
    notes: "",
  });

  const treatmentTypes = [
    "Dental Consultation",
    "Dental Cleaning",
    "Dental X-Ray",
    "Single Tooth Implant",
    "Porcelain Veneer",
    "Teeth Whitening",
    "Root Canal Treatment",
    "Dental Crown",
    "Tooth Extraction",
    "Orthodontics Consultation",
  ];

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchRequests();
  }, [weekStart]);

  useEffect(() => {
    const channel = supabase
      .channel("appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => { fetchAppointments(); fetchRequests(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weekStart]);

  const fetchAppointments = async () => {
    try {
      const weekEnd = addDays(weekStart, 6);
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patient:patients(first_name, last_name, phone, email, country)
        `)
        .gte("appointment_date", format(weekStart, "yyyy-MM-dd"))
        .lte("appointment_date", format(weekEnd, "yyyy-MM-dd"))
        .order("start_time");

      if (error) throw error;
      setAppointments(data as unknown as Appointment[] || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    const { data } = await supabase
      .from("patients")
      .select("id, patient_id, first_name, last_name")
      .order("first_name");
    setPatients(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    const validation = appointmentSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.error.errors[0]?.message || "Please check your input",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("appointments").insert([{
        patient_id: formData.patient_id,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        treatment_type: formData.treatment_type,
        notes: formData.notes || null,
        status: "scheduled",
      }]);

      if (error) throw error;
      toast({ title: "Appointment scheduled successfully" });
      setIsDialogOpen(false);
      resetForm();
      fetchAppointments();
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: getSafeErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Online booking requests waiting for a staff decision (today onwards).
  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`*, patient:patients(first_name, last_name, phone, email, country)`)
      .eq("status", "requested")
      .gte("appointment_date", format(new Date(), "yyyy-MM-dd"))
      .order("appointment_date")
      .order("start_time");
    if (!error) setRequests((data as unknown as Appointment[]) || []);
  };

  // Move an appointment to a new date/time, keeping its length. Moving a
  // requested booking also confirms it, since staff agreed the time with the patient.
  const reschedule = async () => {
    if (!moving) return;
    const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
    const length = Math.max(15, toMin(moving.appt.end_time) - toMin(moving.appt.start_time));
    const endMin = toMin(moving.time) + length;
    const end = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
    const { error } = await supabase
      .from("appointments")
      .update({
        appointment_date: moving.date,
        start_time: moving.time,
        end_time: end,
        status: moving.appt.status === "requested" ? "confirmed" : moving.appt.status,
      })
      .eq("id", moving.appt.id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: getSafeErrorMessage(error) });
      return;
    }
    toast({ title: "Appointment moved" });
    setMoving(null);
    fetchAppointments();
    fetchRequests();
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Status updated" });
      fetchAppointments();
      fetchRequests();
    } catch (error: unknown) {
      toast({ variant: "destructive", title: "Error", description: getSafeErrorMessage(error) });
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: "",
      appointment_date: format(new Date(), "yyyy-MM-dd"),
      start_time: "09:00",
      end_time: "10:00",
      treatment_type: "",
      notes: "",
    });
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 border-green-300 text-green-800";
      case "in_progress": return "bg-blue-100 border-blue-300 text-blue-800";
      case "confirmed": return "bg-primary/10 border-primary/30 text-primary";
      case "cancelled": return "bg-red-100 border-red-300 text-red-800";
      case "no_show": return "bg-gray-100 border-gray-300 text-gray-800";
      case "requested": return "bg-amber-100 border-amber-400 text-amber-900 border-dashed";
      default: return "bg-orange-100 border-orange-300 text-orange-800";
    }
  };

  const getDayAppointments = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return appointments.filter((a) => a.appointment_date === key);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage appointments</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Online booking requests */}
      {requests.length > 0 && (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4">
          <h2 className="font-semibold text-foreground mb-3">
            {requests.length} online booking {requests.length === 1 ? "request" : "requests"} to confirm
          </h2>
          <div className="space-y-3">
            {requests.map((r) => {
              const phoneDigits = (r.patient?.phone || "").replace(/\D/g, "");
              const waNumber = phoneDigits.length === 10 && phoneDigits.startsWith("9") ? `977${phoneDigits}` : phoneDigits;
              return (
                <div key={r.id} className="rounded-lg bg-card border border-border p-3 flex flex-col lg:flex-row lg:items-center gap-3">
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="font-semibold text-foreground">
                      {format(new Date(`${r.appointment_date}T00:00:00`), "EEE d MMM")} · {r.start_time.slice(0, 5)} ·{" "}
                      {r.patient?.first_name} {r.patient?.last_name !== "-" ? r.patient?.last_name : ""}
                      {r.booking_ref && <span className="ml-2 font-mono text-xs text-muted-foreground">{r.booking_ref}</span>}
                    </p>
                    <p className="text-muted-foreground">
                      {r.treatment_type} · {r.patient?.phone}
                      {r.patient?.email ? ` · ${r.patient.email}` : ""}
                      {r.patient?.country && r.patient.country !== "Nepal" ? ` · ${r.patient.country}` : ""}
                      {r.patient_timezone && r.patient_timezone !== "Asia/Kathmandu" ? ` · lives in ${r.patient_timezone}` : ""}
                    </p>
                    {r.patient_message && (
                      <p className="text-muted-foreground italic mt-1 break-words">"{r.patient_message}"</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => updateStatus(r.id, "confirmed")}>Confirm</Button>
                    <Button size="sm" variant="outline"
                      onClick={() => setMoving({ appt: r, date: r.appointment_date, time: r.start_time.slice(0, 5) })}>
                      Move
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`tel:+${waNumber}`}>Call</a>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateStatus(r.id, "cancelled")}>
                      Decline
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Agree a new time with the patient first, then use Move. Moving a request confirms it.
          </p>
        </div>
      )}

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekStart(addDays(weekStart, -7))}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <div className="text-center">
          <p className="font-semibold text-foreground">
            {format(weekStart, "MMMM d")} - {format(addDays(weekStart, 6), "MMMM d, yyyy")}
          </p>
          <button
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))}
            className="text-sm text-primary hover:underline"
          >
            Today
          </button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekStart(addDays(weekStart, 7))}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={cn(
                "p-3 text-center border-r last:border-r-0",
                isSameDay(day, new Date()) && "bg-primary/5"
              )}
            >
              <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
              <p
                className={cn(
                  "text-lg font-semibold",
                  isSameDay(day, new Date()) && "text-primary"
                )}
              >
                {format(day, "d")}
              </p>
            </div>
          ))}
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((day, i) => {
            const dayAppts = getDayAppointments(day);
            return (
              <div
                key={i}
                className={cn(
                  "p-2 border-r last:border-r-0 min-h-[300px]",
                  isSameDay(day, new Date()) && "bg-primary/5"
                )}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-20">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                ) : dayAppts.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No appointments
                  </p>
                ) : (
                  <div className="space-y-2">
                    {dayAppts.map((appt) => (
                      <div
                        key={appt.id}
                        className={cn(
                          "p-2 rounded-lg border text-xs cursor-pointer hover:shadow-md transition-shadow",
                          getStatusColor(appt.status)
                        )}
                      >
                        <div className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {appt.start_time.slice(0, 5)}
                        </div>
                        <p className="font-semibold mt-1 truncate">
                          {appt.patient?.first_name} {appt.patient?.last_name}
                        </p>
                        <p className="text-[10px] opacity-80 truncate">
                          {appt.treatment_type}
                        </p>
                        {appt.booking_ref && (
                          <p className="text-[10px] font-mono opacity-80">{appt.booking_ref}</p>
                        )}
                        <Select
                          value={appt.status}
                          onValueChange={(val) => updateStatus(appt.id, val)}
                        >
                          <SelectTrigger className="h-6 mt-1 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="requested">Requested (online)</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no_show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Move appointment dialog */}
      <Dialog open={moving !== null} onOpenChange={(o) => !o && setMoving(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Move appointment</DialogTitle>
          </DialogHeader>
          {moving && (
            <div className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">
                {moving.appt.patient?.first_name} {moving.appt.patient?.last_name !== "-" ? moving.appt.patient?.last_name : ""} ·{" "}
                {moving.appt.treatment_type}
              </p>
              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="move-date">New date</label>
                <Input id="move-date" type="date" value={moving.date}
                  onChange={(e) => setMoving({ ...moving, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="move-time">New start time (Nepal)</label>
                <Input id="move-time" type="time" step={900} value={moving.time}
                  onChange={(e) => setMoving({ ...moving, time: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMoving(null)}>Cancel</Button>
                <Button onClick={reschedule} disabled={!moving.date || !moving.time}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Appointment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Patient *</label>
              <Select
                value={formData.patient_id}
                onValueChange={(val) => setFormData({ ...formData, patient_id: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} ({p.patient_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Date *</label>
              <Input
                type="date"
                value={formData.appointment_date}
                onChange={(e) =>
                  setFormData({ ...formData, appointment_date: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Start Time *</label>
                <Select
                  value={formData.start_time}
                  onValueChange={(val) => setFormData({ ...formData, start_time: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">End Time *</label>
                <Select
                  value={formData.end_time}
                  onValueChange={(val) => setFormData({ ...formData, end_time: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Treatment *</label>
              <Select
                value={formData.treatment_type}
                onValueChange={(val) => setFormData({ ...formData, treatment_type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select treatment" />
                </SelectTrigger>
                <SelectContent>
                  {treatmentTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Notes</label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.patient_id || !formData.treatment_type}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Schedule
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
