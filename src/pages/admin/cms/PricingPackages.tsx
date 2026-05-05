import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";

interface Pkg {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: string;
  comparison_price: string | null;
  currency: string | null;
  period: string | null;
  features: string[] | null;
  is_popular: boolean;
  is_visible: boolean;
  cta_label: string | null;
  cta_link: string | null;
  sort_order: number;
}

const blank = {
  name: "", category: "", description: "", price: "", comparison_price: "",
  currency: "NPR", period: "", features: [] as string[], is_popular: false,
  is_visible: true, cta_label: "Book Now", cta_link: "/contact", sort_order: 0,
};

export default function PricingPackages() {
  const { toast } = useToast();
  const { logAction } = useAuditLog();
  const [items, setItems] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [form, setForm] = useState(blank);
  const [featureInput, setFeatureInput] = useState("");
  const [toDelete, setToDelete] = useState<Pkg | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("pricing_packages").select("*").order("sort_order");
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setItems((data || []) as Pkg[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...blank, sort_order: items.length }); setOpen(true); };
  const openEdit = (p: Pkg) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category || "", description: p.description || "",
      price: p.price, comparison_price: p.comparison_price || "",
      currency: p.currency || "NPR", period: p.period || "",
      features: p.features || [], is_popular: p.is_popular, is_visible: p.is_visible,
      cta_label: p.cta_label || "Book Now", cta_link: p.cta_link || "/contact",
      sort_order: p.sort_order,
    });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      toast({ title: "Name and price are required", variant: "destructive" }); return;
    }
    setSaving(true);
    const payload = {
      name: form.name, category: form.category || null,
      description: form.description || null, price: form.price,
      comparison_price: form.comparison_price || null,
      currency: form.currency || null, period: form.period || null,
      features: form.features, is_popular: form.is_popular, is_visible: form.is_visible,
      cta_label: form.cta_label || null, cta_link: form.cta_link || null,
      sort_order: form.sort_order,
    };
    const op = editing
      ? supabase.from("pricing_packages").update(payload).eq("id", editing.id).select().single()
      : supabase.from("pricing_packages").insert(payload).select().single();
    const { data, error } = await op;
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Saved" });
      await logAction({ action: editing ? "update" : "create", entityType: "pricing_package", entityId: data.id });
      setOpen(false); load();
    }
    setSaving(false);
  };

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("pricing_packages").delete().eq("id", toDelete.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    await logAction({ action: "delete", entityType: "pricing_package", entityId: toDelete.id });
    toast({ title: "Deleted" });
    setToDelete(null); load();
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
    setFeatureInput("");
  };
  const removeFeature = (i: number) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pricing Packages</h1>
          <p className="text-muted-foreground">Manage pricing tiers shown on the Pricing page.</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add Package</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map(p => (
          <Card key={p.id} className={!p.is_visible ? "opacity-60" : ""}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {p.is_popular && <span className="px-2 py-0.5 text-xs rounded bg-primary text-primary-foreground">Popular</span>}
                    {p.category && <span className="px-2 py-0.5 text-xs rounded bg-muted">{p.category}</span>}
                  </div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  <p className="font-bold text-primary mt-1">{p.currency} {p.price} {p.period}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.features?.length || 0} features</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setToDelete(p)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <Card className="md:col-span-2"><CardContent className="py-12 text-center text-muted-foreground">No packages yet.</CardContent></Card>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Package" : "Add Package"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
            </div>
            <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="grid grid-cols-4 gap-4">
              <div><Label>Currency</Label><Input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} /></div>
              <div><Label>Price *</Label><Input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="50,000" /></div>
              <div><Label>Comparison Price</Label><Input value={form.comparison_price} onChange={e => setForm(f => ({ ...f, comparison_price: e.target.value }))} /></div>
              <div><Label>Period</Label><Input value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="/treatment" /></div>
            </div>

            <div>
              <Label>Features</Label>
              <div className="flex gap-2 mt-1">
                <Input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Add a feature and press Enter" />
                <Button type="button" variant="outline" onClick={addFeature}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.features.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-sm">
                    {f}<button type="button" onClick={() => removeFeature(i)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><Label>CTA Label</Label><Input value={form.cta_label} onChange={e => setForm(f => ({ ...f, cta_label: e.target.value }))} /></div>
              <div><Label>CTA Link</Label><Input value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} /></div>
              <div><Label>Display Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} /></div>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_popular} onCheckedChange={v => setForm(f => ({ ...f, is_popular: v }))} /><Label>Popular</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_visible} onCheckedChange={v => setForm(f => ({ ...f, is_visible: v }))} /><Label>Visible</Label></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}{editing ? "Update" : "Add"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog open={!!toDelete} onOpenChange={o => !o && setToDelete(null)} onConfirm={remove} title="Delete Package" description="This will remove the pricing package." />
    </div>
  );
}
