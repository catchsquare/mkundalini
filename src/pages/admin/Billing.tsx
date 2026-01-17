import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  Eye,
  DollarSign,
  Loader2,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { getSafeErrorMessage } from "@/lib/errorHandling";
import { invoiceSchema, paymentSchema } from "@/lib/validationSchemas";

interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
  patient: { first_name: string; last_name: string; patient_id: string } | null;
}

interface Treatment {
  id: string;
  name: string;
  base_price: number;
  category: string;
}

interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
}

export default function Billing() {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(searchParams.get("action") === "new");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patient_id: "",
    items: [{ treatment_id: "", quantity: 1, unit_price: 0, description: "" }],
    discount: 0,
  });

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    payment_method: "cash",
    reference_number: "",
  });

  useEffect(() => {
    fetchInvoices();
    fetchTreatments();
    fetchPatients();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          patient:patients(first_name, last_name, patient_id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvoices(data as unknown as Invoice[] || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatments = async () => {
    const { data } = await supabase
      .from("treatments")
      .select("*")
      .eq("is_active", true)
      .order("name");
    setTreatments(data || []);
  };

  const fetchPatients = async () => {
    const { data } = await supabase
      .from("patients")
      .select("id, patient_id, first_name, last_name")
      .order("first_name");
    setPatients(data || []);
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const tax = subtotal * 0.13; // 13% VAT
    const total = subtotal + tax - formData.discount;
    return { subtotal, tax, total };
  };

  const handleTreatmentSelect = (index: number, treatmentId: string) => {
    const treatment = treatments.find((t) => t.id === treatmentId);
    if (treatment) {
      const newItems = [...formData.items];
      newItems[index] = {
        ...newItems[index],
        treatment_id: treatmentId,
        description: treatment.name,
        unit_price: treatment.base_price,
      };
      setFormData({ ...formData, items: newItems });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { treatment_id: "", quantity: 1, unit_price: 0, description: "" },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    const itemsToValidate = formData.items
      .filter((item) => item.description)
      .map((item) => ({
        treatment_id: item.treatment_id || undefined,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

    const validation = invoiceSchema.safeParse({
      patient_id: formData.patient_id,
      items: itemsToValidate,
      discount: formData.discount,
    });

    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.error.errors[0]?.message || "Please check your input",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { subtotal, tax, total } = calculateTotals();

      // Create invoice (invoice_number is auto-generated by database trigger)
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert([{
          patient_id: formData.patient_id,
          subtotal,
          discount: formData.discount,
          tax,
          total,
          status: "pending",
          created_by: profile?.id,
        } as any])
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items
      const invoiceItems = formData.items
        .filter((item) => item.description)
        .map((item) => ({
          invoice_id: invoice.id,
          treatment_id: item.treatment_id || null,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.unit_price * item.quantity,
        }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

      if (itemsError) throw itemsError;

      toast({ title: "Invoice created successfully" });
      setIsDialogOpen(false);
      resetForm();
      fetchInvoices();
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: getSafeErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setIsSubmitting(true);

    // Validate payment data
    const validation = paymentSchema.safeParse({
      amount: paymentData.amount,
      payment_method: paymentData.payment_method,
      reference_number: paymentData.reference_number,
    });

    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.error.errors[0]?.message || "Please check your input",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Record payment
      const { error: paymentError } = await supabase
        .from("payments")
        .insert([{
          invoice_id: selectedInvoice.id,
          amount: paymentData.amount,
          payment_method: paymentData.payment_method,
          reference_number: paymentData.reference_number || null,
          received_by: profile?.id,
        }]);

      if (paymentError) throw paymentError;

      // Update invoice status
      const newStatus =
        paymentData.amount >= selectedInvoice.total ? "paid" : "partial";
      
      await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", selectedInvoice.id);

      toast({ title: "Payment recorded successfully" });
      setIsPaymentDialogOpen(false);
      setSelectedInvoice(null);
      setPaymentData({ amount: 0, payment_method: "cash", reference_number: "" });
      fetchInvoices();
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: getSafeErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: "",
      items: [{ treatment_id: "", quantity: 1, unit_price: 0, description: "" }],
      discount: 0,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "partial": return <Clock className="w-4 h-4 text-orange-500" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "partial": return "bg-orange-100 text-orange-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.patient?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.patient?.last_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-muted-foreground">Manage invoices and payments</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {invoice.patient?.first_name} {invoice.patient?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.patient?.patient_id}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(invoice.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    NPR {invoice.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setPaymentData({
                              ...paymentData,
                              amount: invoice.total,
                            });
                            setIsPaymentDialogOpen(true);
                          }}
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Patient *</label>
              <Select
                value={formData.patient_id}
                onValueChange={(val) => setFormData({ ...formData, patient_id: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} ({p.patient_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Items</label>
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Select
                      value={item.treatment_id}
                      onValueChange={(val) => handleTreatmentSelect(index, val)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select treatment" />
                      </SelectTrigger>
                      <SelectContent>
                        {treatments.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name} - NPR {t.base_price.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[index].quantity = parseInt(e.target.value) || 1;
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="w-20"
                    />
                    <Input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[index].unit_price = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="w-28"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2">
                + Add Item
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Discount (NPR)</label>
              <Input
                type="number"
                min="0"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>NPR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>VAT (13%)</span>
                <span>NPR {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span>- NPR {formData.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>NPR {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !formData.patient_id}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Invoice
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <form onSubmit={handlePayment} className="space-y-4 mt-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Invoice</p>
                <p className="font-mono font-medium">{selectedInvoice.invoice_number}</p>
                <p className="text-lg font-bold mt-2">
                  Total: NPR {selectedInvoice.total.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Amount *</label>
                <Input
                  type="number"
                  min="0"
                  max={selectedInvoice.total}
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Payment Method *</label>
                <Select
                  value={paymentData.payment_method}
                  onValueChange={(val) =>
                    setPaymentData({ ...paymentData, payment_method: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="esewa">eSewa</SelectItem>
                    <SelectItem value="khalti">Khalti</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Reference Number</label>
                <Input
                  value={paymentData.reference_number}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, reference_number: e.target.value })
                  }
                  placeholder="Transaction ID, receipt number, etc."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPaymentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || paymentData.amount <= 0}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Record Payment
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
