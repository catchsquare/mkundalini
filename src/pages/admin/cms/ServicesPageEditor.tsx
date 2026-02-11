import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, Plus, Trash2, Edit, Eye, EyeOff, GripVertical, ChevronDown, ChevronUp, X, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SEOSettingsEditor } from "@/components/admin/cms/SEOSettingsEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  highlight: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

interface Service {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  short_description: string | null;
  price: string | null;
  comparison_price: string | null;
  duration: string | null;
  tourism_friendly: boolean;
  features: string[];
  image_url: string | null;
  image_alt: string | null;
  hero_badge: string | null;
  hero_title: string | null;
  hero_description: string | null;
  hero_image_url: string | null;
  body_content: string | null;
  faqs: Array<{ question: string; answer: string }>;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

const SERVICES_PAGE_ID = '11111111-0001-0001-0001-000000000003';

export default function ServicesPageEditor() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("categories");
  const { toast } = useToast();
  const { logAction } = useAuditLog();

  // Category dialog state
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', highlight: '', icon: '', image_url: '' });
  const [catSaving, setCatSaving] = useState(false);
  const [catDeleting, setCatDeleting] = useState<string | null>(null);

  // Service dialog state
  const [svcDialogOpen, setSvcDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [svcSaving, setSvcSaving] = useState(false);
  const [svcDeleting, setSvcDeleting] = useState<string | null>(null);
  const [svcForm, setSvcForm] = useState<Partial<Service>>({});

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [catRes, svcRes] = await Promise.all([
        supabase.from('service_categories').select('*').order('sort_order'),
        supabase.from('services').select('*').order('sort_order'),
      ]);
      if (catRes.error) throw catRes.error;
      if (svcRes.error) throw svcRes.error;
      setCategories(catRes.data as ServiceCategory[]);
      setServices((svcRes.data || []).map(s => ({
        ...s,
        features: s.features || [],
        faqs: (s.faqs as any) || [],
      })) as Service[]);
    } catch (error: any) {
      toast({ title: "Error loading data", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- CATEGORY CRUD ---
  const openCatDialog = (cat?: ServiceCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setCatForm({ name: cat.name, slug: cat.slug, description: cat.description || '', highlight: cat.highlight || '', icon: cat.icon || '', image_url: cat.image_url || '' });
    } else {
      setEditingCategory(null);
      setCatForm({ name: '', slug: '', description: '', highlight: '', icon: '', image_url: '' });
    }
    setCatDialogOpen(true);
  };

  const saveCat = async () => {
    if (!catForm.name || !catForm.slug) {
      toast({ title: "Name and slug are required", variant: "destructive" });
      return;
    }
    setCatSaving(true);
    try {
      if (editingCategory) {
        const { error } = await supabase.from('service_categories').update(catForm).eq('id', editingCategory.id);
        if (error) throw error;
        await logAction({ action: 'update', entityType: 'service_category', entityId: editingCategory.id, newValues: catForm });
      } else {
        const { error } = await supabase.from('service_categories').insert({ ...catForm, sort_order: categories.length });
        if (error) throw error;
        await logAction({ action: 'create', entityType: 'service_category', newValues: catForm });
      }
      toast({ title: `Category ${editingCategory ? 'updated' : 'created'}` });
      setCatDialogOpen(false);
      fetchAll();
    } catch (error: any) {
      toast({ title: "Error saving category", description: error.message, variant: "destructive" });
    } finally {
      setCatSaving(false);
    }
  };

  const deleteCat = async (id: string) => {
    try {
      const { error } = await supabase.from('service_categories').delete().eq('id', id);
      if (error) throw error;
      await logAction({ action: 'delete', entityType: 'service_category', entityId: id });
      toast({ title: "Category deleted" });
      fetchAll();
    } catch (error: any) {
      toast({ title: "Error deleting category", description: error.message, variant: "destructive" });
    }
  };

  // --- SERVICE CRUD ---
  const openSvcDialog = (svc?: Service) => {
    if (svc) {
      setEditingService(svc);
      setSvcForm({ ...svc });
    } else {
      setEditingService(null);
      setSvcForm({
        title: '', slug: '', category_id: categories[0]?.id || null,
        short_description: '', price: '', comparison_price: '', duration: '',
        tourism_friendly: false, features: [], image_url: '', image_alt: '',
        hero_badge: '', hero_title: '', hero_description: '', hero_image_url: '',
        body_content: '', faqs: [],
        seo_title: '', seo_description: '', og_image: '',
        is_active: true, is_featured: false, sort_order: services.length,
      });
    }
    setSvcDialogOpen(true);
  };

  const saveSvc = async () => {
    if (!svcForm.title || !svcForm.slug) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }
    setSvcSaving(true);
    try {
      const payload = { ...svcForm };
      if (editingService) {
        const { error } = await supabase.from('services').update(payload as any).eq('id', editingService.id);
        if (error) throw error;
        await logAction({ action: 'update', entityType: 'service', entityId: editingService.id, newValues: { title: svcForm.title } });
      } else {
        const { error } = await supabase.from('services').insert(payload as any);
        if (error) throw error;
        await logAction({ action: 'create', entityType: 'service', newValues: { title: svcForm.title } });
      }
      toast({ title: `Service ${editingService ? 'updated' : 'created'}` });
      setSvcDialogOpen(false);
      fetchAll();
    } catch (error: any) {
      toast({ title: "Error saving service", description: error.message, variant: "destructive" });
    } finally {
      setSvcSaving(false);
    }
  };

  const deleteSvc = async (id: string) => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      await logAction({ action: 'delete', entityType: 'service', entityId: id });
      toast({ title: "Service deleted" });
      fetchAll();
    } catch (error: any) {
      toast({ title: "Error deleting service", description: error.message, variant: "destructive" });
    }
  };

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
        <h1 className="text-2xl font-bold">Services Manager</h1>
        <p className="text-muted-foreground">
          Manage service categories and individual services. All content is dynamically rendered on the website.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="hero">Page Hero</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* CATEGORIES TAB */}
        <TabsContent value="categories" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Service Categories</h2>
            <Button onClick={() => openCatDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <Card key={cat.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-sm text-muted-foreground">{cat.description}</span>
                      {cat.highlight && (
                        <span className="text-xs text-primary">{cat.highlight}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {services.filter(s => s.category_id === cat.id).length} services
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => openCatDialog(cat)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => {
                      if (window.confirm(`Delete "${cat.name}"? Services in this category will be uncategorized.`)) deleteCat(cat.id);
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* SERVICES TAB */}
        <TabsContent value="services" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Services ({services.length})</h2>
            <Button onClick={() => openSvcDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Add Service
            </Button>
          </div>

          <div className="space-y-3">
            {categories.map(cat => {
              const catServices = services.filter(s => s.category_id === cat.id);
              if (catServices.length === 0) return null;
              return (
                <div key={cat.id}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat.name}</h3>
                  <div className="space-y-2">
                    {catServices.map(svc => (
                      <Card key={svc.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            {svc.image_url && (
                              <img src={svc.image_url} alt={svc.title} className="w-12 h-12 rounded object-cover" />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{svc.title}</span>
                                {svc.tourism_friendly && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Tourism</span>
                                )}
                                {!svc.is_active && (
                                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Inactive</span>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{svc.price} • {svc.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {svc.body_content && (
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Has detail page</span>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => openSvcDialog(svc)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => {
                              if (window.confirm(`Delete "${svc.title}"?`)) deleteSvc(svc.id);
                            }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
            {/* Uncategorized */}
            {(() => {
              const uncategorized = services.filter(s => !s.category_id);
              if (uncategorized.length === 0) return null;
              return (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Uncategorized</h3>
                  <div className="space-y-2">
                    {uncategorized.map(svc => (
                      <Card key={svc.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <span className="font-medium">{svc.title}</span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openSvcDialog(svc)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (window.confirm(`Delete "${svc.title}"?`)) deleteSvc(svc.id); }}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </TabsContent>

        {/* HERO TAB - uses existing page_sections */}
        <TabsContent value="hero" className="mt-6">
          <HeroEditor />
        </TabsContent>

        {/* SEO TAB */}
        <TabsContent value="seo" className="mt-6">
          <SEOSettingsEditor pageId={SERVICES_PAGE_ID} pageName="Services Page" />
        </TabsContent>
      </Tabs>

      {/* CATEGORY DIALOG */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })} placeholder="e.g. cosmetic-dentistry" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Highlight Badge</Label>
              <Input value={catForm.highlight} onChange={e => setCatForm({ ...catForm, highlight: e.target.value })} placeholder="e.g. Most Popular" />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={catForm.image_url} onChange={e => setCatForm({ ...catForm, image_url: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCat} disabled={catSaving}>
              {catSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SERVICE DIALOG */}
      <Dialog open={svcDialogOpen} onOpenChange={setSvcDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <ServiceForm
            form={svcForm}
            setForm={setSvcForm}
            categories={categories}
            saving={svcSaving}
            onSave={saveSvc}
            onCancel={() => setSvcDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Service Form Component
function ServiceForm({ form, setForm, categories, saving, onSave, onCancel }: {
  form: Partial<Service>;
  setForm: (f: Partial<Service>) => void;
  categories: ServiceCategory[];
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [activeSection, setActiveSection] = useState("basic");

  const updateField = (key: string, value: any) => setForm({ ...form, [key]: value });

  const addFeature = () => updateField('features', [...(form.features || []), '']);
  const removeFeature = (i: number) => updateField('features', (form.features || []).filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) => {
    const f = [...(form.features || [])];
    f[i] = val;
    updateField('features', f);
  };

  const addFaq = () => updateField('faqs', [...(form.faqs || []), { question: '', answer: '' }]);
  const removeFaq = (i: number) => updateField('faqs', (form.faqs || []).filter((_, idx) => idx !== i));
  const updateFaq = (i: number, key: 'question' | 'answer', val: string) => {
    const f = [...(form.faqs || [])];
    f[i] = { ...f[i], [key]: val };
    updateField('faqs', f);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="detail">Detail Page</TabsTrigger>
          <TabsTrigger value="content">Rich Content</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title || ''} onChange={e => updateField('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={form.slug || ''} onChange={e => updateField('slug', e.target.value)} placeholder="e.g. dental-implants" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category_id || ''} onValueChange={v => updateField('category_id', v)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Short Description</Label>
            <Textarea value={form.short_description || ''} onChange={e => updateField('short_description', e.target.value)} rows={2} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input value={form.price || ''} onChange={e => updateField('price', e.target.value)} placeholder="From $350" />
            </div>
            <div className="space-y-2">
              <Label>Comparison Price</Label>
              <Input value={form.comparison_price || ''} onChange={e => updateField('comparison_price', e.target.value)} placeholder="$3,000+ in USA" />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input value={form.duration || ''} onChange={e => updateField('duration', e.target.value)} placeholder="2-3 visits" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.tourism_friendly || false} onCheckedChange={v => updateField('tourism_friendly', v)} />
              <Label>Tourism Friendly</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active !== false} onCheckedChange={v => updateField('is_active', v)} />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_featured || false} onCheckedChange={v => updateField('is_featured', v)} />
              <Label>Featured</Label>
            </div>
          </div>

          {/* Image */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Card Image URL</Label>
              <Input value={form.image_url || ''} onChange={e => updateField('image_url', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Image Alt Text</Label>
              <Input value={form.image_alt || ''} onChange={e => updateField('image_alt', e.target.value)} />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Features</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            {(form.features || []).map((f, i) => (
              <div key={i} className="flex gap-2">
                <Input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder="Feature text" />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(i)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detail" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">These fields appear on the individual service detail page (e.g. /services/dental-implants).</p>
          <div className="space-y-2">
            <Label>Hero Badge</Label>
            <Input value={form.hero_badge || ''} onChange={e => updateField('hero_badge', e.target.value)} placeholder="#1 Treatment for Dental Tourism" />
          </div>
          <div className="space-y-2">
            <Label>Hero Title</Label>
            <Input value={form.hero_title || ''} onChange={e => updateField('hero_title', e.target.value)} placeholder="Dental Implants" />
          </div>
          <div className="space-y-2">
            <Label>Hero Description</Label>
            <Textarea value={form.hero_description || ''} onChange={e => updateField('hero_description', e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Hero Image URL</Label>
            <Input value={form.hero_image_url || ''} onChange={e => updateField('hero_image_url', e.target.value)} />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">Rich content for the service detail page. Use the toolbar to format text and add images.</p>
          <RichTextEditor
            content={form.body_content || ''}
            onChange={html => updateField('body_content', html)}
            placeholder="Write detailed service content here..."
          />
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <Label>FAQs</Label>
            <Button type="button" variant="outline" size="sm" onClick={addFaq}>
              <Plus className="w-3 h-3 mr-1" /> Add FAQ
            </Button>
          </div>
          {(form.faqs || []).map((faq, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Label>Question {i + 1}</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)} placeholder="Question" />
                <Textarea value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} placeholder="Answer" rows={3} />
              </CardContent>
            </Card>
          ))}
          {(!form.faqs || form.faqs.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-8">No FAQs added yet. Click "Add FAQ" to create one.</p>
          )}
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input value={form.seo_title || ''} onChange={e => updateField('seo_title', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>SEO Description</Label>
            <Textarea value={form.seo_description || ''} onChange={e => updateField('seo_description', e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>OG Image URL</Label>
            <Input value={form.og_image || ''} onChange={e => updateField('og_image', e.target.value)} />
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Service
        </Button>
      </DialogFooter>
    </div>
  );
}

// Hero section editor using existing page_sections
function HeroEditor() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();
  const { logAction } = useAuditLog();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_id', SERVICES_PAGE_ID)
      .order('sort_order');
    if (!error) setSections(data || []);
    setLoading(false);
  };

  const updateSection = async (id: string, content: Record<string, any>) => {
    setSaving(id);
    try {
      const { error } = await supabase.from('page_sections').update({ content }).eq('id', id);
      if (error) throw error;
      await logAction({ action: 'update', entityType: 'page_section', entityId: id, newValues: content });
      toast({ title: "Section updated" });
      fetchSections();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin" />;

  const hero = sections.find(s => s.section_type === 'hero');
  const tourism = sections.find(s => s.section_type === 'tourism_highlight');

  return (
    <div className="space-y-6">
      {hero && <SectionEditor section={hero} title="Hero Section" saving={saving} onSave={updateSection} fields={['badge', 'title', 'titleHighlight', 'description']} />}
      {tourism && <SectionEditor section={tourism} title="Tourism Highlight" saving={saving} onSave={updateSection} fields={['badge', 'title', 'description', 'ctaLabel', 'ctaLink']} />}
    </div>
  );
}

function SectionEditor({ section, title, saving, onSave, fields }: {
  section: any; title: string; saving: string | null;
  onSave: (id: string, content: Record<string, any>) => Promise<void>;
  fields: string[];
}) {
  const [content, setContent] = useState<Record<string, any>>(section?.content || {});

  useEffect(() => {
    if (section?.content) setContent(section.content);
  }, [section]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map(field => (
          <div key={field} className="space-y-2">
            <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
            {field.includes('description') ? (
              <Textarea value={content[field] || ''} onChange={e => setContent({ ...content, [field]: e.target.value })} rows={3} />
            ) : (
              <Input value={content[field] || ''} onChange={e => setContent({ ...content, [field]: e.target.value })} />
            )}
          </div>
        ))}
        <Button onClick={() => onSave(section.id, content)} disabled={saving === section.id}>
          {saving === section.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
