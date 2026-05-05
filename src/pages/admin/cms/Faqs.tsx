import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  page_slug: string | null;
  sort_order: number;
  is_visible: boolean;
}

const blank = { question: "", answer: "", category: "", page_slug: "", sort_order: 0, is_visible: true };

export default function Faqs() {
  const { toast } = useToast();
  const { logAction } = useAuditLog();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState<typeof blank>(blank);
  const [toDelete, setToDelete] = useState<Faq | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("faqs").select("*").order("category").order("sort_order");
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setFaqs((data || []) as Faq[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...blank, sort_order: faqs.length }); setOpen(true); };
  const openEdit = (f: Faq) => {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, category: f.category || "", page_slug: f.page_slug || "", sort_order: f.sort_order, is_visible: f.is_visible });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast({ title: "Question and answer are required", variant: "destructive" }); return;
    }
    setSaving(true);
    const payload = {
      question: form.question, answer: form.answer,
      category: form.category || null, page_slug: form.page_slug || null,
      sort_order: form.sort_order, is_visible: form.is_visible,
    };
    const op = editing
      ? supabase.from("faqs").update(payload).eq("id", editing.id).select().single()
      : supabase.from("faqs").insert(payload).select().single();
    const { data, error } = await op;
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Saved" });
      await logAction({ action: editing ? "update" : "create", entityType: "faq", entityId: data.id });
      setOpen(false); load();
    }
    setSaving(false);
  };

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("faqs").delete().eq("id", toDelete.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    await logAction({ action: "delete", entityType: "faq", entityId: toDelete.id });
    toast({ title: "Deleted" });
    setToDelete(null); load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">Frequently asked questions shown across the site.</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add FAQ</Button>
      </div>

      <div className="space-y-3">
        {faqs.map(f => (
          <Card key={f.id} className={!f.is_visible ? "opacity-60" : ""}>
            <CardContent className="py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                  {f.category && <span className="px-2 py-0.5 bg-muted rounded">{f.category}</span>}
                  {f.page_slug && <span>/{f.page_slug}</span>}
                  <span>Order: {f.sort_order}</span>
                </div>
                <p className="font-semibold">{f.question}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setToDelete(f)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {faqs.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No FAQs yet.</CardContent></Card>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Question *</Label>
              <Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
            </div>
            <div>
              <Label>Answer *</Label>
              <Textarea rows={5} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="general, treatments…" />
              </div>
              <div>
                <Label>Page Slug</Label>
                <Input value={form.page_slug} onChange={e => setForm(f => ({ ...f, page_slug: e.target.value }))} placeholder="faq, services…" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.is_visible} onCheckedChange={v => setForm(f => ({ ...f, is_visible: v }))} />
                <Label>Visible</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}{editing ? "Update" : "Add FAQ"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog open={!!toDelete} onOpenChange={o => !o && setToDelete(null)} onConfirm={remove} title="Delete FAQ" description="This will remove the FAQ." />
    </div>
  );
}
