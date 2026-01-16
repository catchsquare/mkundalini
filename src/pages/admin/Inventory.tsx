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
  Package,
  AlertTriangle,
  ArrowUpDown,
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

interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  category_id: string | null;
  quantity: number;
  min_stock_level: number;
  unit: string;
  cost_price: number | null;
  supplier: string | null;
  location: string | null;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: { name: string } | null;
}

interface InventoryCategory {
  id: string;
  name: string;
  description: string | null;
}

export default function Inventory() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category_id: "",
    quantity: 0,
    min_stock_level: 10,
    unit: "pcs",
    cost_price: "",
    supplier: "",
    location: "",
    expiry_date: "",
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select(`*, category:inventory_categories(name)`)
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setItems(data as unknown as InventoryItem[] || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("inventory_categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const itemData = {
        name: formData.name,
        sku: formData.sku || null,
        description: formData.description || null,
        category_id: formData.category_id || null,
        quantity: formData.quantity,
        min_stock_level: formData.min_stock_level,
        unit: formData.unit,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        supplier: formData.supplier || null,
        location: formData.location || null,
        expiry_date: formData.expiry_date || null,
      };

      if (selectedItem) {
        const { error } = await supabase
          .from("inventory_items")
          .update(itemData)
          .eq("id", selectedItem.id);

        if (error) throw error;
        
        await logAction({
          action: "update",
          entityType: "inventory_item",
          entityId: selectedItem.id,
          oldValues: selectedItem,
          newValues: itemData,
        });
        
        toast({ title: "Item updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("inventory_items")
          .insert([itemData])
          .select()
          .single();

        if (error) throw error;
        
        await logAction({
          action: "create",
          entityType: "inventory_item",
          entityId: data.id,
          newValues: itemData,
        });
        
        toast({ title: "Item added successfully" });
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
        .from("inventory_items")
        .update({ is_active: false })
        .eq("id", selectedItem.id);

      if (error) throw error;
      
      await logAction({
        action: "delete",
        entityType: "inventory_item",
        entityId: selectedItem.id,
        oldValues: selectedItem,
      });
      
      toast({ title: "Item deleted successfully" });
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

  const handleStockAdjust = async (itemId: string, adjustment: number, type: "add" | "remove") => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = type === "add" 
      ? item.quantity + adjustment 
      : Math.max(0, item.quantity - adjustment);

    try {
      // Update item quantity
      const { error: updateError } = await supabase
        .from("inventory_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transError } = await supabase
        .from("inventory_transactions")
        .insert({
          item_id: itemId,
          transaction_type: type === "add" ? "stock_in" : "stock_out",
          quantity: adjustment,
          created_by: profile?.id,
        });

      if (transError) throw transError;

      await logAction({
        action: "update",
        entityType: "inventory_item",
        entityId: itemId,
        oldValues: { quantity: item.quantity },
        newValues: { quantity: newQuantity },
      });

      toast({ title: `Stock ${type === "add" ? "added" : "removed"} successfully` });
      fetchItems();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      description: "",
      category_id: "",
      quantity: 0,
      min_stock_level: 10,
      unit: "pcs",
      cost_price: "",
      supplier: "",
      location: "",
      expiry_date: "",
    });
    setSelectedItem(null);
  };

  const openEditDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      sku: item.sku || "",
      description: item.description || "",
      category_id: item.category_id || "",
      quantity: item.quantity,
      min_stock_level: item.min_stock_level,
      unit: item.unit,
      cost_price: item.cost_price?.toString() || "",
      supplier: item.supplier || "",
      location: item.location || "",
      expiry_date: item.expiry_date || "",
    });
    setIsDialogOpen(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return "out_of_stock";
    if (item.quantity <= item.min_stock_level) return "low_stock";
    return "in_stock";
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.sku?.toLowerCase().includes(search.toLowerCase())) ||
      (item.supplier?.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || item.category_id === categoryFilter;
    
    const stockStatus = getStockStatus(item);
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "low" && stockStatus !== "in_stock");
    
    return matchesSearch && matchesCategory && matchesStock;
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

  const handleExport = () => {
    exportToCSV(filteredItems, "inventory", [
      { key: "name", label: "Name" },
      { key: "sku", label: "SKU" },
      { key: "quantity", label: "Quantity" },
      { key: "min_stock_level", label: "Min Stock" },
      { key: "unit", label: "Unit" },
      { key: "cost_price", label: "Cost Price" },
      { key: "supplier", label: "Supplier" },
      { key: "location", label: "Location" },
    ]);
    toast({ title: "Inventory exported to CSV" });
  };

  const lowStockCount = items.filter((i) => getStockStatus(i) !== "in_stock").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">
            Manage clinic supplies and equipment
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton onExport={handleExport} disabled={filteredItems.length === 0} />
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <div>
            <p className="font-medium text-orange-800">Low Stock Alert</p>
            <p className="text-sm text-orange-700">
              {lowStockCount} item{lowStockCount > 1 ? "s" : ""} need restocking
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            onClick={() => setStockFilter("low")}
          >
            View Items
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or supplier..."
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
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="low">Low/Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost</TableHead>
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
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.supplier && (
                          <p className="text-xs text-muted-foreground">{item.supplier}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.sku || "—"}
                  </TableCell>
                  <TableCell>{item.category?.name || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleStockAdjust(item.id, 1, "remove")}
                        disabled={item.quantity === 0}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity} {item.unit}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleStockAdjust(item.id, 1, "add")}
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={getStockStatus(item)} />
                  </TableCell>
                  <TableCell>
                    {item.cost_price ? `NPR ${item.cost_price.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedItem(item);
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
              {selectedItem ? "Edit Item" : "Add New Item"}
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
                <label className="block text-sm font-medium mb-1.5">SKU</label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g., INV-001"
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
                    <SelectValue placeholder="Select category" />
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
                <label className="block text-sm font-medium mb-1.5">Unit</label>
                <Select
                  value={formData.unit}
                  onValueChange={(val) => setFormData({ ...formData, unit: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">Pieces</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                    <SelectItem value="set">Set</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Quantity</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Min Stock Level</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.min_stock_level}
                  onChange={(e) => setFormData({ ...formData, min_stock_level: parseInt(e.target.value) || 10 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Cost Price (NPR)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Supplier</label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Cabinet A, Shelf 2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
              <Input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
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
                {selectedItem ? "Update" : "Add"} Item
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
        title="Delete Inventory Item"
        description={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
