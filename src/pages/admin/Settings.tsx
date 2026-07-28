import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Save,
  Building,
  Clock,
  Search,
  Share2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  ImageIcon,
  Megaphone,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Link as RouterLink } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { Label } from "@/components/ui/label";
import { LogoUploader } from "@/components/admin/LogoUploader";

interface WorkingHour {
  id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  break_start: string | null;
  break_end: string | null;
  is_closed: boolean;
  notes: string | null;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Settings() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    fetchWorkingHours();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("global_settings")
        .select("*");

      if (error) throw error;
      
      const settingsMap: Record<string, any> = {};
      (data || []).forEach((s) => {
        settingsMap[s.setting_key] = s.setting_value;
      });
      setSettings(settingsMap);
    } catch (error: any) {
      toast({
        title: "Error loading settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkingHours = async () => {
    try {
      const { data, error } = await supabase
        .from("working_hours")
        .select("*")
        .order("day_of_week", { ascending: true });

      if (error) throw error;
      
      // Initialize all 7 days if not exists
      const hours: WorkingHour[] = [];
      for (let i = 0; i < 7; i++) {
        const existing = (data || []).find((h) => h.day_of_week === i);
        if (existing) {
          hours.push(existing);
        } else {
          hours.push({
            id: `temp-${i}`,
            day_of_week: i,
            open_time: i === 0 ? null : "09:00",
            close_time: i === 0 ? null : "18:00",
            break_start: null,
            break_end: null,
            is_closed: i === 0,
            notes: null,
          });
        }
      }
      setWorkingHours(hours);
    } catch (error: any) {
      console.error("Error fetching working hours:", error);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSetting = async (key: string, value: any, group: string, description: string, isPublic: boolean = false) => {
    try {
      const { data: existing } = await supabase
        .from("global_settings")
        .select("id")
        .eq("setting_key", key)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("global_settings")
          .update({
            setting_value: value,
            updated_at: new Date().toISOString(),
            updated_by: profile?.id,
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("global_settings")
          .insert({
            setting_key: key,
            setting_value: value,
            setting_group: group,
            description,
            is_public: isPublic,
          });
        if (error) throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await saveSetting("clinic_name", settings.clinic_name || "Kundalini Dental Clinic", "general", "Clinic name", true);
      await saveSetting("clinic_address", settings.clinic_address || "", "general", "Clinic address", true);
      await saveSetting("clinic_phone", settings.clinic_phone || "", "general", "Primary phone number", true);
      await saveSetting("clinic_email", settings.clinic_email || "", "general", "Primary email", true);
      await saveSetting("established_year", settings.established_year || "", "general", "Year established", true);
      await saveSetting("managing_director", settings.managing_director || "", "general", "Managing director name", true);
      await saveSetting("director_title", settings.director_title || "", "general", "Director title/credentials", true);

      await logAction({
        action: "update",
        entityType: "setting",
        entityId: "general",
        newValues: settings,
      });
      toast({ title: "General settings saved" });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSEO = async () => {
    setSaving(true);
    try {
      await saveSetting("seo_title", settings.seo_title || "", "seo", "Default page title", true);
      await saveSetting("seo_description", settings.seo_description || "", "seo", "Default meta description", true);
      await saveSetting("seo_keywords", settings.seo_keywords || "", "seo", "Default keywords", true);
      await saveSetting("og_image", settings.og_image || "", "seo", "Default OG image URL", true);
      await saveSetting("google_analytics_id", settings.google_analytics_id || "", "seo", "Google Analytics ID", false);

      await logAction({
        action: "update",
        entityType: "setting",
        entityId: "seo",
        newValues: settings,
      });
      toast({ title: "SEO settings saved" });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    try {
      await saveSetting("social_facebook", settings.social_facebook || "", "social", "Facebook URL", true);
      await saveSetting("social_instagram", settings.social_instagram || "", "social", "Instagram URL", true);
      await saveSetting("social_youtube", settings.social_youtube || "", "social", "YouTube URL", true);
      await saveSetting("social_linkedin", settings.social_linkedin || "", "social", "LinkedIn URL", true);
      await saveSetting("whatsapp_number", settings.whatsapp_number || "", "social", "WhatsApp number", true);
      await saveSetting("viber_number", settings.viber_number || "", "social", "Viber number", true);

      await logAction({
        action: "update",
        entityType: "setting",
        entityId: "social",
        newValues: settings,
      });
      toast({ title: "Social links saved" });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWorkingHours = async () => {
    setSaving(true);
    try {
      for (const hour of workingHours) {
        if (hour.id.startsWith("temp-")) {
          const { error } = await supabase.from("working_hours").insert({
            day_of_week: hour.day_of_week,
            open_time: hour.open_time,
            close_time: hour.close_time,
            break_start: hour.break_start,
            break_end: hour.break_end,
            is_closed: hour.is_closed,
            notes: hour.notes,
          });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("working_hours")
            .update({
              open_time: hour.open_time,
              close_time: hour.close_time,
              break_start: hour.break_start,
              break_end: hour.break_end,
              is_closed: hour.is_closed,
              notes: hour.notes,
            })
            .eq("id", hour.id);
          if (error) throw error;
        }
      }

      await logAction({
        action: "update",
        entityType: "setting",
        entityId: "working_hours",
        newValues: { workingHours },
      });
      toast({ title: "Working hours saved" });
      fetchWorkingHours();
    } catch (error: any) {
      toast({
        title: "Error saving working hours",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateWorkingHour = (dayIndex: number, field: keyof WorkingHour, value: any) => {
    setWorkingHours((prev) =>
      prev.map((h) =>
        h.day_of_week === dayIndex ? { ...h, [field]: value } : h
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage clinic and website settings</p>
        </div>
      </div>

      <Tabs defaultValue="branding">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="branding" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Building className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="hours" className="gap-2">
            <Clock className="w-4 h-4" />
            Working Hours
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Search className="w-4 h-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="w-4 h-4" />
            Social & Messaging
          </TabsTrigger>
          <TabsTrigger value="announcement" className="gap-2">
            <Megaphone className="w-4 h-4" />
            Announcement Bar
          </TabsTrigger>
        </TabsList>

        {/* Announcement Bar */}
        <TabsContent value="announcement">
          <Card>
            <CardHeader>
              <CardTitle>Top Announcement Bar</CardTitle>
              <CardDescription>
                Controls the thin promo strip at the top of every public page. Content is pulled from active offers in the Offers editor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card">
                <div>
                  <Label className="text-base">Show announcement bar</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    When off, the bar is completely hidden site-wide even if offers are active.
                  </p>
                </div>
                <Switch
                  checked={settings.announcement_bar_enabled !== false}
                  onCheckedChange={(v) => updateSetting("announcement_bar_enabled", v)}
                />
              </div>

              <div className="text-sm text-muted-foreground p-4 rounded-lg border bg-muted/40">
                Manage the messages, badge text, links, and active status of each announcement in the{" "}
                <RouterLink to="/admin/cms/offers" className="text-primary underline">
                  Offers editor
                </RouterLink>
                . Only offers with status <span className="font-medium">active</span> appear here.
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await saveSetting(
                        "announcement_bar_enabled",
                        settings.announcement_bar_enabled !== false,
                        "layout",
                        "Show top announcement bar on public pages",
                        true,
                      );
                      await logAction({
                        action: "update",
                        entityType: "setting",
                        entityId: "announcement_bar",
                        newValues: {
                          announcement_bar_enabled: settings.announcement_bar_enabled !== false,
                        },
                      });
                      toast({ title: "Announcement bar settings saved" });
                    } catch (error: any) {
                      toast({
                        title: "Error saving settings",
                        description: error.message,
                        variant: "destructive",
                      });
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                >
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding">
          <LogoUploader
            currentLogoUrl={settings.site_logo || null}
            onLogoChange={(url) => updateSetting("site_logo", url)}
            onSave={async () => {
              setSaving(true);
              try {
                await saveSetting("site_logo", settings.site_logo || "", "branding", "Site logo URL", true);
                await logAction({
                  action: "update",
                  entityType: "setting",
                  entityId: "branding",
                  newValues: { site_logo: settings.site_logo },
                });
                toast({ title: "Logo settings saved" });
              } catch (error: any) {
                toast({
                  title: "Error saving logo",
                  description: error.message,
                  variant: "destructive",
                });
              } finally {
                setSaving(false);
              }
            }}
            saving={saving}
          />
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>
                Basic information about your clinic displayed across the website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Clinic Name
                  </Label>
                  <Input
                    value={settings.clinic_name || ""}
                    onChange={(e) => updateSetting("clinic_name", e.target.value)}
                    placeholder="Kundalini Dental Clinic"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <Textarea
                    value={settings.clinic_address || ""}
                    onChange={(e) => updateSetting("clinic_address", e.target.value)}
                    placeholder="Goreto Bhawan, Chappal Karkhana, Kathmandu"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    value={settings.clinic_phone || ""}
                    onChange={(e) => updateSetting("clinic_phone", e.target.value)}
                    placeholder="+977-9802808008"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    value={settings.clinic_email || ""}
                    onChange={(e) => updateSetting("clinic_email", e.target.value)}
                    placeholder="info@kundalinidentalclinic.com.np"
                    type="email"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Established Year
                  </Label>
                  <Input
                    value={settings.established_year || ""}
                    onChange={(e) => updateSetting("established_year", e.target.value)}
                    placeholder="2023"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Managing Director
                  </Label>
                  <Input
                    value={settings.managing_director || ""}
                    onChange={(e) => updateSetting("managing_director", e.target.value)}
                    placeholder="Dr. Nitin Aryal"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Director Title / Credentials</Label>
                  <Input
                    value={settings.director_title || ""}
                    onChange={(e) => updateSetting("director_title", e.target.value)}
                    placeholder="BDS, 15 years experience"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>
                Set your clinic's operating hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workingHours.map((hour) => (
                <div
                  key={hour.day_of_week}
                  className={`flex flex-wrap items-center gap-4 p-4 rounded-lg border ${
                    hour.is_closed ? "bg-muted/50" : "bg-card"
                  }`}
                >
                  <div className="w-24 font-medium">{dayNames[hour.day_of_week]}</div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`closed-${hour.day_of_week}`}
                      checked={hour.is_closed}
                      onCheckedChange={(checked) =>
                        updateWorkingHour(hour.day_of_week, "is_closed", !!checked)
                      }
                    />
                    <Label htmlFor={`closed-${hour.day_of_week}`} className="cursor-pointer">
                      Closed
                    </Label>
                  </div>

                  {!hour.is_closed && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Open:</Label>
                        <Input
                          type="time"
                          value={hour.open_time || ""}
                          onChange={(e) =>
                            updateWorkingHour(hour.day_of_week, "open_time", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Close:</Label>
                        <Input
                          type="time"
                          value={hour.close_time || ""}
                          onChange={(e) =>
                            updateWorkingHour(hour.day_of_week, "close_time", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Break:</Label>
                        <Input
                          type="time"
                          value={hour.break_start || ""}
                          onChange={(e) =>
                            updateWorkingHour(hour.day_of_week, "break_start", e.target.value)
                          }
                          className="w-28"
                          placeholder="Start"
                        />
                        <span>-</span>
                        <Input
                          type="time"
                          value={hour.break_end || ""}
                          onChange={(e) =>
                            updateWorkingHour(hour.day_of_week, "break_end", e.target.value)
                          }
                          className="w-28"
                          placeholder="End"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveWorkingHours} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save Working Hours
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Defaults</CardTitle>
              <CardDescription>
                Default SEO settings used when pages don't have their own
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Default Page Title</Label>
                  <Input
                    value={settings.seo_title || ""}
                    onChange={(e) => updateSetting("seo_title", e.target.value)}
                    placeholder="Kundalini Dental Clinic | Quality Dental Care in Kathmandu"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(settings.seo_title || "").length}/60 characters
                  </p>
                </div>

                <div>
                  <Label>Default Meta Description</Label>
                  <Textarea
                    value={settings.seo_description || ""}
                    onChange={(e) => updateSetting("seo_description", e.target.value)}
                    placeholder="Premium dental care in Kathmandu, Nepal. Led by Dr. Nitin Aryal with 15 years experience..."
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(settings.seo_description || "").length}/160 characters
                  </p>
                </div>

                <div>
                  <Label>Default Keywords</Label>
                  <Input
                    value={settings.seo_keywords || ""}
                    onChange={(e) => updateSetting("seo_keywords", e.target.value)}
                    placeholder="dental clinic kathmandu, dentist nepal, dental implants..."
                  />
                </div>

                <div>
                  <Label>Default OG Image URL</Label>
                  <Input
                    value={settings.og_image || ""}
                    onChange={(e) => updateSetting("og_image", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label>Google Analytics ID</Label>
                  <Input
                    value={settings.google_analytics_id || ""}
                    onChange={(e) => updateSetting("google_analytics_id", e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSEO} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save SEO Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social & Messaging */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Links & Messaging</CardTitle>
              <CardDescription>
                Social media profiles and messaging app numbers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Facebook URL</Label>
                  <Input
                    value={settings.social_facebook || ""}
                    onChange={(e) => updateSetting("social_facebook", e.target.value)}
                    placeholder="https://facebook.com/kundalinidental"
                  />
                </div>

                <div>
                  <Label>Instagram URL</Label>
                  <Input
                    value={settings.social_instagram || ""}
                    onChange={(e) => updateSetting("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/kundalinidental"
                  />
                </div>

                <div>
                  <Label>YouTube URL</Label>
                  <Input
                    value={settings.social_youtube || ""}
                    onChange={(e) => updateSetting("social_youtube", e.target.value)}
                    placeholder="https://youtube.com/@kundalinidental"
                  />
                </div>

                <div>
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={settings.social_linkedin || ""}
                    onChange={(e) => updateSetting("social_linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/kundalinidental"
                  />
                </div>

                <div>
                  <Label>WhatsApp Number</Label>
                  <Input
                    value={settings.whatsapp_number || ""}
                    onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
                    placeholder="+9779802808008"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include country code without spaces
                  </p>
                </div>

                <div>
                  <Label>Viber Number</Label>
                  <Input
                    value={settings.viber_number || ""}
                    onChange={(e) => updateSetting("viber_number", e.target.value)}
                    placeholder="+9779802808008"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSocial} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save Social Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
