import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";

interface HeroSlide {
  id: string;
  page_slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  badge_text: string | null;
  image_url: string | null;
  image_alt: string | null;
  cta_label: string | null;
  cta_link: string | null;
  secondary_cta_label: string | null;
  secondary_cta_link: string | null;
  is_visible: boolean;
  sort_order: number;
}

const PAGE_SLUGS = [
  "home", "about", "services", "doctors", "pricing",
  "reviews", "contact", "dental-tourism", "faq",
];

const blank = (slug: string): Omit<HeroSlide, "id"> => ({
  page_slug: slug, title: "", subtitle: "", description: "", badge_text: "",
  image_url: "", image_alt: "", cta_label: "", cta_link: "",
  secondary_cta_label: "", secondary_cta_link: "", is_visible: true, sort_order: 0,
});

export default function HeroSlides() {
  const { toast } = useToast();
  const { logAction } = useAuditLog();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<HeroSlide | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hero_slides").select("*").order("page_slug").order("sort_order");
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setSlides((data || []) as HeroSlide[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const update = (id: string, patch: Partial<HeroSlide>) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const save = async (slide: HeroSlide) => {
    setSavingId(slide.id);
    const { id, ...rest } = slide;
    const payload = { ...rest, title: rest.title || "Untitled" };
    const isNew = id.startsWith("new-");
    const op = isNew
      ? supabase.from("hero_slides").insert(payload).select().single()
      : supabase.from("hero_slides").update(payload).eq("id", id).select().single();
    const { data, error } = await op;
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved" });
      await logAction({ action: isNew ? "create" : "update", entityType: "hero_slide", entityId: data.id, newValues: payload });
      if (isNew) setSlides(prev => prev.map(s => s.id === id ? (data as HeroSlide) : s));
    }
    setSavingId(null);
  };

  const remove = async () => {
    if (!toDelete) return;
    if (!toDelete.id.startsWith("new-")) {
      const { error } = await supabase.from("hero_slides").delete().eq("id", toDelete.id);
      if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
      await logAction({ action: "delete", entityType: "hero_slide", entityId: toDelete.id });
    }
    setSlides(prev => prev.filter(s => s.id !== toDelete.id));
    toast({ title: "Deleted" });
    setToDelete(null);
  };

  const addSlide = (slug: string) => {
    const tmp: HeroSlide = { id: `new-${Date.now()}`, ...blank(slug) } as HeroSlide;
    setSlides(prev => [...prev, tmp]);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hero Slides</h1>
        <p className="text-muted-foreground">Edit the hero/banner section for each page.</p>
      </div>

      {PAGE_SLUGS.map(slug => {
        const pageSlides = slides.filter(s => s.page_slug === slug);
        return (
          <Card key={slug}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="capitalize">{slug.replace("-", " ")} Page</CardTitle>
                  <CardDescription>/{slug === "home" ? "" : slug}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => addSlide(slug)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Slide
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {pageSlides.length === 0 && (
                <p className="text-sm text-muted-foreground">No slide configured. Click "Add Slide".</p>
              )}
              {pageSlides.map(slide => (
                <div key={slide.id} className="border rounded-lg p-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Badge Text</Label>
                      <Input value={slide.badge_text || ""} onChange={e => update(slide.id, { badge_text: e.target.value })} placeholder="e.g. Trusted Since 1995" />
                    </div>
                    <div>
                      <Label>Title *</Label>
                      <Input value={slide.title} onChange={e => update(slide.id, { title: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input value={slide.subtitle || ""} onChange={e => update(slide.id, { subtitle: e.target.value })} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea rows={3} value={slide.description || ""} onChange={e => update(slide.id, { description: e.target.value })} />
                  </div>
                  <ImageUploader value={slide.image_url || ""} onChange={url => update(slide.id, { image_url: url })} folder={`hero/${slug}`} label="Hero Image" />
                  <div>
                    <Label>Image Alt Text</Label>
                    <Input value={slide.image_alt || ""} onChange={e => update(slide.id, { image_alt: e.target.value })} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Primary CTA Label</Label>
                      <Input value={slide.cta_label || ""} onChange={e => update(slide.id, { cta_label: e.target.value })} />
                    </div>
                    <div>
                      <Label>Primary CTA Link</Label>
                      <Input value={slide.cta_link || ""} onChange={e => update(slide.id, { cta_link: e.target.value })} />
                    </div>
                    <div>
                      <Label>Secondary CTA Label</Label>
                      <Input value={slide.secondary_cta_label || ""} onChange={e => update(slide.id, { secondary_cta_label: e.target.value })} />
                    </div>
                    <div>
                      <Label>Secondary CTA Link</Label>
                      <Input value={slide.secondary_cta_link || ""} onChange={e => update(slide.id, { secondary_cta_link: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Switch checked={slide.is_visible} onCheckedChange={v => update(slide.id, { is_visible: v })} />
                      <Label>Visible</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setToDelete(slide)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                      <Button size="sm" onClick={() => save(slide)} disabled={savingId === slide.id}>
                        {savingId === slide.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      <DeleteConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} onConfirm={remove} title="Delete Hero Slide" description="This will remove the hero slide." />
    </div>
  );
}
