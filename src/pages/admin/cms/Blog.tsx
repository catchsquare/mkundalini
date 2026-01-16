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
  FileText,
  Eye,
  Calendar,
  Tag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { usePagination } from "@/hooks/use-pagination";
import { useAuditLog } from "@/hooks/use-audit-log";
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination";
import { DeleteConfirmDialog } from "@/components/admin/shared/DeleteConfirmDialog";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  featured_image: string | null;
  category_id: string | null;
  author_id: string | null;
  status: string;
  is_featured: boolean;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  views_count: number;
  published_at: string | null;
  created_at: string;
  category?: { name: string } | null;
  author?: { full_name: string } | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export default function Blog() {
  const { profile } = useAuth();
  const { logAction } = useAuditLog();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category_id: "",
    status: "draft",
    is_featured: false,
    tags: "",
    seo_title: "",
    seo_description: "",
  });

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`*, category:blog_categories(name), author:profiles(full_name)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data as unknown as BlogPost[] || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt || null,
        content: formData.content ? { text: formData.content } : null,
        featured_image: formData.featured_image || null,
        category_id: formData.category_id || null,
        author_id: profile?.id || null,
        status: formData.status,
        is_featured: formData.is_featured,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        published_at: formData.status === "published" ? new Date().toISOString() : null,
      };

      if (selectedPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", selectedPost.id);

        if (error) throw error;

        await logAction({
          action: "update",
          entityType: "blog_post",
          entityId: selectedPost.id,
          oldValues: selectedPost,
          newValues: postData,
        });

        toast({ title: "Post updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("blog_posts")
          .insert([postData])
          .select()
          .single();

        if (error) throw error;

        await logAction({
          action: "create",
          entityType: "blog_post",
          entityId: data.id,
          newValues: postData,
        });

        toast({ title: "Post created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPosts();
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
    if (!selectedPost) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", selectedPost.id);

      if (error) throw error;

      await logAction({
        action: "delete",
        entityType: "blog_post",
        entityId: selectedPost.id,
        oldValues: selectedPost,
      });

      toast({ title: "Post deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
      fetchPosts();
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
      const post = posts.find((p) => p.id === id);
      const updates: any = { status: newStatus };
      
      if (newStatus === "published" && !post?.published_at) {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      await logAction({
        action: "status_change",
        entityType: "blog_post",
        entityId: id,
        oldValues: { status: post?.status },
        newValues: { status: newStatus },
      });

      toast({ title: "Status updated" });
      fetchPosts();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      category_id: "",
      status: "draft",
      is_featured: false,
      tags: "",
      seo_title: "",
      seo_description: "",
    });
    setSelectedPost(null);
  };

  const openEditDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: typeof post.content === "object" ? post.content?.text || "" : "",
      featured_image: post.featured_image || "",
      category_id: post.category_id || "",
      status: post.status,
      is_featured: post.is_featured,
      tags: post.tags?.join(", ") || "",
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
    });
    setIsDialogOpen(true);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
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
  } = usePagination(filteredPosts, 10);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground">Create and manage blog content</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-bold">{posts.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {posts.filter((p) => p.status === "published").length}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="text-2xl font-bold text-orange-600">
            {posts.filter((p) => p.status === "draft").length}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Views</p>
          <p className="text-2xl font-bold text-primary">
            {posts.reduce((sum, p) => sum + (p.views_count || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
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
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
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
                  No posts found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-xs text-muted-foreground">/{post.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{post.category?.name || "—"}</TableCell>
                  <TableCell>{post.author?.full_name || "—"}</TableCell>
                  <TableCell>
                    <Select
                      value={post.status}
                      onValueChange={(val) => handleStatusChange(post.id, val)}
                    >
                      <SelectTrigger className="w-28 h-8">
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
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-muted-foreground" />
                      {post.views_count || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.published_at
                      ? format(new Date(post.published_at), "MMM d, yyyy")
                      : format(new Date(post.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPost(post);
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
            <DialogTitle>{selectedPost ? "Edit Post" : "Create New Post"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  });
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated-from-title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                placeholder="Brief summary for SEO and previews..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Content *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                placeholder="Write your blog post content..."
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Featured Image URL</label>
                <Input
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
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
                <label className="block text-sm font-medium mb-1.5">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="dental, health, tips, ..."
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">SEO Settings</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">SEO Title</label>
                  <Input
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    placeholder="Title for search engines (max 60 chars)"
                    maxLength={60}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    SEO Description
                  </label>
                  <Textarea
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    placeholder="Description for search engines (max 160 chars)"
                    rows={2}
                    maxLength={160}
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_featured: checked as boolean })
                }
              />
              <span className="text-sm">Feature this post on homepage</span>
            </label>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedPost ? "Update" : "Create"} Post
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
        title="Delete Blog Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
}
