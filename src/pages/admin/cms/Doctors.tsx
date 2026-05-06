import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Stethoscope,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Dentist {
  id: string;
  profile_id: string | null;
  specialization: string | null;
  license_number: string | null;
  is_available: boolean;
  created_at: string;
  profile?: {
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
  } | null;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function Doctors() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    profile_id: "",
    specialization: "",
    license_number: "",
    is_available: true,
  });

  const specializations = [
    "General Dentistry",
    "Orthodontics",
    "Periodontics",
    "Endodontics",
    "Prosthodontics",
    "Oral Surgery",
    "Pediatric Dentistry",
    "Cosmetic Dentistry",
    "Implantology",
  ];

  useEffect(() => {
    fetchDentists();
    fetchProfiles();
  }, []);

  const fetchDentists = async () => {
    try {
      const { data, error } = await supabase
        .from("dentists")
        .select(`*, profile:profiles(full_name, email, phone, avatar_url)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDentists(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading dentists",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .order("full_name", { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      console.error("Error fetching profiles:", error);
    }
  };

  const filteredDentists = dentists.filter((dentist) => {
    const name = dentist.profile?.full_name || "";
    const specialization = dentist.specialization || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      specialization.toLowerCase().includes(search.toLowerCase())
    );
  });

  const resetForm = () => {
    setFormData({
      profile_id: "",
      specialization: "",
      license_number: "",
      is_available: true,
    });
    setSelectedDentist(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (dentist: Dentist) => {
    setSelectedDentist(dentist);
    setFormData({
      profile_id: dentist.profile_id || "",
      specialization: dentist.specialization || "",
      license_number: dentist.license_number || "",
      is_available: dentist.is_available,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const dentistData = {
        profile_id: formData.profile_id && formData.profile_id !== "__none__" ? formData.profile_id : null,
        specialization: formData.specialization || null,
        license_number: formData.license_number || null,
        is_available: formData.is_available,
      };

      if (selectedDentist) {
        const { error } = await supabase
          .from("dentists")
          .update(dentistData)
          .eq("id", selectedDentist.id);
        if (error) throw error;

        await logAction({
          action: "update",
          entityType: "profile",
          entityId: selectedDentist.id,
          newValues: dentistData,
        });
        toast({ title: "Dentist updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("dentists")
          .insert(dentistData)
          .select()
          .single();
        if (error) throw error;

        await logAction({
          action: "create",
          entityType: "profile",
          entityId: data.id,
          newValues: dentistData,
        });
        toast({ title: "Dentist created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchDentists();
    } catch (error: any) {
      toast({
        title: "Error saving dentist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDentist) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("dentists").delete().eq("id", selectedDentist.id);
      if (error) throw error;

      await logAction({
        action: "delete",
        entityType: "profile",
        entityId: selectedDentist.id,
      });
      toast({ title: "Dentist deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedDentist(null);
      fetchDentists();
    } catch (error: any) {
      toast({
        title: "Error deleting dentist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAvailability = async (dentist: Dentist) => {
    try {
      const { error } = await supabase
        .from("dentists")
        .update({ is_available: !dentist.is_available })
        .eq("id", dentist.id);
      if (error) throw error;
      fetchDentists();
    } catch (error: any) {
      toast({
        title: "Error updating availability",
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
          <h1 className="text-2xl font-bold text-foreground">Doctors</h1>
          <p className="text-muted-foreground">Manage dental team members</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      {filteredDentists.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-4">No doctors found</p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Doctor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDentists.map((dentist) => (
            <Card key={dentist.id} className={!dentist.is_available ? "opacity-60" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {dentist.profile?.full_name || "Unnamed"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {dentist.specialization || "General Dentistry"}
                    </p>
                    {dentist.license_number && (
                      <p className="text-xs text-muted-foreground mt-1">
                        License: {dentist.license_number}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      {dentist.is_available ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleAvailability(dentist)}
                  >
                    {dentist.is_available ? "Set Unavailable" : "Set Available"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(dentist)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedDentist(dentist);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Doctor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDentist ? "Edit Doctor" : "Add Doctor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Link to User Profile</Label>
              <Select
                value={formData.profile_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, profile_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.full_name} ({p.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Link to an existing user account
              </p>
            </div>

            <div>
              <Label>Specialization</Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, specialization: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>License Number</Label>
              <Input
                value={formData.license_number}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, license_number: e.target.value }))
                }
                placeholder="NMC-12345"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_available"
                checked={formData.is_available}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_available: !!checked }))
                }
              />
              <Label htmlFor="is_available" className="cursor-pointer">
                Available for appointments
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedDentist ? "Update" : "Add Doctor"}
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
        title="Delete Doctor"
        description="Are you sure you want to delete this doctor? This action cannot be undone."
      />
    </div>
  );
}
