import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";

interface Block {
  id: string;
  page_slug: string;
  block_key: string;
  title: string | null;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  image_alt: string | null;
  link_url: string | null;
  link_label: string | null;
  is_visible: boolean;
  sort_order: number;
}

const PAGE_SLUGS = ["home","about","services","doctors","pricing","reviews","contact","dental-tourism"];

export default function ContentBlocks() {
  const { toast } = useToast();
  const { logAction } = useAuditLog();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState(PAGE_SLUGS[0]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Block | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_blocks").select("*").order("page_slug").order("block_key").order("sort_order");
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setBlocks((data || []) as Block[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const update = (id: string, patch: Partial<Block>) =>
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));

  const save = async (block: Block) => {
    setSavingId(block.id);
    const { id, ...rest } = block;
    const isNew = id.startsWith("new-");
    const op = isNew
      ? supabase.from("content_blocks").insert(rest).select().single()
      : supabase.from("content_blocks").update(rest).eq("id", id).select().single();
    const { data, error } = await op;
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Saved" });
      await logAction({ action: isNew ? "create" : "update", entityType: "content_block", entityId: data.id });
      if (isNew) setBlocks(prev => prev.map(b => b.id === id ? (data as Block) : b));
    }
    setSavingId(null);
  };

  const remove = async () => {
    if (!toDelete) return;
    if (!toDelete.id.startsWith("new-")) {
      const { error } = await supabase.from("content_blocks").delete().eq("id", toDelete.id);
      if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
      await logAction({ action: "delete", entityType: "content_block", entityId: toDelete.id });
    }
    setBlocks(prev => prev.filter(b => b.id !== toDelete.id));
    setToDelete(null);
    toast({ title: "Deleted" });
  };

  const addBlock = (slug: string, blockKey: string) => {
    const sortOrder = blocks.filter(b => b.page_slug === slug && b.block_key === blockKey).length;
    const tmp: Block = {
      id: `new-${Date.now()}`, page_slug: slug, block_key: blockKey,
      title: "", description: "", icon: "", image_url: "", image_alt: "",
      link_url: "", link_label: "", is_visible: true, sort_order: sortOrder,
    };
    setBlocks(prev => [...prev, tmp]);
  };

  const grouped = useMemo(() => {
    const pageBlocks = blocks.filter(b => b.page_slug === activeSlug);
    return pageBlocks.reduce<Record<string, Block[]>>((acc, b) => {
      (acc[b.block_key] = acc[b.block_key] || []).push(b);
      return acc;
    }, {});
  }, [blocks, activeSlug]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Blocks</h1>
        <p className="text-muted-foreground">Edit reusable content sections grouped by page.</p>
      </div>

      <Tabs value={activeSlug} onValueChange={setActiveSlug}>
        <TabsList className="flex-wrap h-auto">
          {PAGE_SLUGS.map(s => <TabsTrigger key={s} value={s} className="capitalize">{s.replace("-", " ")}</TabsTrigger>)}
        </TabsList>

        {PAGE_SLUGS.map(slug => (
          <TabsContent key={slug} value={slug} className="space-y-4">
            <NewKeyForm onAdd={(k) => addBlock(slug, k)} existing={Object.keys(grouped)} />
            {Object.entries(grouped).map(([key, items]) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-mono">{key}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => addBlock(slug, key)}>
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(b => (
                    <div key={b.id} className="border rounded-lg p-4 space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label>Title</Label>
                          <Input value={b.title || ""} onChange={e => update(b.id, { title: e.target.value })} />
                        </div>
                        <div>
                          <Label>Icon (lucide name, e.g. "Shield")</Label>
                          <Input value={b.icon || ""} onChange={e => update(b.id, { icon: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea rows={2} value={b.description || ""} onChange={e => update(b.id, { description: e.target.value })} />
                      </div>
                      <ImageUploader value={b.image_url || ""} onChange={url => update(b.id, { image_url: url })} folder={`blocks/${slug}`} label="Image (optional)" />
                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <Label>Image Alt</Label>
                          <Input value={b.image_alt || ""} onChange={e => update(b.id, { image_alt: e.target.value })} />
                        </div>
                        <div>
                          <Label>Link Label</Label>
                          <Input value={b.link_label || ""} onChange={e => update(b.id, { link_label: e.target.value })} />
                        </div>
                        <div>
                          <Label>Link URL</Label>
                          <Input value={b.link_url || ""} onChange={e => update(b.id, { link_url: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch checked={b.is_visible} onCheckedChange={v => update(b.id, { is_visible: v })} />
                            <Label>Visible</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Order</Label>
                            <Input type="number" className="w-20" value={b.sort_order} onChange={e => update(b.id, { sort_order: parseInt(e.target.value) || 0 })} />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setToDelete(b)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                          <Button size="sm" onClick={() => save(b)} disabled={savingId === b.id}>
                            {savingId === b.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
            {Object.keys(grouped).length === 0 && (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No blocks for this page yet.</CardContent></Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <DeleteConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} onConfirm={remove} title="Delete Block" description="This will remove the content block." />
    </div>
  );
}

function NewKeyForm({ onAdd, existing }: { onAdd: (key: string) => void; existing: string[] }) {
  const [key, setKey] = useState("");
  return (
    <Card>
      <CardContent className="pt-6 flex gap-2 items-end">
        <div className="flex-1">
          <Label>New Block Group Key</Label>
          <Input value={key} onChange={e => setKey(e.target.value)} placeholder="e.g. core_values, milestones" />
        </div>
        <Button onClick={() => { if (key.trim()) { onAdd(key.trim()); setKey(""); } }} disabled={!key.trim() || existing.includes(key.trim())}>
          <Plus className="w-4 h-4 mr-1" /> Create Group
        </Button>
      </CardContent>
    </Card>
  );
}
