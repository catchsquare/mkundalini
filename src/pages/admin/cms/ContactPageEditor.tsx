import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Save, Loader2, Eye, EyeOff, Plus, Trash2, Sparkles, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";

interface PageSection {
  id: string;
  page_id: string;
  section_type: string;
  content: Record<string, any> | null;
  settings: Record<string, any> | null;
  sort_order: number | null;
  is_visible: boolean | null;
}

const CONTACT_PAGE_ID = '11111111-0001-0001-0001-000000000008';

const sectionLabels: Record<string, { label: string; icon: any; description: string }> = {
  hero: { label: "Hero Section", icon: Sparkles, description: "Main banner with headline" },
  contact_methods: { label: "Contact Methods", icon: Phone, description: "Ways to get in touch" },
  booking_process: { label: "Booking Process", icon: Calendar, description: "Steps to book an appointment" },
};

export default function ContactPageEditor() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();
  const { logAction } = useAuditLog();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", CONTACT_PAGE_ID)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      const typedData = (data || []).map(item => ({
        ...item,
        content: (item.content as Record<string, any>) || {},
        settings: (item.settings as Record<string, any>) || {},
      })) as PageSection[];
      setSections(typedData);
    } catch (error: any) {
      toast({
        title: "Error loading sections",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (sectionId: string, content: Record<string, any>) => {
    setSaving(sectionId);
    try {
      const { error } = await supabase
        .from("page_sections")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", sectionId);

      if (error) throw error;

      await logAction({
        action: "update",
        entityType: "page_section",
        entityId: sectionId,
        newValues: { content },
      });

      toast({ title: "Section updated successfully" });
      fetchSections();
    } catch (error: any) {
      toast({
        title: "Error saving section",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const toggleVisibility = async (section: PageSection) => {
    try {
      const { error } = await supabase
        .from("page_sections")
        .update({ is_visible: !section.is_visible })
        .eq("id", section.id);

      if (error) throw error;
      toast({ title: `Section ${section.is_visible ? "hidden" : "shown"}` });
      fetchSections();
    } catch (error: any) {
      toast({
        title: "Error updating visibility",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getSectionByType = (type: string) => sections.find(s => s.section_type === type);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Page Editor</h1>
        <p className="text-muted-foreground">
          Edit all sections of your Contact page. Changes are saved per section.
        </p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {Object.entries(sectionLabels).map(([key, { label, icon: Icon }]) => (
            <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
              <Icon className="w-4 h-4 mr-1.5 hidden sm:block" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          <HeroEditor section={getSectionByType('hero')} onSave={updateSection} onToggleVisibility={toggleVisibility} saving={saving} />
        </TabsContent>

        <TabsContent value="contact_methods" className="mt-6">
          <ContactMethodsEditor section={getSectionByType('contact_methods')} onSave={updateSection} onToggleVisibility={toggleVisibility} saving={saving} />
        </TabsContent>

        <TabsContent value="booking_process" className="mt-6">
          <BookingProcessEditor section={getSectionByType('booking_process')} onSave={updateSection} onToggleVisibility={toggleVisibility} saving={saving} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NoSectionMessage({ type }: { type: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center text-muted-foreground">
        <p>No {sectionLabels[type]?.label || type} section found in the database.</p>
        <p className="text-sm mt-2">Please create this section in the Pages editor first.</p>
      </CardContent>
    </Card>
  );
}

function HeroEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="hero" />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Main banner at the top of the Contact page</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Badge Text</Label>
          <Input
            value={content.badge || ""}
            onChange={(e) => setContent({ ...content, badge: e.target.value })}
            placeholder="Book Your Appointment"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              placeholder="Your Smile Journey"
            />
          </div>
          <div className="space-y-2">
            <Label>Title Highlight (colored)</Label>
            <Input
              value={content.titleHighlight || ""}
              onChange={(e) => setContent({ ...content, titleHighlight: e.target.value })}
              placeholder="Starts Here"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={3}
          />
        </div>
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Hero Section
        </Button>
      </CardContent>
    </Card>
  );
}

function ContactMethodsEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || { methods: [] });

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="contact_methods" />;

  const methods = content.methods || [];

  const updateMethod = (index: number, field: string, value: string) => {
    const newMethods = [...methods];
    newMethods[index] = { ...newMethods[index], [field]: value };
    setContent({ ...content, methods: newMethods });
  };

  const addMethod = () => {
    setContent({ ...content, methods: [...methods, { icon: "", title: "", subtitle: "", value: "", href: "", description: "", responseTime: "" }] });
  };

  const removeMethod = (index: number) => {
    const newMethods = methods.filter((_: any, i: number) => i !== index);
    setContent({ ...content, methods: newMethods });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Contact Methods</CardTitle>
          <CardDescription>Ways customers can reach you</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Section Title</Label>
          <Input
            value={content.sectionTitle || ""}
            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
            placeholder="Choose How to Connect"
          />
        </div>
        <Accordion type="single" collapsible className="w-full">
          {methods.map((method: any, index: number) => (
            <AccordionItem key={index} value={`method-${index}`}>
              <AccordionTrigger className="text-sm">
                {method.title || `Contact Method ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Icon Name</Label>
                    <Input value={method.icon || ""} onChange={(e) => updateMethod(index, 'icon', e.target.value)} placeholder="Phone, Mail, MessageCircle..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={method.title || ""} onChange={(e) => updateMethod(index, 'title', e.target.value)} placeholder="WhatsApp" />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input value={method.subtitle || ""} onChange={(e) => updateMethod(index, 'subtitle', e.target.value)} placeholder="Fastest Response" />
                  </div>
                  <div className="space-y-2">
                    <Label>Value/Number</Label>
                    <Input value={method.value || ""} onChange={(e) => updateMethod(index, 'value', e.target.value)} placeholder="+977-9802808008" />
                  </div>
                  <div className="space-y-2">
                    <Label>Link/Href</Label>
                    <Input value={method.href || ""} onChange={(e) => updateMethod(index, 'href', e.target.value)} placeholder="https://wa.me/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Response Time</Label>
                    <Input value={method.responseTime || ""} onChange={(e) => updateMethod(index, 'responseTime', e.target.value)} placeholder="Usually within 1 hour" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={method.description || ""} onChange={(e) => updateMethod(index, 'description', e.target.value)} rows={2} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeMethod(index)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="outline" onClick={addMethod} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Contact Method
        </Button>
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Contact Methods
        </Button>
      </CardContent>
    </Card>
  );
}

function BookingProcessEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || { steps: [] });

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="booking_process" />;

  const steps = content.steps || [];

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setContent({ ...content, steps: newSteps });
  };

  const addStep = () => {
    setContent({ ...content, steps: [...steps, { step: steps.length + 1, title: "", description: "" }] });
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_: any, i: number) => i !== index);
    setContent({ ...content, steps: newSteps });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Booking Process</CardTitle>
          <CardDescription>Steps to book an appointment</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Section Title</Label>
          <Input
            value={content.sectionTitle || ""}
            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
            placeholder="How Booking Works"
          />
        </div>
        <div className="space-y-2">
          <Label>Section Description</Label>
          <Textarea
            value={content.sectionDescription || ""}
            onChange={(e) => setContent({ ...content, sectionDescription: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-3">
          {steps.map((step: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <Input
                  value={step.title || ""}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  placeholder="Step title"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => removeStep(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <Textarea
                value={step.description || ""}
                onChange={(e) => updateStep(index, 'description', e.target.value)}
                placeholder="Step description"
                rows={2}
              />
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addStep} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Step
        </Button>
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Booking Process
        </Button>
      </CardContent>
    </Card>
  );
}
