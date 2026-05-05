import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface Legal {
  id: string;
  slug: string;
  title: string;
  content: string;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  last_updated: string | null;
}

const SLUGS = ["privacy", "terms", "refund"];

export default function LegalPages() {
  const { toast } = useToast();
  const { logAction } = useAuditLog();
  const [pages, setPages] = useState<Record<string, Legal>>({});
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [active, setActive] = useState(SLUGS[0]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("legal_pages").select("*").in("slug", SLUGS);
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    const map: Record<string, Legal> = {};
    (data || []).forEach((p: any) => { map[p.slug] = p; });
    setPages(map); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const update = (slug: string, patch: Partial<Legal>) =>
    setPages(prev => ({ ...prev, [slug]: { ...prev[slug], ...patch } }));

  const save = async (slug: string) => {
    const p = pages[slug];
    if (!p) return;
    setSavingSlug(slug);
    const payload = {
      slug, title: p.title || slug, content: p.content || "",
      seo_title: p.seo_title || null, seo_description: p.seo_description || null,
      is_published: p.is_published, last_updated: new Date().toISOString().slice(0, 10),
    };
    const op = p.id
      ? supabase.from("legal_pages").update(payload).eq("id", p.id)
      : supabase.from("legal_pages").insert(payload);
    const { error } = await op;
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Saved" });
      await logAction({ action: "update", entityType: "legal_page", entityId: p.id, newValues: payload });
      load();
    }
    setSavingSlug(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Legal Pages</h1>
        <p className="text-muted-foreground">Privacy Policy, Terms of Service, and Refund Policy.</p>
      </div>

      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          {SLUGS.map(s => <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>)}
        </TabsList>

        {SLUGS.map(slug => {
          const p = pages[slug] || ({ id: "", slug, title: "", content: "", seo_title: "", seo_description: "", is_published: true, last_updated: null } as Legal);
          return (
            <TabsContent key={slug} value={slug} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{slug} Policy</CardTitle>
                  <CardDescription>Page slug: /{slug}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input value={p.title} onChange={e => update(slug, { title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <RichTextEditor content={p.content || ""} onChange={html => update(slug, { content: html })} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>SEO Title</Label>
                      <Input value={p.seo_title || ""} onChange={e => update(slug, { seo_title: e.target.value })} />
                    </div>
                    <div>
                      <Label>SEO Description</Label>
                      <Textarea rows={2} value={p.seo_description || ""} onChange={e => update(slug, { seo_description: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Switch checked={p.is_published} onCheckedChange={v => update(slug, { is_published: v })} />
                      <Label>Published</Label>
                    </div>
                    <Button onClick={() => save(slug)} disabled={savingSlug === slug}>
                      {savingSlug === slug ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
