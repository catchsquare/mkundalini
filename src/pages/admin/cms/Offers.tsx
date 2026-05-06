import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Tag,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  badge_text: string | null;
  cta_label: string | null;
  cta_link: string | null;
  image_url: string | null;
  image_alt: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function Offers() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge_text: "",
    cta_label: "Learn More",
    cta_link: "/contact",
    image_url: "",
    image_alt: "",
    status: "active",
    sort_order: 0,
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setOffers(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading offers",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    return (
      offer.title.toLowerCase().includes(search.toLowerCase()) ||
      offer.badge_text?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      badge_text: "",
      cta_label: "Learn More",
      cta_link: "/contact",
      image_url: "",
      image_alt: "",
      status: "active",
      sort_order: offers.length,
    });
    setSelectedOffer(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (offer: Offer) => {
    setSelectedOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || "",
      badge_text: offer.badge_text || "",
      cta_label: offer.cta_label || "Learn More",
      cta_link: offer.cta_link || "/contact",
      image_url: offer.image_url || "",
      image_alt: offer.image_alt || "",
      status: offer.status,
      sort_order: offer.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter an offer title",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const offerData = {
        title: formData.title,
        description: formData.description || null,
        badge_text: formData.badge_text || null,
        cta_label: formData.cta_label || "Learn More",
        cta_link: formData.cta_link || "/contact",
        image_url: formData.image_url || null,
        image_alt: formData.image_alt || null,
        status: formData.status,
        sort_order: formData.sort_order,
      };

      if (selectedOffer) {
        const { error } = await supabase
          .from("offers")
          .update(offerData)
          .eq("id", selectedOffer.id);
        if (error) throw error;

        await logAction({
          action: "update",
          entityType: "offer",
          entityId: selectedOffer.id,
          newValues: offerData,
        });
        toast({ title: "Offer updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("offers")
          .insert(offerData)
          .select()
          .single();
        if (error) throw error;

        await logAction({
          action: "create",
          entityType: "offer",
          entityId: data.id,
          newValues: offerData,
        });
        toast({ title: "Offer created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchOffers();
    } catch (error: any) {
      toast({
        title: "Error saving offer",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedOffer) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("offers").delete().eq("id", selectedOffer.id);
      if (error) throw error;

      await logAction({
        action: "delete",
        entityType: "offer",
        entityId: selectedOffer.id,
      });
      toast({ title: "Offer deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedOffer(null);
      fetchOffers();
    } catch (error: any) {
      toast({
        title: "Error deleting offer",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (offer: Offer) => {
    try {
      const newStatus = offer.status === "active" ? "draft" : "active";
      const { error } = await supabase
        .from("offers")
        .update({ status: newStatus })
        .eq("id", offer.id);
      if (error) throw error;
      fetchOffers();
      toast({ title: `Offer ${newStatus === "active" ? "activated" : "deactivated"}` });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offers</h1>
          <p className="text-muted-foreground">Manage promotional offers displayed on the website</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Offer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Tag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-4">No offers found</p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Offer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOffers.map((offer, index) => (
            <Card key={offer.id} className={offer.status !== "active" ? "opacity-60" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {offer.badge_text && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {offer.badge_text}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        offer.status === "active" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {offer.status === "active" ? "Active" : "Draft"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground truncate">{offer.title}</h3>
                    {offer.description && (
                      <p className="text-sm text-muted-foreground truncate">{offer.description}</p>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      CTA: {offer.cta_label} → {offer.cta_link}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(offer)}
                      title={offer.status === "active" ? "Deactivate" : "Activate"}
                    >
                      {offer.status === "active" ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(offer)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedOffer(offer);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Offer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedOffer ? "Edit Offer" : "Add Offer"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="20% OFF on All Dental Implants"
              />
            </div>

            <div>
              <Label>Badge Text</Label>
              <Input
                value={formData.badge_text}
                onChange={(e) => setFormData((prev) => ({ ...prev, badge_text: e.target.value }))}
                placeholder="Limited Time Offer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Short label shown before the title (e.g., "Limited Time", "New Year Special")
              </p>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the offer..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CTA Label</Label>
                <Input
                  value={formData.cta_label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cta_label: e.target.value }))}
                  placeholder="Book Now"
                />
              </div>
              <div>
                <Label>CTA Link</Label>
                <Input
                  value={formData.cta_link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cta_link: e.target.value }))}
                  placeholder="/contact"
                />
              </div>
            </div>

            <div>
              <Label>Image URL (optional)</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            {formData.image_url && (
              <div>
                <Label>Image Alt Text *</Label>
                <Input
                  value={formData.image_alt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_alt: e.target.value }))}
                  placeholder="Description of the image"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedOffer ? "Update" : "Add Offer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isSubmitting}
        title="Delete Offer"
        description="Are you sure you want to delete this offer? This action cannot be undone."
      />
    </div>
  );
}
