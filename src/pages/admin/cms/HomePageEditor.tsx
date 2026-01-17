import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Save, 
  Loader2, 
  Eye,
  EyeOff,
  Plus,
  Trash2,
  GripVertical,
  LayoutTemplate,
  Sparkles,
  Users,
  Globe,
  Star,
  Phone,
  Settings,
  ChevronRight,
  Search
} from "lucide-react";
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

const HOME_PAGE_ID = '11111111-0001-0001-0001-000000000001';

const sectionLabels: Record<string, { label: string; icon: any; description: string }> = {
  hero: { label: "Hero Section", icon: Sparkles, description: "Main banner with headline, description, and CTAs" },
  trust_indicators: { label: "Trust Indicators", icon: Settings, description: "Feature badges below hero" },
  services_grid: { label: "Services Overview", icon: LayoutTemplate, description: "Featured services cards" },
  why_choose_us: { label: "Why Choose Us", icon: ChevronRight, description: "Benefits and features section" },
  doctor_highlight: { label: "Doctor Highlight", icon: Users, description: "Featured doctor profile" },
  international: { label: "International Patients", icon: Globe, description: "Dental tourism benefits" },
  testimonials: { label: "Testimonials", icon: Star, description: "Patient reviews and stories" },
  cta_strip: { label: "Final CTA", icon: Phone, description: "Bottom call-to-action section" },
  seo: { label: "SEO Settings", icon: Search, description: "Search engine optimization" },
};

export default function HomePageEditor() {
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
        .eq("page_id", HOME_PAGE_ID)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      // Cast the data to our interface
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
        <h1 className="text-2xl font-bold">Home Page Editor</h1>
        <p className="text-muted-foreground">
          Edit all sections of your homepage. Changes are saved per section.
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

        {/* Hero Section Editor */}
        <TabsContent value="hero" className="mt-6">
          <HeroEditor 
            section={getSectionByType('hero')} 
            onSave={updateSection} 
            onToggleVisibility={toggleVisibility}
            saving={saving}
          />
        </TabsContent>

        {/* Trust Indicators Editor */}
        <TabsContent value="trust_indicators" className="mt-6">
          <TrustIndicatorsEditor 
            section={getSectionByType('trust_indicators')} 
            onSave={updateSection} 
            onToggleVisibility={toggleVisibility}
            saving={saving}
          />
        </TabsContent>

        {/* Services Grid Editor */}
        <TabsContent value="services_grid" className="mt-6">
          <ServicesGridEditor 
            section={getSectionByType('services_grid')} 
            onSave={updateSection} 
            onToggleVisibility={toggleVisibility}
            saving={saving}
          />
        </TabsContent>

        {/* Why Choose Us Editor */}
        <TabsContent value="why_choose_us" className="mt-6">
          <WhyChooseUsEditor 
            section={getSectionByType('why_choose_us')} 
            onSave={updateSection} 
            onToggleVisibility={toggleVisibility}
            saving={saving}
          />
        </TabsContent>

        {/* Doctor Highlight Editor */}
        <TabsContent value="doctor_highlight" className="mt-6">
          <DoctorHighlightEditor 
            section={getSectionByType('doctor_highlight')} 
            onSave={updateSection} 
            onToggleVisibility={toggleVisibility}
            saving={saving}
          />
        </TabsContent>

        {/* International Section Editor */}
        <TabsContent value="international" className="mt-6">
          <InternationalEditor 
            section={getSectionByType('international')} 
            onSave={updateSection} 
            onToggleVisibility={toggleVisibility}
            saving={saving}
          />
        </TabsContent>

        {/* Testimonials Editor */}
        <TabsContent value="testimonials" className="mt-6">
          <TestimonialsEditor 
            section={getSectionByType('testimonials')} 
            onSave={updateSection} 
            onToggleVisibility={toggleVisibility}
            saving={saving}
          />
        </TabsContent>

        {/* CTA Strip Editor */}
        <TabsContent value="cta_strip" className="mt-6">
          <CTAStripEditor 
            section={getSectionByType('cta_strip')} 
            onSave={updateSection} 
            onToggleVisibility={toggleVisibility}
            saving={saving}
          />
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="mt-6">
          <SEOSettingsEditor pageId={HOME_PAGE_ID} pageName="Home Page" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Hero Section Editor Component
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
          <CardDescription>Main banner that appears at the top of the homepage</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleVisibility(section)}
          >
            {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Badge Text</Label>
            <Input
              value={content.badge || ""}
              onChange={(e) => setContent({ ...content, badge: e.target.value })}
              placeholder="Nepal's Leading Dental Care Destination"
            />
          </div>
          <div className="space-y-2">
            <Label>Headline Highlight (colored part)</Label>
            <Input
              value={content.headline_highlight || ""}
              onChange={(e) => setContent({ ...content, headline_highlight: e.target.value })}
              placeholder="Exceptional Value"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Headline</Label>
          <Input
            value={content.headline || ""}
            onChange={(e) => setContent({ ...content, headline: e.target.value })}
            placeholder="Exceptional Dental Care,"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={3}
            placeholder="Quality dental treatments at accessible prices..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary CTA Label</Label>
            <Input
              value={content.cta_primary?.label || ""}
              onChange={(e) => setContent({ 
                ...content, 
                cta_primary: { ...content.cta_primary, label: e.target.value }
              })}
              placeholder="Book Your Appointment"
            />
          </div>
          <div className="space-y-2">
            <Label>Primary CTA Link</Label>
            <Input
              value={content.cta_primary?.link || ""}
              onChange={(e) => setContent({ 
                ...content, 
                cta_primary: { ...content.cta_primary, link: e.target.value }
              })}
              placeholder="/contact"
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA Label</Label>
            <Input
              value={content.cta_secondary?.label || ""}
              onChange={(e) => setContent({ 
                ...content, 
                cta_secondary: { ...content.cta_secondary, label: e.target.value }
              })}
              placeholder="International Patient? Start Here"
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA Link</Label>
            <Input
              value={content.cta_secondary?.link || ""}
              onChange={(e) => setContent({ 
                ...content, 
                cta_secondary: { ...content.cta_secondary, link: e.target.value }
              })}
              placeholder="/dental-tourism"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <Label>Quick Stats (3 items)</Label>
          <div className="grid gap-4 md:grid-cols-3">
            {(content.stats || [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }]).map((stat: any, index: number) => (
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <Input
                  value={stat.value || ""}
                  onChange={(e) => {
                    const newStats = [...(content.stats || [])];
                    newStats[index] = { ...newStats[index], value: e.target.value };
                    setContent({ ...content, stats: newStats });
                  }}
                  placeholder="Value (e.g., 15)"
                />
                <Input
                  value={stat.label || ""}
                  onChange={(e) => {
                    const newStats = [...(content.stats || [])];
                    newStats[index] = { ...newStats[index], label: e.target.value };
                    setContent({ ...content, stats: newStats });
                  }}
                  placeholder="Label (e.g., Years Experience)"
                />
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => onSave(section.id, content)}
          disabled={saving === section.id}
        >
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Hero Section
        </Button>
      </CardContent>
    </Card>
  );
}

// Trust Indicators Editor
function TrustIndicatorsEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || { items: [] });

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="trust_indicators" />;

  const items = content.items || [];

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, items: newItems });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Trust Indicators</CardTitle>
          <CardDescription>Feature badges displayed below the hero section</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item: any, index: number) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-sm">
                {item.label || `Trust Indicator ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Icon Name</Label>
                  <Input
                    value={item.icon || ""}
                    onChange={(e) => updateItem(index, 'icon', e.target.value)}
                    placeholder="Stethoscope, Shield, Award, HeartPulse"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: Stethoscope, Shield, Award, HeartPulse, BadgeCheck, GraduationCap, Clock, Users
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={item.label || ""}
                    onChange={(e) => updateItem(index, 'label', e.target.value)}
                    placeholder="Advanced Technology"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description || ""}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Modern dental equipment"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Button 
          onClick={() => onSave(section.id, content)}
          disabled={saving === section.id}
        >
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Trust Indicators
        </Button>
      </CardContent>
    </Card>
  );
}

// Services Grid Editor
function ServicesGridEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="services_grid" />;

  const services = content.services || [];

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    setContent({ ...content, services: newServices });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Services Overview</CardTitle>
          <CardDescription>Featured services displayed on the homepage</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Section Badge</Label>
            <Input
              value={content.badge || ""}
              onChange={(e) => setContent({ ...content, badge: e.target.value })}
              placeholder="Our Expertise"
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Label</Label>
            <Input
              value={content.cta?.label || ""}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, label: e.target.value } })}
              placeholder="View All Services"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Headline</Label>
          <Input
            value={content.headline || ""}
            onChange={(e) => setContent({ ...content, headline: e.target.value })}
            placeholder="Premium Dental Services"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-3">
          <Label>Services (4 cards)</Label>
          <Accordion type="single" collapsible className="w-full">
            {services.map((service: any, index: number) => (
              <AccordionItem key={index} value={`service-${index}`}>
                <AccordionTrigger className="text-sm">
                  {service.title || `Service ${index + 1}`}
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Icon (emoji)</Label>
                      <Input
                        value={service.icon || ""}
                        onChange={(e) => updateService(index, 'icon', e.target.value)}
                        placeholder="🦷"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Highlight Tag</Label>
                      <Input
                        value={service.highlight || ""}
                        onChange={(e) => updateService(index, 'highlight', e.target.value)}
                        placeholder="Save up to 70%"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={service.title || ""}
                      onChange={(e) => updateService(index, 'title', e.target.value)}
                      placeholder="Dental Implants"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={service.description || ""}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Button 
          onClick={() => onSave(section.id, content)}
          disabled={saving === section.id}
        >
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Services Section
        </Button>
      </CardContent>
    </Card>
  );
}

// Why Choose Us Editor
function WhyChooseUsEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="why_choose_us" />;

  const items = content.items || [];
  const bullets = content.bullets || [];

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, items: newItems });
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    setContent({ ...content, bullets: newBullets });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Why Choose Us</CardTitle>
          <CardDescription>Benefits and features highlighting your clinic</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Badge</Label>
            <Input
              value={content.badge || ""}
              onChange={(e) => setContent({ ...content, badge: e.target.value })}
              placeholder="Why Kundalini Dental"
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Label</Label>
            <Input
              value={content.cta?.label || ""}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, label: e.target.value } })}
              placeholder="Learn About Our Clinic"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Headline</Label>
          <Input
            value={content.headline || ""}
            onChange={(e) => setContent({ ...content, headline: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-3">
          <Label>Bullet Points (checkmarks)</Label>
          {bullets.map((bullet: string, index: number) => (
            <Input
              key={index}
              value={bullet}
              onChange={(e) => updateBullet(index, e.target.value)}
              placeholder="Benefit point..."
            />
          ))}
        </div>

        <div className="space-y-3">
          <Label>Feature Cards (4 items)</Label>
          <Accordion type="single" collapsible className="w-full">
            {items.map((item: any, index: number) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-sm">
                  {item.title || `Feature ${index + 1}`}
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Input
                      value={item.icon || ""}
                      onChange={(e) => updateItem(index, 'icon', e.target.value)}
                      placeholder="BadgeCheck"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={item.title || ""}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description || ""}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Button 
          onClick={() => onSave(section.id, content)}
          disabled={saving === section.id}
        >
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Why Choose Us
        </Button>
      </CardContent>
    </Card>
  );
}

// Doctor Highlight Editor
function DoctorHighlightEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="doctor_highlight" />;

  const credentials = content.credentials || [];

  const updateCredential = (index: number, value: string) => {
    const newCredentials = [...credentials];
    newCredentials[index] = value;
    setContent({ ...content, credentials: newCredentials });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Doctor Highlight</CardTitle>
          <CardDescription>Featured doctor profile section</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Badge</Label>
            <Input
              value={content.badge || ""}
              onChange={(e) => setContent({ ...content, badge: e.target.value })}
              placeholder="Meet Your Doctor"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.subtitle || ""}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              placeholder="BDS • Managing Director"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Doctor Name</Label>
          <Input
            value={content.headline || ""}
            onChange={(e) => setContent({ ...content, headline: e.target.value })}
            placeholder="Dr. Nitin Aryal"
          />
        </div>

        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Experience Badge Value</Label>
            <Input
              value={content.experience_badge?.value || ""}
              onChange={(e) => setContent({ 
                ...content, 
                experience_badge: { ...content.experience_badge, value: e.target.value }
              })}
              placeholder="15+"
            />
          </div>
          <div className="space-y-2">
            <Label>Experience Badge Label</Label>
            <Input
              value={content.experience_badge?.label || ""}
              onChange={(e) => setContent({ 
                ...content, 
                experience_badge: { ...content.experience_badge, label: e.target.value }
              })}
              placeholder="Years of Excellence"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Credentials (checkmarks)</Label>
          {credentials.map((cred: string, index: number) => (
            <Input
              key={index}
              value={cred}
              onChange={(e) => updateCredential(index, e.target.value)}
              placeholder="Credential..."
            />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>CTA Label</Label>
            <Input
              value={content.cta?.label || ""}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, label: e.target.value } })}
              placeholder="View Full Profile"
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Link</Label>
            <Input
              value={content.cta?.link || ""}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, link: e.target.value } })}
              placeholder="/doctors"
            />
          </div>
        </div>

        <Button 
          onClick={() => onSave(section.id, content)}
          disabled={saving === section.id}
        >
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Doctor Section
        </Button>
      </CardContent>
    </Card>
  );
}

// International Editor
function InternationalEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="international" />;

  const benefits = content.benefits || [];

  const updateBenefit = (index: number, field: string, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    setContent({ ...content, benefits: newBenefits });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>International Patients</CardTitle>
          <CardDescription>Dental tourism benefits section</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input
            value={content.badge || ""}
            onChange={(e) => setContent({ ...content, badge: e.target.value })}
            placeholder="Dental Tourism"
          />
        </div>

        <div className="space-y-2">
          <Label>Headline</Label>
          <Input
            value={content.headline || ""}
            onChange={(e) => setContent({ ...content, headline: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-3">
          <Label>Benefits (4 cards)</Label>
          <Accordion type="single" collapsible className="w-full">
            {benefits.map((benefit: any, index: number) => (
              <AccordionItem key={index} value={`benefit-${index}`}>
                <AccordionTrigger className="text-sm">
                  {benefit.title || `Benefit ${index + 1}`}
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Input
                      value={benefit.icon || ""}
                      onChange={(e) => updateBenefit(index, 'icon', e.target.value)}
                      placeholder="Plane, Hotel, Globe, Phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={benefit.title || ""}
                      onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={benefit.description || ""}
                      onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>CTA Label</Label>
            <Input
              value={content.cta?.label || ""}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, label: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Link</Label>
            <Input
              value={content.cta?.link || ""}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, link: e.target.value } })}
            />
          </div>
        </div>

        <Button 
          onClick={() => onSave(section.id, content)}
          disabled={saving === section.id}
        >
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save International Section
        </Button>
      </CardContent>
    </Card>
  );
}

// Testimonials Editor
function TestimonialsEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="testimonials" />;

  const testimonials = content.testimonials || [];

  const updateTestimonial = (index: number, field: string, value: any) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setContent({ ...content, testimonials: newTestimonials });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Testimonials</CardTitle>
          <CardDescription>Patient reviews and stories</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Badge</Label>
            <Input
              value={content.badge || ""}
              onChange={(e) => setContent({ ...content, badge: e.target.value })}
              placeholder="Patient Stories"
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Label</Label>
            <Input
              value={content.cta?.label || ""}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, label: e.target.value } })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Headline</Label>
          <Input
            value={content.headline || ""}
            onChange={(e) => setContent({ ...content, headline: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-3">
          <Label>Testimonials</Label>
          <Accordion type="single" collapsible className="w-full">
            {testimonials.map((testimonial: any, index: number) => (
              <AccordionItem key={index} value={`testimonial-${index}`}>
                <AccordionTrigger className="text-sm">
                  {testimonial.name || `Testimonial ${index + 1}`}
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={testimonial.name || ""}
                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={testimonial.location || ""}
                        onChange={(e) => updateTestimonial(index, 'location', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Treatment</Label>
                      <Input
                        value={testimonial.treatment || ""}
                        onChange={(e) => updateTestimonial(index, 'treatment', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rating (1-5)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={testimonial.rating || 5}
                        onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Quote</Label>
                    <Textarea
                      value={testimonial.quote || ""}
                      onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                      rows={3}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Button 
          onClick={() => onSave(section.id, content)}
          disabled={saving === section.id}
        >
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Testimonials
        </Button>
      </CardContent>
    </Card>
  );
}

// CTA Strip Editor
function CTAStripEditor({ section, onSave, onToggleVisibility, saving }: {
  section?: PageSection;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  onToggleVisibility: (section: PageSection) => Promise<void>;
  saving: string | null;
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  if (!section) return <NoSectionMessage type="cta_strip" />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Final CTA Section</CardTitle>
          <CardDescription>Bottom call-to-action banner</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(section)}>
          {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Headline</Label>
          <Input
            value={content.headline || ""}
            onChange={(e) => setContent({ ...content, headline: e.target.value })}
            placeholder="Ready to Start Your Smile Journey?"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary CTA Label</Label>
            <Input
              value={content.cta_primary?.label || ""}
              onChange={(e) => setContent({ 
                ...content, 
                cta_primary: { ...content.cta_primary, label: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Primary CTA Link</Label>
            <Input
              value={content.cta_primary?.link || ""}
              onChange={(e) => setContent({ 
                ...content, 
                cta_primary: { ...content.cta_primary, link: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA Label</Label>
            <Input
              value={content.cta_secondary?.label || ""}
              onChange={(e) => setContent({ 
                ...content, 
                cta_secondary: { ...content.cta_secondary, label: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA Phone</Label>
            <Input
              value={content.cta_secondary?.phone || ""}
              onChange={(e) => setContent({ 
                ...content, 
                cta_secondary: { ...content.cta_secondary, phone: e.target.value }
              })}
              placeholder="+9779802808008"
            />
          </div>
        </div>

        <Button 
          onClick={() => onSave(section.id, content)}
          disabled={saving === section.id}
        >
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save CTA Section
        </Button>
      </CardContent>
    </Card>
  );
}

// No Section Message
function NoSectionMessage({ type }: { type: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">
          No {sectionLabels[type]?.label || type} section found in the database.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Please create this section in the Pages editor first.
        </p>
      </CardContent>
    </Card>
  );
}
