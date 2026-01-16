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
  Phone,
  Mail,
  MessageSquare,
  UserPlus,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { usePagination } from "@/hooks/use-pagination";
import { useAuditLog } from "@/hooks/use-audit-log";
import { exportToCSV } from "@/lib/csv-export";
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination";
import { ExportButton } from "@/components/admin/shared/ExportButton";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: string;
  form_type: string;
  treatment_interest: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  updated_at: string;
  assignee?: { full_name: string } | null;
}

interface Profile {
  id: string;
  full_name: string;
}

export default function Leads() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [staff, setStaff] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    source: "website",
    form_type: "contact",
    treatment_interest: "",
    status: "new",
    priority: "medium",
    assigned_to: "",
  });

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "converted", label: "Converted" },
    { value: "lost", label: "Lost" },
  ];

  const sourceOptions = [
    { value: "website", label: "Website" },
    { value: "phone", label: "Phone" },
    { value: "walkin", label: "Walk-in" },
    { value: "referral", label: "Referral" },
    { value: "social", label: "Social Media" },
    { value: "google", label: "Google" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  useEffect(() => {
    fetchLeads();
    fetchStaff();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select(`*, assignee:profiles!leads_assigned_to_fkey(full_name)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data as unknown as Lead[] || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("role", ["super_admin", "admin", "manager", "receptionist"])
      .eq("is_active", true)
      .order("full_name");
    setStaff(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const leadData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        message: formData.message || null,
        source: formData.source,
        form_type: formData.form_type,
        treatment_interest: formData.treatment_interest || null,
        status: formData.status,
        priority: formData.priority,
        assigned_to: formData.assigned_to || null,
      };

      if (selectedLead) {
        const { error } = await supabase
          .from("leads")
          .update(leadData)
          .eq("id", selectedLead.id);

        if (error) throw error;
        
        await logAction({
          action: "update",
          entityType: "lead",
          entityId: selectedLead.id,
          oldValues: selectedLead,
          newValues: leadData,
        });
        
        toast({ title: "Lead updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("leads")
          .insert([leadData])
          .select()
          .single();

        if (error) throw error;
        
        await logAction({
          action: "create",
          entityType: "lead",
          entityId: data.id,
          newValues: leadData,
        });
        
        toast({ title: "Lead added successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchLeads();
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

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const lead = leads.find((l) => l.id === leadId);
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) throw error;
      
      await logAction({
        action: "status_change",
        entityType: "lead",
        entityId: leadId,
        oldValues: { status: lead?.status },
        newValues: { status: newStatus },
      });
      
      toast({ title: "Status updated" });
      fetchLeads();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async () => {
    if (!selectedLead) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", selectedLead.id);

      if (error) throw error;
      
      await logAction({
        action: "delete",
        entityType: "lead",
        entityId: selectedLead.id,
        oldValues: selectedLead,
      });
      
      toast({ title: "Lead deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedLead(null);
      fetchLeads();
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

  const convertToPatient = async (lead: Lead) => {
    try {
      // Create patient from lead
      const names = lead.name.split(" ");
      const firstName = names[0] || lead.name;
      const lastName = names.slice(1).join(" ") || "";

      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .insert([{
          first_name: firstName,
          last_name: lastName,
          email: lead.email,
          phone: lead.phone || "N/A",
          notes: lead.message,
        } as any])
        .select()
        .single();

      if (patientError) throw patientError;

      // Update lead status
      const { error: leadError } = await supabase
        .from("leads")
        .update({ 
          status: "converted", 
          converted_patient_id: patient.id 
        })
        .eq("id", lead.id);

      if (leadError) throw leadError;

      await logAction({
        action: "update",
        entityType: "lead",
        entityId: lead.id,
        oldValues: { status: lead.status },
        newValues: { status: "converted", converted_patient_id: patient.id },
      });

      toast({ 
        title: "Lead converted to patient", 
        description: `Patient ID: ${patient.patient_id}` 
      });
      fetchLeads();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      source: "website",
      form_type: "contact",
      treatment_interest: "",
      status: "new",
      priority: "medium",
      assigned_to: "",
    });
    setSelectedLead(null);
  };

  const openEditDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email || "",
      phone: lead.phone || "",
      message: lead.message || "",
      source: lead.source,
      form_type: lead.form_type,
      treatment_interest: lead.treatment_interest || "",
      status: lead.status,
      priority: lead.priority,
      assigned_to: lead.assigned_to || "",
    });
    setIsDialogOpen(true);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search);
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
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
  } = usePagination(filteredLeads, 10);

  const handleExport = () => {
    exportToCSV(filteredLeads, "leads", [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "source", label: "Source" },
      { key: "treatment_interest", label: "Treatment Interest" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "created_at", label: "Date" },
    ]);
    toast({ title: "Leads exported to CSV" });
  };

  // Stats
  const newLeads = leads.filter((l) => l.status === "new").length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">
            Manage incoming inquiries and convert to patients
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton onExport={handleExport} disabled={filteredLeads.length === 0} />
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Leads</p>
          <p className="text-2xl font-bold">{leads.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">New</p>
          <p className="text-2xl font-bold text-blue-600">{newLeads}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Converted</p>
          <p className="text-2xl font-bold text-green-600">{convertedLeads}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-bold">
            {leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
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
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sourceOptions.map((opt) => (
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
              <TableHead>Lead</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
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
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      {lead.assignee && (
                        <p className="text-xs text-muted-foreground">
                          Assigned: {lead.assignee.full_name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{lead.source}</TableCell>
                  <TableCell>{lead.treatment_interest || "—"}</TableCell>
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(val) => handleStatusChange(lead.id, val)}
                    >
                      <SelectTrigger className="h-7 w-28">
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
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(lead.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {lead.status !== "converted" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => convertToPatient(lead)}
                          title="Convert to Patient"
                        >
                          <UserPlus className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(lead)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedLead(lead);
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLead ? "Edit Lead" : "Add New Lead"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Treatment Interest</label>
                <Input
                  value={formData.treatment_interest}
                  onChange={(e) => setFormData({ ...formData, treatment_interest: e.target.value })}
                  placeholder="e.g., Dental Implants"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium mb-1.5">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(val) => setFormData({ ...formData, priority: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Assigned To</label>
              <Select
                value={formData.assigned_to}
                onValueChange={(val) => setFormData({ ...formData, assigned_to: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !formData.name}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedLead ? "Update" : "Add"} Lead
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
        title="Delete Lead"
        description={`Are you sure you want to delete "${selectedLead?.name}"? This action cannot be undone.`}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
