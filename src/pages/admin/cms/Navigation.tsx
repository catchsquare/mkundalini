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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Menu,
  Link2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface NavItem {
  id: string;
  label: string;
  url: string | null;
  page_id: string | null;
  parent_id: string | null;
  location: string;
  sort_order: number;
  is_visible: boolean;
  target: string;
  icon: string | null;
  children?: NavItem[];
}

interface Page {
  id: string;
  title: string;
  slug: string;
}

export default function Navigation() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [items, setItems] = useState<NavItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("header");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    label: "",
    url: "",
    page_id: "",
    parent_id: "",
    target: "_self",
    is_visible: true,
    icon: "",
  });

  useEffect(() => {
    fetchItems();
    fetchPages();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading navigation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("id, title, slug")
        .eq("status", "published")
        .order("title", { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error: any) {
      console.error("Error fetching pages:", error);
    }
  };

  const getItemsByLocation = (location: string): NavItem[] => {
    const locationItems = items.filter((item) => item.location === location);
    const rootItems = locationItems.filter((item) => !item.parent_id);
    
    return rootItems.map((item) => ({
      ...item,
      children: locationItems.filter((child) => child.parent_id === item.id),
    }));
  };

  const resetForm = () => {
    setFormData({
      label: "",
      url: "",
      page_id: "",
      parent_id: "",
      target: "_self",
      is_visible: true,
      icon: "",
    });
    setSelectedItem(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: NavItem) => {
    setSelectedItem(item);
    setFormData({
      label: item.label,
      url: item.url || "",
      page_id: item.page_id || "",
      parent_id: item.parent_id || "",
      target: item.target || "_self",
      is_visible: item.is_visible,
      icon: item.icon || "",
    });
    setIsDialogOpen(true);
  };

  const rootItems = items.filter((item) => !item.parent_id && item.location === activeTab);

  const handleSubmit = async () => {
    if (!formData.label) {
      toast({
        title: "Validation Error",
        description: "Label is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.url && !formData.page_id) {
      toast({
        title: "Validation Error",
        description: "Either URL or Page is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const navData = {
        label: formData.label,
        url: formData.url || null,
        page_id: formData.page_id || null,
        parent_id: formData.parent_id && formData.parent_id !== "__none__" ? formData.parent_id : null,
        location: activeTab,
        target: formData.target,
        is_visible: formData.is_visible,
        icon: formData.icon || null,
        sort_order: selectedItem ? selectedItem.sort_order : items.filter(i => i.location === activeTab).length,
      };

      if (selectedItem) {
        const { error } = await supabase
          .from("navigation_items")
          .update(navData)
          .eq("id", selectedItem.id);
        if (error) throw error;

        await logAction({
          action: "update",
          entityType: "navigation_item",
          entityId: selectedItem.id,
          oldValues: { label: selectedItem.label },
          newValues: navData,
        });
        toast({ title: "Navigation item updated" });
      } else {
        const { data, error } = await supabase
          .from("navigation_items")
          .insert(navData)
          .select()
          .single();
        if (error) throw error;

        await logAction({
          action: "create",
          entityType: "navigation_item",
          entityId: data.id,
          newValues: navData,
        });
        toast({ title: "Navigation item created" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast({
        title: "Error saving navigation item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      // Delete children first
      await supabase.from("navigation_items").delete().eq("parent_id", selectedItem.id);
      
      const { error } = await supabase.from("navigation_items").delete().eq("id", selectedItem.id);
      if (error) throw error;

      await logAction({
        action: "delete",
        entityType: "navigation_item",
        entityId: selectedItem.id,
        oldValues: { label: selectedItem.label },
      });
      toast({ title: "Navigation item deleted" });
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      fetchItems();
    } catch (error: any) {
      toast({
        title: "Error deleting navigation item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVisibility = async (item: NavItem) => {
    try {
      const { error } = await supabase
        .from("navigation_items")
        .update({ is_visible: !item.is_visible })
        .eq("id", item.id);
      if (error) throw error;
      fetchItems();
    } catch (error: any) {
      toast({
        title: "Error updating visibility",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-3 p-3 rounded-lg border ${
            item.is_visible ? "bg-card" : "bg-muted/50 opacity-60"
          }`}
          style={{ marginLeft: level * 24 }}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
          
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="p-1 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.label}</span>
              {item.target === "_blank" && (
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              )}
              {!item.is_visible && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded">Hidden</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {item.url || (item.page_id ? `Page: ${pages.find(p => p.id === item.page_id)?.title || 'Unknown'}` : 'No link')}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleVisibility(item)}
            >
              {item.is_visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
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
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
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
          <h1 className="text-2xl font-bold text-foreground">Navigation</h1>
          <p className="text-muted-foreground">Manage website navigation menus</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="header" className="gap-2">
            <Menu className="w-4 h-4" />
            Header Menu
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2">
            <Link2 className="w-4 h-4" />
            Footer Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Header Navigation</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Main navigation menu displayed in the website header
                </p>
              </div>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {getItemsByLocation("header").length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Menu className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-4">No header navigation items</p>
                  <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {getItemsByLocation("header").map((item) => renderNavItem(item))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Footer Links</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Links displayed in the website footer
                </p>
              </div>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {getItemsByLocation("footer").length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Link2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-4">No footer links</p>
                  <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {getItemsByLocation("footer").map((item) => renderNavItem(item))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Edit Navigation Item" : "Add Navigation Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Label *</Label>
              <Input
                value={formData.label}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, label: e.target.value }))
                }
                placeholder="Menu item text"
              />
            </div>

            <div>
              <Label>Link Type</Label>
              <Select
                value={formData.page_id ? "page" : "url"}
                onValueChange={(value) => {
                  if (value === "page") {
                    setFormData((prev) => ({ ...prev, url: "" }));
                  } else {
                    setFormData((prev) => ({ ...prev, page_id: "" }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">Custom URL</SelectItem>
                  <SelectItem value="page">Link to Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.page_id || (!formData.url && !formData.page_id) ? (
              <div>
                <Label>Select Page</Label>
                <Select
                  value={formData.page_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, page_id: value, url: "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.title} (/{page.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {!formData.page_id && (
              <div>
                <Label>URL</Label>
                <Input
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value, page_id: "" }))
                  }
                  placeholder="/services or https://..."
                />
              </div>
            )}

            <div>
              <Label>Parent Item (for dropdowns)</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, parent_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (top level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None (top level)</SelectItem>
                  {rootItems
                    .filter((item) => item.id !== selectedItem?.id)
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Open In</Label>
              <Select
                value={formData.target}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, target: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Same Tab</SelectItem>
                  <SelectItem value="_blank">New Tab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_visible: !!checked }))
                }
              />
              <Label htmlFor="is_visible" className="cursor-pointer">
                Visible on website
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedItem ? "Update" : "Add Item"}
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
        title="Delete Navigation Item"
        description="Are you sure you want to delete this navigation item? Any child items will also be deleted."
      />
    </div>
  );
}
