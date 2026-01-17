import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Save, Loader2, Eye, EyeOff, Plus, Trash2, Sparkles, Globe, Award, MapPin, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { SEOSettingsEditor } from "@/components/admin/cms/SEOSettingsEditor";

interface PageSection {
  id: string;
  page_id: string;
  section_type: string;
  content: Record<string, any> | null;
  settings: Record<string, any> | null;
  sort_order: number | null;
  is_visible: boolean | null;
}

const DENTAL_TOURISM_PAGE_ID = '11111111-0001-0001-0001-000000000004';

const sectionLabels: Record<string, { label: string; icon: any; description: string }> = {
  hero: { label: "Hero Section", icon: Sparkles, description: "Main banner with headline" },
  quick_stats: { label: "Quick Stats", icon: Award, description: "Key statistics strip" },
  why_nepal: { label: "Why Nepal", icon: MapPin, description: "Benefits of dental care in Nepal" },
  why_kundalini: { label: "Why Kundalini", icon: Globe, description: "Why choose our clinic" },
  seo: { label: "SEO Settings", icon: Search, description: "Search engine optimization" },
};

export default function DentalTourismPageEditor() {
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
        .eq("page_id", DENTAL_TOURISM_PAGE_ID)
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
        <h1 className="text-2xl font-bold">Dental Tourism Page Editor</h1>
        <p className="text-muted-foreground">
          Edit all sections of your Dental Tourism page. Changes are saved per section.
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

        <TabsContent value="quick_stats" className="mt-6">
          <QuickStatsEditor section={getSectionByType('quick_stats')} onSave={updateSection} onToggleVisibility={toggleVisibility} saving={saving} />
        </TabsContent>

        <TabsContent value="why_nepal" className="mt-6">
          <WhyNepalEditor section={getSectionByType('why_nepal')} onSave={updateSection} onToggleVisibility={toggleVisibility} saving={saving} />
        </TabsContent>

        <TabsContent value="why_kundalini" className="mt-6">
          <WhyKundaliniEditor section={getSectionByType('why_kundalini')} onSave={updateSection} onToggleVisibility={toggleVisibility} saving={saving} />
        </TabsContent>

        <TabsContent value="seo" className="mt-6">
          <SEOSettingsEditor pageId={DENTAL_TOURISM_PAGE_ID} pageName="Dental Tourism Page" />
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
          <CardDescription>Main banner at the top of the Dental Tourism page</CardDescription>
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
            placeholder="International Patients"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              placeholder="Your Complete Guide to"
            />
          </div>
          <div className="space-y-2">
            <Label>Title Highlight (colored)</Label>
            <Input
              value={content.titleHighlight || ""}
              onChange={(e) => setContent({ ...content, titleHighlight: e.target.value })}
              placeholder="Dental Care in Nepal"
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary CTA Label</Label>
            <Input
              value={content.ctaPrimary?.label || ""}
              onChange={(e) => setContent({ ...content, ctaPrimary: { ...content.ctaPrimary, label: e.target.value } })}
              placeholder="Start with a Free Consultation"
            />
          </div>
          <div className="space-y-2">
            <Label>Primary CTA Link</Label>
            <Input
              value={content.ctaPrimary?.link || ""}
              onChange={(e) => setContent({ ...content, ctaPrimary: { ...content.ctaPrimary, link: e.target.value } })}
              placeholder="/contact"
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA Label</Label>
            <Input
              value={content.ctaSecondary?.label || ""}
              onChange={(e) => setContent({ ...content, ctaSecondary: { ...content.ctaSecondary, label: e.target.value } })}
              placeholder="WhatsApp Us"
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA Link</Label>
            <Input
              value={content.ctaSecondary?.link || ""}
              onChange={(e) => setContent({ ...content, ctaSecondary: { ...content.ctaSecondary, link: e.target.value } })}
              placeholder="https://wa.me/..."
            />
          </div>
        </div>
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Hero Section
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickStatsEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || { stats: [] });

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="quick_stats" />;

  const stats = content.stats || [];

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent({ ...content, stats: newStats });
  };

  const addStat = () => {
    setContent({ ...content, stats: [...stats, { value: "", label: "" }] });
  };

  const removeStat = (index: number) => {
    const newStats = stats.filter((_: any, i: number) => i !== index);
    setContent({ ...content, stats: newStats });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Quick Statistics</CardTitle>
          <CardDescription>Key numbers displayed below the hero</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {stats.map((stat: any, index: number) => (
            <div key={index} className="flex gap-3 items-center p-3 border rounded-lg">
              <Input
                value={stat.value || ""}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                placeholder="15"
                className="w-24"
              />
              <Input
                value={stat.label || ""}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="Years Experience"
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => removeStat(index)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addStat} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Statistic
        </Button>
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Quick Stats
        </Button>
      </CardContent>
    </Card>
  );
}

function WhyNepalEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || { items: [] });

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="why_nepal" />;

  const items = content.items || [];

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, items: newItems });
  };

  const addItem = () => {
    setContent({ ...content, items: [...items, { icon: "", title: "", description: "" }] });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    setContent({ ...content, items: newItems });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Why Choose Nepal</CardTitle>
          <CardDescription>Benefits of dental tourism in Nepal</CardDescription>
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
            placeholder="Why Choose Nepal for Dental Care?"
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
        <Accordion type="single" collapsible className="w-full">
          {items.map((item: any, index: number) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-sm">
                {item.title || `Reason ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Icon Name</Label>
                  <Input value={item.icon || ""} onChange={(e) => updateItem(index, 'icon', e.target.value)} placeholder="DollarSign, Award, Shield..." />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={item.title || ""} onChange={(e) => updateItem(index, 'title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={item.description || ""} onChange={(e) => updateItem(index, 'description', e.target.value)} rows={2} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeItem(index)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="outline" onClick={addItem} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Reason
        </Button>
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Why Nepal
        </Button>
      </CardContent>
    </Card>
  );
}

function WhyKundaliniEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || { items: [] });

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="why_kundalini" />;

  const items = content.items || [];

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, items: newItems });
  };

  const addItem = () => {
    setContent({ ...content, items: [...items, { title: "", description: "" }] });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    setContent({ ...content, items: newItems });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Why Kundalini Dental</CardTitle>
          <CardDescription>Reasons to choose our clinic</CardDescription>
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
            placeholder="Why Kundalini Dental Clinic?"
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
        <Accordion type="single" collapsible className="w-full">
          {items.map((item: any, index: number) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-sm">
                {item.title || `Reason ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={item.title || ""} onChange={(e) => updateItem(index, 'title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={item.description || ""} onChange={(e) => updateItem(index, 'description', e.target.value)} rows={2} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeItem(index)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="outline" onClick={addItem} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Reason
        </Button>
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Why Kundalini
        </Button>
      </CardContent>
    </Card>
  );
}
