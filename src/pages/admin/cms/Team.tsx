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
  Users,
  Stethoscope,
  GripVertical,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  role_type: string;
  qualifications: string[] | null;
  experience_years: number | null;
  bio: string | null;
  specialties: string[] | null;
  languages: string[] | null;
  photo_url: string | null;
  photo_alt: string | null;
  achievements: string[] | null;
  is_featured: boolean;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const roleTypes = [
  { value: "director", label: "Director / Management" },
  { value: "doctor", label: "Doctor / Dentist" },
  { value: "staff", label: "Staff" },
];

export default function Team() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRoleType, setFilterRoleType] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    role_type: "staff",
    qualifications: "",
    experience_years: "",
    bio: "",
    specialties: "",
    languages: "",
    photo_url: "",
    photo_alt: "",
    achievements: "",
    is_featured: false,
    status: "published",
    sort_order: 0,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading team members",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterRoleType === "all" || member.role_type === filterRoleType;
    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      full_name: "",
      role: "",
      role_type: "staff",
      qualifications: "",
      experience_years: "",
      bio: "",
      specialties: "",
      languages: "",
      photo_url: "",
      photo_alt: "",
      achievements: "",
      is_featured: false,
      status: "published",
      sort_order: members.length,
    });
    setSelectedMember(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      full_name: member.full_name,
      role: member.role,
      role_type: member.role_type,
      qualifications: member.qualifications?.join("\n") || "",
      experience_years: member.experience_years?.toString() || "",
      bio: member.bio || "",
      specialties: member.specialties?.join(", ") || "",
      languages: member.languages?.join(", ") || "",
      photo_url: member.photo_url || "",
      photo_alt: member.photo_alt || "",
      achievements: member.achievements?.join("\n") || "",
      is_featured: member.is_featured,
      status: member.status,
      sort_order: member.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.full_name.trim() || !formData.role.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter name and role",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const memberData = {
        full_name: formData.full_name,
        role: formData.role,
        role_type: formData.role_type,
        qualifications: formData.qualifications ? formData.qualifications.split("\n").filter(Boolean) : null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        bio: formData.bio || null,
        specialties: formData.specialties ? formData.specialties.split(",").map(s => s.trim()).filter(Boolean) : null,
        languages: formData.languages ? formData.languages.split(",").map(s => s.trim()).filter(Boolean) : null,
        photo_url: formData.photo_url || null,
        photo_alt: formData.photo_alt || null,
        achievements: formData.achievements ? formData.achievements.split("\n").filter(Boolean) : null,
        is_featured: formData.is_featured,
        status: formData.status,
        sort_order: formData.sort_order,
      };

      if (selectedMember) {
        const { error } = await supabase
          .from("team_members")
          .update(memberData)
          .eq("id", selectedMember.id);
        if (error) throw error;

        await logAction({
          action: "update",
          entityType: "team_member",
          entityId: selectedMember.id,
          newValues: memberData,
        });
        toast({ title: "Team member updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("team_members")
          .insert(memberData)
          .select()
          .single();
        if (error) throw error;

        await logAction({
          action: "create",
          entityType: "team_member",
          entityId: data.id,
          newValues: memberData,
        });
        toast({ title: "Team member added successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error saving team member",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("team_members").delete().eq("id", selectedMember.id);
      if (error) throw error;

      await logAction({
        action: "delete",
        entityType: "team_member",
        entityId: selectedMember.id,
      });
      toast({ title: "Team member deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error deleting team member",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (member: TeamMember) => {
    try {
      const newStatus = member.status === "published" ? "hidden" : "published";
      const { error } = await supabase
        .from("team_members")
        .update({ status: newStatus })
        .eq("id", member.id);
      if (error) throw error;
      fetchMembers();
      toast({ title: `Member ${newStatus === "published" ? "published" : "hidden"}` });
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
          <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground">Manage doctors and staff displayed on the website</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRoleType} onValueChange={setFilterRoleType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roleTypes.map((rt) => (
                  <SelectItem key={rt.value} value={rt.value}>
                    {rt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-4">No team members found</p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Team Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className={member.status !== "published" ? "opacity-60" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {member.role_type === "doctor" || member.role_type === "director" ? (
                      <Stethoscope className="w-6 h-6 text-primary" />
                    ) : (
                      <Users className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {member.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.role_type === "director" 
                          ? "bg-purple-50 text-purple-700"
                          : member.role_type === "doctor"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {roleTypes.find(r => r.value === member.role_type)?.label || member.role_type}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.status === "published" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {member.status === "published" ? "Published" : "Hidden"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{member.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.experience_years && (
                      <p className="text-xs text-muted-foreground">{member.experience_years} years experience</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(member)}
                      title={member.status === "published" ? "Hide" : "Publish"}
                    >
                      {member.status === "published" ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(member)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedMember(member);
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

      {/* Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? "Edit Team Member" : "Add Team Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                placeholder="Dr. Nitin Aryal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role / Title *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="Managing Director"
                />
              </div>
              <div>
                <Label>Role Type</Label>
                <Select
                  value={formData.role_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, role_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleTypes.map((rt) => (
                      <SelectItem key={rt.value} value={rt.value}>
                        {rt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Qualifications (one per line)</Label>
              <Textarea
                value={formData.qualifications}
                onChange={(e) => setFormData((prev) => ({ ...prev, qualifications: e.target.value }))}
                placeholder="BDS — Bachelor of Dental Surgery&#10;MDS — Master of Dental Surgery"
                rows={3}
              />
            </div>

            <div>
              <Label>Experience (years)</Label>
              <Input
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData((prev) => ({ ...prev, experience_years: e.target.value }))}
                placeholder="15"
                min={0}
              />
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief biography..."
                rows={4}
              />
            </div>

            <div>
              <Label>Specialties (comma-separated)</Label>
              <Input
                value={formData.specialties}
                onChange={(e) => setFormData((prev) => ({ ...prev, specialties: e.target.value }))}
                placeholder="General Dentistry, Cosmetic Dentistry, Implants"
              />
            </div>

            <div>
              <Label>Languages (comma-separated)</Label>
              <Input
                value={formData.languages}
                onChange={(e) => setFormData((prev) => ({ ...prev, languages: e.target.value }))}
                placeholder="English, Nepali"
              />
            </div>

            <ImageUploader
              value={formData.photo_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, photo_url: url }))}
              folder="team"
              label="Photo"
            />

            {formData.photo_url && (
              <div>
                <Label>Photo Alt Text *</Label>
                <Input
                  value={formData.photo_alt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, photo_alt: e.target.value }))}
                  placeholder="Portrait of Dr. Nitin Aryal"
                />
              </div>
            )}

            <div>
              <Label>Achievements (one per line)</Label>
              <Textarea
                value={formData.achievements}
                onChange={(e) => setFormData((prev) => ({ ...prev, achievements: e.target.value }))}
                placeholder="Practising dentistry since ...&#10;Founder & Managing Director"
                rows={3}
              />
            </div>

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
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
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

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: !!checked }))}
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Featured (shown prominently on Doctors page)
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedMember ? "Update" : "Add Member"}
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
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
      />
    </div>
  );
}
