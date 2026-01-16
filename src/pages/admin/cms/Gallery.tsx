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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Image,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { usePagination } from "@/hooks/use-pagination";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";
import { Checkbox } from "@/components/ui/checkbox";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  before_image: string;
  after_image: string;
  category_id: string | null;
  treatment_id: string | null;
  dentist_id: string | null;
  is_visible: boolean;
  is_featured: boolean;
  consent_obtained: boolean;
  tags: string[] | null;
  sort_order: number | null;
  created_at: string;
  category?: { name: string } | null;
}

interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
}

export default function Gallery() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    before_image: "",
    after_image: "",
    category_id: "",
    is_visible: true,
    is_featured: false,
    consent_obtained: false,
    tags: "",
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select(`*, category:gallery_categories(name)`)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setItems(data as unknown as GalleryItem[] || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("gallery_categories")
      .select("*")
      .order("sort_order");
    setCategories(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const itemData = {
        title: formData.title,
        description: formData.description || null,
        before_image: formData.before_image,
        after_image: formData.after_image,
        category_id: formData.category_id || null,
        is_visible: formData.is_visible,
        is_featured: formData.is_featured,
        consent_obtained: formData.consent_obtained,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : null,
      };

      if (selectedItem) {
        const { error } = await supabase
          .from("gallery_items")
          .update(itemData)
          .eq("id", selectedItem.id);

        if (error) throw error;

        await logAction({
          action: "update",
          entityType: "gallery_item",
          entityId: selectedItem.id,
          oldValues: selectedItem,
          newValues: itemData,
        });

        toast({ title: "Gallery item updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("gallery_items")
          .insert([itemData])
          .select()
          .single();

        if (error) throw error;

        await logAction({
          action: "create",
          entityType: "gallery_item",
          entityId: data.id,
          newValues: itemData,
        });

        toast({ title: "Gallery item added successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", selectedItem.id);

      if (error) throw error;

      await logAction({
        action: "delete",
        entityType: "gallery_item",
        entityId: selectedItem.id,
        oldValues: selectedItem,
      });

      toast({ title: "Gallery item deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      fetchItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVisibility = async (id: string, visible: boolean) => {
    try {
      const { error } = await supabase
        .from("gallery_items")
        .update({ is_visible: visible })
        .eq("id", id);

      if (error) throw error;
      toast({ title: visible ? "Item is now visible" : "Item hidden" });
      fetchItems();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from("gallery_items")
        .update({ is_featured: featured })
        .eq("id", id);

      if (error) throw error;
      toast({ title: featured ? "Marked as featured" : "Removed from featured" });
      fetchItems();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      before_image: "",
      after_image: "",
      category_id: "",
      is_visible: true,
      is_featured: false,
      consent_obtained: false,
      tags: "",
    });
    setSelectedItem(null);
  };

  const openEditDialog = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      before_image: item.before_image,
      after_image: item.after_image,
      category_id: item.category_id || "",
      is_visible: item.is_visible,
      is_featured: item.is_featured,
      consent_obtained: item.consent_obtained || false,
      tags: item.tags?.join(", ") || "",
    });
    setIsDialogOpen(true);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const {
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    goToPage,
    setPageSize,
    startIndex,
    endIndex,
  } = usePagination(filteredItems, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Before/After Gallery</h1>
          <p className="text-muted-foreground">Manage treatment result photos</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Case
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Cases</p>
          <p className="text-2xl font-bold">{items.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Visible</p>
          <p className="text-2xl font-bold text-green-600">
            {items.filter((i) => i.is_visible).length}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Featured</p>
          <p className="text-2xl font-bold text-primary">
            {items.filter((i) => i.is_featured).length}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search gallery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No gallery items found</p>
          </div>
        ) : (
          paginatedData.map((item) => (
            <div
              key={item.id}
              className={`bg-card border rounded-xl overflow-hidden ${
                !item.is_visible ? "opacity-60" : ""
              }`}
            >
              <div className="grid grid-cols-2 gap-1">
                <div className="aspect-square bg-muted relative">
                  <img
                    src={item.before_image}
                    alt="Before"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    Before
                  </span>
                </div>
                <div className="aspect-square bg-muted relative">
                  <img
                    src={item.after_image}
                    alt="After"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    After
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.category?.name && (
                      <p className="text-xs text-muted-foreground">{item.category.name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {item.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(item.id, !item.is_visible)}
                    >
                      {item.is_visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(item.id, !item.is_featured)}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          item.is_featured ? "text-yellow-500 fill-yellow-500" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={goToPage}
        onPageSizeChange={setPageSize}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Case" : "Add New Case"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Full Mouth Dental Implants"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe the treatment and results..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Before Image URL *</label>
                <Input
                  value={formData.before_image}
                  onChange={(e) => setFormData({ ...formData, before_image: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">After Image URL *</label>
                <Input
                  value={formData.after_image}
                  onChange={(e) => setFormData({ ...formData, after_image: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <Select
                  value={formData.category_id}
                  onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="implants, smile makeover, ..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.is_visible}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_visible: checked as boolean })
                  }
                />
                <span className="text-sm">Visible on website</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked as boolean })
                  }
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.consent_obtained}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, consent_obtained: checked as boolean })
                  }
                />
                <span className="text-sm">Patient consent obtained</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedItem ? "Update" : "Add"} Case
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        loading={isSubmitting}
        title="Delete Gallery Item"
        description="Are you sure you want to delete this case? This action cannot be undone."
      />
    </div>
  );
}
