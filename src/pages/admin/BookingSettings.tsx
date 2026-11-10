import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getSafeErrorMessage } from "@/lib/errorHandling";

const db = supabase;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Settings {
  is_enabled: boolean;
  slot_minutes: number;
  capacity_per_slot: number;
  min_notice_minutes: number;
  max_days_ahead: number;
  max_pending_per_phone: number;
}

interface Hours {
  id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean | null;
  break_start: string | null;
  break_end: string | null;
}

interface Blocked {
  blocked_date: string;
  reason: string | null;
}

const hhmm = (t: string | null) => (t ? t.slice(0, 5) : "");

export default function BookingSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [hours, setHours] = useState<Hours[]>([]);
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [newBlock, setNewBlock] = useState({ date: "", reason: "" });

  const load = async () => {
    const [s, h, b] = await Promise.all([
      db.from("booking_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("working_hours").select("*").order("day_of_week"),
      db.from("blocked_dates").select("*").gte("blocked_date", new Date().toISOString().slice(0, 10)).order("blocked_date"),
    ]);
    setSettings(s.data);
    setHours((h.data as Hours[]) || []);
    setBlocked(b.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const fail = (e: unknown) => toast({ variant: "destructive", title: "Could not save", description: getSafeErrorMessage(e) });

  const saveAll = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const { error } = await db.from("booking_settings").update({ ...settings, updated_at: new Date().toISOString() }).eq("id", 1);
      if (error) throw error;
      for (const h of hours) {
        const { error: e } = await supabase
          .from("working_hours")
          .update({
            open_time: h.open_time || null,
            close_time: h.close_time || null,
            is_closed: Boolean(h.is_closed),
            break_start: h.break_start || null,
            break_end: h.break_end || null,
          })
          .eq("id", h.id);
        if (e) throw e;
      }
      toast({ title: "Booking settings saved" });
    } catch (e) {
      fail(e);
    } finally {
      setSaving(false);
    }
  };

  const addBlocked = async () => {
    if (!newBlock.date) return;
    const { error } = await db.from("blocked_dates").upsert({ blocked_date: newBlock.date, reason: newBlock.reason || null });
    if (error) return fail(error);
    setNewBlock({ date: "", reason: "" });
    load();
  };

  const removeBlocked = async (d: string) => {
    const { error } = await db.from("blocked_dates").delete().eq("blocked_date", d);
    if (error) return fail(error);
    load();
  };

  const setHour = (i: number, patch: Partial<Hours>) =>
    setHours((prev) => prev.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (!settings) {
    return <p className="text-muted-foreground">Booking settings are not set up. Run the online booking database migration first.</p>;
  }

  const num = (k: keyof Settings, label: string, help: string, min: number, max: number) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" htmlFor={`bs-${k}`}>{label}</label>
      <Input id={`bs-${k}`} type="number" min={min} max={max} value={settings[k] as number}
        onChange={(e) => setSettings({ ...settings, [k]: Number(e.target.value) })} />
      <p className="text-xs text-muted-foreground mt-1">{help}</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Booking Settings</h1>
          <p className="text-muted-foreground">Controls the times patients can pick on the website. All times are Nepal time.</p>
        </div>
        <Button onClick={saveAll} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save changes
        </Button>
      </div>

      <section className="rounded-xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-foreground">Online booking</h2>
            <p className="text-sm text-muted-foreground">When off, the website asks patients to call or WhatsApp instead.</p>
          </div>
          <Switch checked={settings.is_enabled} onCheckedChange={(v) => setSettings({ ...settings, is_enabled: v })} aria-label="Online booking on or off" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {num("slot_minutes", "Slot length (minutes)", "Length of each bookable time.", 10, 180)}
          {num("capacity_per_slot", "Patients per slot", "Usually the number of dentists on duty.", 1, 20)}
          {num("min_notice_minutes", "Minimum notice (minutes)", "180 = can't book less than 3 hours ahead.", 0, 10080)}
          {num("max_days_ahead", "Book up to (days ahead)", "How far into the future patients can book.", 1, 365)}
          {num("max_pending_per_phone", "Max open requests per phone", "Stops one number filling the calendar.", 1, 20)}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Opening hours</h2>
        <div className="space-y-3">
          {hours.map((h, i) => (
            <div key={h.id} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center">
              <span className="font-medium text-sm sm:col-span-1">{DAYS[h.day_of_week]}</span>
              <label className="flex items-center gap-2 text-sm sm:col-span-1">
                <Switch checked={!h.is_closed} onCheckedChange={(v) => setHour(i, { is_closed: !v })} aria-label={`${DAYS[h.day_of_week]} open`} />
                {h.is_closed ? "Closed" : "Open"}
              </label>
              <Input type="time" aria-label="Opens" disabled={Boolean(h.is_closed)} value={hhmm(h.open_time)} onChange={(e) => setHour(i, { open_time: e.target.value })} />
              <Input type="time" aria-label="Closes" disabled={Boolean(h.is_closed)} value={hhmm(h.close_time)} onChange={(e) => setHour(i, { close_time: e.target.value })} />
              <Input type="time" aria-label="Break starts" placeholder="Break from" disabled={Boolean(h.is_closed)} value={hhmm(h.break_start)} onChange={(e) => setHour(i, { break_start: e.target.value })} />
              <Input type="time" aria-label="Break ends" placeholder="Break to" disabled={Boolean(h.is_closed)} value={hhmm(h.break_end)} onChange={(e) => setHour(i, { break_end: e.target.value })} />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Columns: open/closed, opens, closes, lunch break from, lunch break to (leave break empty if none).</p>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground mb-1">Closed dates</h2>
        <p className="text-sm text-muted-foreground mb-4">Festivals, public holidays and clinic leave. No bookings are offered on these days.</p>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input type="date" value={newBlock.date} onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })} className="sm:w-48" aria-label="Date" />
          <Input placeholder="Reason (e.g. Tihar)" value={newBlock.reason} onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })} aria-label="Reason" />
          <Button variant="outline" onClick={addBlocked} disabled={!newBlock.date}>Add</Button>
        </div>
        {blocked.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming closed dates.</p>
        ) : (
          <ul className="divide-y divide-border">
            {blocked.map((b) => (
              <li key={b.blocked_date} className="flex items-center justify-between py-2 text-sm">
                <span><span className="font-medium">{b.blocked_date}</span>{b.reason ? ` · ${b.reason}` : ""}</span>
                <Button size="icon" variant="ghost" onClick={() => removeBlocked(b.blocked_date)} aria-label={`Remove ${b.blocked_date}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
