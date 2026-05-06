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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Star,
  MessageSquare,
  CheckCircle,
  Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { usePagination } from "@/hooks/use-pagination";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface Testimonial {
  id: string;
  patient_name: string;
  patient_location: string | null;
  patient_avatar: string | null;
  content: string;
  rating: number;
  treatment_type: string | null;
  source: string;
  status: string;
  is_featured: boolean;
  is_verified: boolean;
  video_url: string | null;
  display_date: string | null;
  created_at: string;
}

export default function Testimonials() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patient_name: "",
    patient_location: "",
    patient_avatar: "",
    content: "",
    rating: 5,
    treatment_type: "",
    source: "internal",
    status: "pending",
    is_featured: false,
    is_verified: false,
    video_url: "",
    display_date: "",
  });

  const sourceOptions = [
    { value: "internal", label: "Website / Internal" },
    { value: "google", label: "Google" },
    { value: "facebook", label: "Facebook" },
    { value: "trustpilot", label: "Trustpilot" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const treatmentOptions = [
    "Dental Implants",
    "Veneers",
    "Teeth Whitening",
    "Root Canal",
    "Dental Crown",
    "Orthodontics",
    "General Checkup",
    "Dental Cleaning",
    "Other",
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const testimonialData = {
        patient_name: formData.patient_name,
        patient_location: formData.patient_location || null,
        patient_avatar: formData.patient_avatar || null,
        content: formData.content,
        rating: formData.rating,
        treatment_type: formData.treatment_type || null,
        source: formData.source,
        status: formData.status,
        is_featured: formData.is_featured,
        is_verified: formData.is_verified,
        video_url: formData.video_url || null,
        display_date: formData.display_date || null,
      };

      if (selectedTestimonial) {
        const { error } = await supabase
          .from("testimonials")
          .update(testimonialData)
          .eq("id", selectedTestimonial.id);

        if (error) throw error;

        await logAction({
          action: "update",
          entityType: "testimonial",
          entityId: selectedTestimonial.id,
          oldValues: selectedTestimonial,
          newValues: testimonialData,
        });

        toast({ title: "Testimonial updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("testimonials")
          .insert([testimonialData])
          .select()
          .single();

        if (error) throw error;

        await logAction({
          action: "create",
          entityType: "testimonial",
          entityId: data.id,
          newValues: testimonialData,
        });

        toast({ title: "Testimonial added successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTestimonials();
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
    if (!selectedTestimonial) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", selectedTestimonial.id);

      if (error) throw error;

      await logAction({
        action: "delete",
        entityType: "testimonial",
        entityId: selectedTestimonial.id,
        oldValues: selectedTestimonial,
      });

      toast({ title: "Testimonial deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedTestimonial(null);
      fetchTestimonials();
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const testimonial = testimonials.find((t) => t.id === id);
      const { error } = await supabase
        .from("testimonials")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      await logAction({
        action: "status_change",
        entityType: "testimonial",
        entityId: id,
        oldValues: { status: testimonial?.status },
        newValues: { status: newStatus },
      });

      toast({ title: "Status updated" });
      fetchTestimonials();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_featured: featured })
        .eq("id", id);

      if (error) throw error;
      toast({ title: featured ? "Marked as featured" : "Removed from featured" });
      fetchTestimonials();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      patient_name: "",
      patient_location: "",
      patient_avatar: "",
      content: "",
      rating: 5,
      treatment_type: "",
      source: "internal",
      status: "pending",
      is_featured: false,
      is_verified: false,
      video_url: "",
      display_date: "",
    });
    setSelectedTestimonial(null);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      patient_name: testimonial.patient_name,
      patient_location: testimonial.patient_location || "",
      patient_avatar: testimonial.patient_avatar || "",
      content: testimonial.content,
      rating: testimonial.rating,
      treatment_type: testimonial.treatment_type || "",
      source: testimonial.source,
      status: testimonial.status,
      is_featured: testimonial.is_featured,
      is_verified: testimonial.is_verified,
      video_url: testimonial.video_url || "",
      display_date: testimonial.display_date || "",
    });
    setIsDialogOpen(true);
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
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
  } = usePagination(filteredTestimonials, 10);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground">Manage patient reviews and testimonials</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{testimonials.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {testimonials.filter((t) => t.status === "approved").length}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-orange-600">
            {testimonials.filter((t) => t.status === "pending").length}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Featured</p>
          <p className="text-2xl font-bold text-primary">
            {testimonials.filter((t) => t.is_featured).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search testimonials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No testimonials found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{testimonial.patient_name}</p>
                      {testimonial.patient_location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {testimonial.patient_location}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2 max-w-xs">{testimonial.content}</p>
                    {testimonial.treatment_type && (
                      <span className="text-xs text-muted-foreground">
                        {testimonial.treatment_type}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                  </TableCell>
                  <TableCell className="capitalize">{testimonial.source}</TableCell>
                  <TableCell>
                    <Select
                      value={testimonial.status}
                      onValueChange={(val) => handleStatusChange(testimonial.id, val)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={testimonial.is_featured}
                      onCheckedChange={(checked) =>
                        toggleFeatured(testimonial.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(testimonial)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTestimonial(testimonial);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Patient Name *</label>
                <Input
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Location</label>
                <Input
                  value={formData.patient_location}
                  onChange={(e) => setFormData({ ...formData, patient_location: e.target.value })}
                  placeholder="e.g., USA, UK, Australia"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Review Content *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Rating *</label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(val) => setFormData({ ...formData, rating: parseInt(val) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={r.toString()}>
                        {r} Star{r > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Source</label>
                <Select
                  value={formData.source}
                  onValueChange={(val) => setFormData({ ...formData, source: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Treatment Type</label>
                <Select
                  value={formData.treatment_type}
                  onValueChange={(val) => setFormData({ ...formData, treatment_type: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Display Date</label>
                <Input
                  type="date"
                  value={formData.display_date}
                  onChange={(e) => setFormData({ ...formData, display_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Video URL (optional)</label>
              <Input
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked as boolean })
                  }
                />
                <span className="text-sm">Featured on homepage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.is_verified}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_verified: checked as boolean })
                  }
                />
                <span className="text-sm">Verified patient</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedTestimonial ? "Update" : "Add"} Testimonial
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
        isDeleting={isSubmitting}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  );
}
