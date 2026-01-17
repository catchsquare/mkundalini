import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Eye, EyeOff, Sparkles, Users, Award } from "lucide-react";
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

const DOCTORS_PAGE_ID = '11111111-0001-0001-0001-000000000005';

const sectionLabels: Record<string, { label: string; icon: any; description: string }> = {
  hero: { label: "Hero Section", icon: Sparkles, description: "Main banner with headline" },
  featured_doctor: { label: "Featured Doctor", icon: Users, description: "Highlighted doctor section" },
  commitment: { label: "Our Commitment", icon: Award, description: "Quality care commitment section" },
};

export default function DoctorsPageEditor() {
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
        .eq("page_id", DOCTORS_PAGE_ID)
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
        <h1 className="text-2xl font-bold">Doctors Page Editor</h1>
        <p className="text-muted-foreground">
          Edit all sections of your Doctors page. Doctor profiles are managed in Team CMS.
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

        <TabsContent value="featured_doctor" className="mt-6">
          <FeaturedDoctorEditor section={getSectionByType('featured_doctor')} onSave={updateSection} onToggleVisibility={toggleVisibility} saving={saving} />
        </TabsContent>

        <TabsContent value="commitment" className="mt-6">
          <CommitmentEditor section={getSectionByType('commitment')} onSave={updateSection} onToggleVisibility={toggleVisibility} saving={saving} />
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
          <CardDescription>Main banner at the top of the Doctors page</CardDescription>
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
            placeholder="Our Medical Team"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              placeholder="Meet Your"
            />
          </div>
          <div className="space-y-2">
            <Label>Title Highlight (colored)</Label>
            <Input
              value={content.titleHighlight || ""}
              onChange={(e) => setContent({ ...content, titleHighlight: e.target.value })}
              placeholder="Dental Team"
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

function FeaturedDoctorEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="featured_doctor" />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Featured Doctor Section</CardTitle>
          <CardDescription>Settings for the featured doctor display. Doctor data comes from Team CMS.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Section Label</Label>
          <Input
            value={content.sectionLabel || ""}
            onChange={(e) => setContent({ ...content, sectionLabel: e.target.value })}
            placeholder="Leadership"
          />
        </div>
        <div className="space-y-2">
          <Label>Section Title</Label>
          <Input
            value={content.sectionTitle || ""}
            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
            placeholder="Managing Director"
          />
        </div>
        <div className="space-y-2">
          <Label>CTA Button Text</Label>
          <Input
            value={content.ctaText || ""}
            onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
            placeholder="Book Consultation with Dr. Aryal"
          />
        </div>
        <div className="space-y-2">
          <Label>CTA Link</Label>
          <Input
            value={content.ctaLink || ""}
            onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
            placeholder="/contact"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Featured doctor information is pulled from Team CMS. Mark a team member as "featured" to display them here.
        </p>
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Featured Doctor Settings
        </Button>
      </CardContent>
    </Card>
  );
}

function CommitmentEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="commitment" />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Our Commitment Section</CardTitle>
          <CardDescription>Quality care commitment messaging</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Section Label</Label>
          <Input
            value={content.sectionLabel || ""}
            onChange={(e) => setContent({ ...content, sectionLabel: e.target.value })}
            placeholder="Our Promise"
          />
        </div>
        <div className="space-y-2">
          <Label>Section Title</Label>
          <Input
            value={content.sectionTitle || ""}
            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
            placeholder="Quality Care You Can Trust"
          />
        </div>
        <div className="space-y-2">
          <Label>Section Description</Label>
          <Textarea
            value={content.sectionDescription || ""}
            onChange={(e) => setContent({ ...content, sectionDescription: e.target.value })}
            rows={3}
          />
        </div>
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Commitment Section
        </Button>
      </CardContent>
    </Card>
  );
}
