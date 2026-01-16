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
  patient: { first_name: string; last_name: string; phone: string } | null;
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
  }, [weekStart]);

  useEffect(() => {
    const channel = supabase
      .channel("appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => fetchAppointments()
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
          patient:patients(first_name, last_name, phone)
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

    try {
      const { error } = await supabase.from("appointments").insert([{
        ...formData,
        status: "scheduled",
      }]);

      if (error) throw error;
      toast({ title: "Appointment scheduled successfully" });
      setIsDialogOpen(false);
      resetForm();
      fetchAppointments();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
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
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
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
      default: return "bg-orange-100 border-orange-300 text-orange-800";
    }
  };

  const getDayAppointments = (date: Date) => {
    return appointments.filter((a) =>
      isSameDay(new Date(a.appointment_date), date)
    );
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
                        <Select
                          value={appt.status}
                          onValueChange={(val) => updateStatus(appt.id, val)}
                        >
                          <SelectTrigger className="h-6 mt-1 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
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
