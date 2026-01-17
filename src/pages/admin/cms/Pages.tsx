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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  FileText,
  Eye,
  EyeOff,
  Globe,
  GripVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { usePagination } from "@/hooks/use-pagination";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { Label } from "@/components/ui/label";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  template: string | null;
  excerpt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PageSection {
  id: string;
  page_id: string;
  section_type: string;
  content: any;
  settings: any;
  sort_order: number;
  is_visible: boolean;
}

const sectionTypes = [
  { value: "hero", label: "Hero Section" },
  { value: "text_image", label: "Text + Image (Two Column)" },
  { value: "services_grid", label: "Services Grid" },
  { value: "cta_strip", label: "Call to Action Strip" },
  { value: "faq", label: "FAQ Section" },
  { value: "team", label: "Team/Doctors Section" },
  { value: "testimonials", label: "Testimonials" },
  { value: "gallery", label: "Gallery/Before After" },
  { value: "pricing", label: "Pricing Table" },
  { value: "contact", label: "Contact Block" },
  { value: "text_block", label: "Rich Text Block" },
  { value: "features", label: "Features Grid" },
];

const templateOptions = [
  { value: "default", label: "Default" },
  { value: "landing", label: "Landing Page" },
  { value: "service", label: "Service Detail" },
  { value: "about", label: "About Page" },
];

export default function Pages() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("pages");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    status: "draft",
    template: "default",
    excerpt: "",
    seo_title: "",
    seo_description: "",
    og_image: "",
    featured_image: "",
  });

  const [sectionFormData, setSectionFormData] = useState({
    section_type: "hero",
    is_visible: true,
    content: {} as Record<string, any>,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPage && activeTab === "builder") {
      fetchSections(selectedPage.id);
    }
  }, [selectedPage, activeTab]);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading pages",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", pageId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading sections",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(search.toLowerCase()) ||
      page.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pagination = usePagination(filteredPages, 10);

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      status: "draft",
      template: "default",
      excerpt: "",
      seo_title: "",
      seo_description: "",
      og_image: "",
      featured_image: "",
    });
    setSelectedPage(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (page: Page) => {
    setSelectedPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      status: page.status || "draft",
      template: page.template || "default",
      excerpt: page.excerpt || "",
      seo_title: page.seo_title || "",
      seo_description: page.seo_description || "",
      og_image: page.og_image || "",
      featured_image: page.featured_image || "",
    });
    setIsDialogOpen(true);
  };

  const openPageBuilder = (page: Page) => {
    setSelectedPage(page);
    setActiveTab("builder");
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug) {
      toast({
        title: "Validation Error",
        description: "Title and slug are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const pageData = {
        title: formData.title,
        slug: formData.slug,
        status: formData.status,
        template: formData.template,
        excerpt: formData.excerpt || null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        og_image: formData.og_image || null,
        featured_image: formData.featured_image || null,
        published_at: formData.status === "published" ? new Date().toISOString() : null,
      };

      if (selectedPage) {
        const { error } = await supabase
          .from("pages")
          .update(pageData)
          .eq("id", selectedPage.id);
        if (error) throw error;

        await logAction({
          action: "update",
          entityType: "page",
          entityId: selectedPage.id,
          oldValues: { title: selectedPage.title },
          newValues: pageData,
        });
        toast({ title: "Page updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("pages")
          .insert(pageData)
          .select()
          .single();
        if (error) throw error;

        await logAction({
          action: "create",
          entityType: "page",
          entityId: data.id,
          newValues: pageData,
        });
        toast({ title: "Page created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPages();
    } catch (error: any) {
      toast({
        title: "Error saving page",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPage) return;

    setIsSubmitting(true);
    try {
      // Delete sections first
      await supabase.from("page_sections").delete().eq("page_id", selectedPage.id);
      
      const { error } = await supabase.from("pages").delete().eq("id", selectedPage.id);
      if (error) throw error;

      await logAction({
        action: "delete",
        entityType: "page",
        entityId: selectedPage.id,
        oldValues: { title: selectedPage.title },
      });
      toast({ title: "Page deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedPage(null);
      fetchPages();
    } catch (error: any) {
      toast({
        title: "Error deleting page",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (page: Page) => {
    try {
      const newStatus = page.status === "published" ? "draft" : "published";
      const { error } = await supabase
        .from("pages")
        .update({
          status: newStatus,
          published_at: newStatus === "published" ? new Date().toISOString() : null,
        })
        .eq("id", page.id);
      if (error) throw error;

      await logAction({
        action: "publish",
        entityType: "page",
        entityId: page.id,
        oldValues: { status: page.status },
        newValues: { status: newStatus },
      });
      toast({ title: `Page ${newStatus === "published" ? "published" : "unpublished"}` });
      fetchPages();
    } catch (error: any) {
      toast({
        title: "Error updating page status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Section management
  const openSectionDialog = (section?: PageSection) => {
    if (section) {
      setSelectedSection(section);
      setSectionFormData({
        section_type: section.section_type,
        is_visible: section.is_visible,
        content: section.content || {},
      });
    } else {
      setSelectedSection(null);
      setSectionFormData({
        section_type: "hero",
        is_visible: true,
        content: {},
      });
    }
    setIsSectionDialogOpen(true);
  };

  const handleSectionSubmit = async () => {
    if (!selectedPage) return;

    setIsSubmitting(true);
    try {
      const sectionData = {
        page_id: selectedPage.id,
        section_type: sectionFormData.section_type,
        is_visible: sectionFormData.is_visible,
        content: sectionFormData.content,
        sort_order: selectedSection ? selectedSection.sort_order : sections.length,
      };

      if (selectedSection) {
        const { error } = await supabase
          .from("page_sections")
          .update(sectionData)
          .eq("id", selectedSection.id);
        if (error) throw error;
        toast({ title: "Section updated" });
      } else {
        const { error } = await supabase.from("page_sections").insert(sectionData);
        if (error) throw error;
        toast({ title: "Section added" });
      }

      setIsSectionDialogOpen(false);
      fetchSections(selectedPage.id);
    } catch (error: any) {
      toast({
        title: "Error saving section",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const { error } = await supabase.from("page_sections").delete().eq("id", sectionId);
      if (error) throw error;
      toast({ title: "Section deleted" });
      if (selectedPage) fetchSections(selectedPage.id);
    } catch (error: any) {
      toast({
        title: "Error deleting section",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleSectionVisibility = async (section: PageSection) => {
    try {
      const { error } = await supabase
        .from("page_sections")
        .update({ is_visible: !section.is_visible })
        .eq("id", section.id);
      if (error) throw error;
      if (selectedPage) fetchSections(selectedPage.id);
    } catch (error: any) {
      toast({
        title: "Error updating section",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderSectionContent = (sectionType: string) => {
    switch (sectionType) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label>Headline</Label>
              <Input
                value={sectionFormData.content.headline || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, headline: e.target.value },
                  }))
                }
                placeholder="Main headline"
              />
            </div>
            <div>
              <Label>Subheadline</Label>
              <Input
                value={sectionFormData.content.subheadline || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, subheadline: e.target.value },
                  }))
                }
                placeholder="Supporting text"
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={sectionFormData.content.button_text || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, button_text: e.target.value },
                  }))
                }
                placeholder="Call to action"
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={sectionFormData.content.button_link || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, button_link: e.target.value },
                  }))
                }
                placeholder="/contact"
              />
            </div>
            <div>
              <Label>Background Image URL</Label>
              <Input
                value={sectionFormData.content.background_image || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, background_image: e.target.value },
                  }))
                }
                placeholder="https://..."
              />
            </div>
          </div>
        );
      case "text_image":
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={sectionFormData.content.title || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, title: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={sectionFormData.content.text || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, text: e.target.value },
                  }))
                }
                rows={4}
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={sectionFormData.content.image || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, image: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>Image Position</Label>
              <Select
                value={sectionFormData.content.image_position || "right"}
                onValueChange={(value) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, image_position: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "cta_strip":
        return (
          <div className="space-y-4">
            <div>
              <Label>Heading</Label>
              <Input
                value={sectionFormData.content.heading || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, heading: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={sectionFormData.content.button_text || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, button_text: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={sectionFormData.content.button_link || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, button_link: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        );
      case "text_block":
        return (
          <div className="space-y-4">
            <div>
              <Label>Title (optional)</Label>
              <Input
                value={sectionFormData.content.title || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, title: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={sectionFormData.content.text || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, text: e.target.value },
                  }))
                }
                rows={6}
                placeholder="Enter your content here..."
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={sectionFormData.content.title || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, title: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={sectionFormData.content.subtitle || ""}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, subtitle: e.target.value },
                  }))
                }
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This section type will display dynamic content from the database (e.g., testimonials, gallery items, team members).
            </p>
          </div>
        );
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
          <h1 className="text-2xl font-bold text-foreground">Pages</h1>
          <p className="text-muted-foreground">Manage website pages and content</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pages">All Pages</TabsTrigger>
          {selectedPage && (
            <TabsTrigger value="builder">
              Page Builder: {selectedPage.title}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Page
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pages Table */}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedData.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          /{page.slug}
                        </code>
                      </TableCell>
                      <TableCell className="capitalize">
                        {page.template || "default"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={page.status || "draft"} />
                      </TableCell>
                      <TableCell>
                        {format(new Date(page.updated_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openPageBuilder(page)}
                            title="Page Builder"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(page)}
                            title="Edit Settings"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePublish(page)}
                            title={page.status === "published" ? "Unpublish" : "Publish"}
                          >
                            {page.status === "published" ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Globe className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPage(page);
                              setIsDeleteDialogOpen(true);
                            }}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pagination.paginatedData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">No pages found</p>
                        <Button variant="link" onClick={openCreateDialog}>
                          Create your first page
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <DataTablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItems}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                onPageChange={pagination.goToPage}
                onPageSizeChange={pagination.setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          {selectedPage && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Page Sections</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage sections for "{selectedPage.title}"
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("pages")}>
                      Back to Pages
                    </Button>
                    <Button onClick={() => openSectionDialog()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {sections.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground mb-4">No sections yet</p>
                      <Button onClick={() => openSectionDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Section
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sections.map((section) => (
                        <div
                          key={section.id}
                          className={`flex items-center gap-3 p-4 rounded-lg border ${
                            section.is_visible ? "bg-card" : "bg-muted/50 opacity-60"
                          }`}
                        >
                          <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {sectionTypes.find((t) => t.value === section.section_type)?.label ||
                                  section.section_type}
                              </span>
                              {!section.is_visible && (
                                <span className="text-xs bg-muted px-2 py-0.5 rounded">Hidden</span>
                              )}
                            </div>
                            {section.content?.title && (
                              <p className="text-sm text-muted-foreground">
                                {section.content.title}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSectionVisibility(section)}
                            >
                              {section.is_visible ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openSectionDialog(section)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSection(section.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Page Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPage ? "Edit Page" : "Create New Page"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Page title"
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="page-url-slug"
                />
              </div>
              <div>
                <Label>Template</Label>
                <Select
                  value={formData.template}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, template: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="Brief description"
                  rows={2}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">SEO Settings</h4>
              <div className="space-y-4">
                <div>
                  <Label>SEO Title</Label>
                  <Input
                    value={formData.seo_title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, seo_title: e.target.value }))
                    }
                    placeholder="SEO optimized title (60 chars max)"
                    maxLength={60}
                  />
                </div>
                <div>
                  <Label>SEO Description</Label>
                  <Textarea
                    value={formData.seo_description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        seo_description: e.target.value,
                      }))
                    }
                    placeholder="Meta description (160 chars max)"
                    maxLength={160}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>OG Image URL</Label>
                  <Input
                    value={formData.og_image}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, og_image: e.target.value }))
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedPage ? "Update Page" : "Create Page"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Section Dialog */}
      <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSection ? "Edit Section" : "Add Section"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Section Type</Label>
              <Select
                value={sectionFormData.section_type}
                onValueChange={(value) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    section_type: value,
                    content: {},
                  }))
                }
                disabled={!!selectedSection}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sectionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Section Content</h4>
              {renderSectionContent(sectionFormData.section_type)}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsSectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSectionSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedSection ? "Update Section" : "Add Section"}
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
        title="Delete Page"
        description="Are you sure you want to delete this page? This will also delete all sections. This action cannot be undone."
      />
    </div>
  );
}
