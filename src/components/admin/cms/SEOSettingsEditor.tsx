import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Loader2, Search, Image, Globe, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";

interface SEOSettings {
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  og_image: string | null;
  canonical_url: string | null;
}

interface SEOSettingsEditorProps {
  pageId: string;
  pageName: string;
}

export function SEOSettingsEditor({ pageId, pageName }: SEOSettingsEditorProps) {
  const [settings, setSettings] = useState<SEOSettings>({
    seo_title: "",
    seo_description: "",
    seo_keywords: [],
    og_image: "",
    canonical_url: "",
  });
  const [keywordsInput, setKeywordsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { logAction } = useAuditLog();

  useEffect(() => {
    fetchSettings();
  }, [pageId]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("seo_title, seo_description, seo_keywords, og_image, canonical_url")
        .eq("id", pageId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setSettings({
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || "",
          seo_keywords: data.seo_keywords || [],
          og_image: data.og_image || "",
          canonical_url: data.canonical_url || "",
        });
        setKeywordsInput((data.seo_keywords || []).join(", "));
      }
    } catch (error: any) {
      console.error("Error loading SEO settings:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Parse keywords from comma-separated string
      const keywords = keywordsInput
        .split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const updateData = {
        seo_title: settings.seo_title || null,
        seo_description: settings.seo_description || null,
        seo_keywords: keywords.length > 0 ? keywords : null,
        og_image: settings.og_image || null,
        canonical_url: settings.canonical_url || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("pages")
        .update(updateData)
        .eq("id", pageId);

      if (error) throw error;

      await logAction({
        action: "update",
        entityType: "page",
        entityId: pageId,
        newValues: updateData,
      });

      toast({ title: "SEO settings saved successfully" });
    } catch (error: any) {
      toast({
        title: "Error saving SEO settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const titleLength = (settings.seo_title || "").length;
  const descLength = (settings.seo_description || "").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          SEO Settings
        </CardTitle>
        <CardDescription>
          Optimize your {pageName} for search engines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meta Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-title" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Meta Title
            </Label>
            <span className={`text-xs ${titleLength > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {titleLength}/60 characters
            </span>
          </div>
          <Input
            id="seo-title"
            value={settings.seo_title || ""}
            onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
            placeholder="Page title for search engines"
            maxLength={70}
          />
          <p className="text-xs text-muted-foreground">
            Recommended: 50-60 characters. This appears as the clickable headline in search results.
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-description">Meta Description</Label>
            <span className={`text-xs ${descLength > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {descLength}/160 characters
            </span>
          </div>
          <Textarea
            id="seo-description"
            value={settings.seo_description || ""}
            onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
            placeholder="Brief description of the page content"
            rows={3}
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground">
            Recommended: 150-160 characters. This appears below the title in search results.
          </p>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="seo-keywords">SEO Keywords</Label>
          <Input
            id="seo-keywords"
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
            placeholder="dental clinic, dental implants, Nepal dentist..."
          />
          <p className="text-xs text-muted-foreground">
            Separate keywords with commas. Focus on 3-5 relevant terms.
          </p>
        </div>

        {/* OG Image */}
        <div className="space-y-2">
          <Label htmlFor="og-image" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Open Graph Image URL
          </Label>
          <Input
            id="og-image"
            value={settings.og_image || ""}
            onChange={(e) => setSettings({ ...settings, og_image: e.target.value })}
            placeholder="https://example.com/og-image.jpg"
          />
          <p className="text-xs text-muted-foreground">
            Image displayed when shared on social media. Recommended size: 1200x630 pixels.
          </p>
          {settings.og_image && (
            <div className="mt-2 p-2 border rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <img 
                src={settings.og_image} 
                alt="OG Image Preview" 
                className="max-h-32 rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Canonical URL */}
        <div className="space-y-2">
          <Label htmlFor="canonical-url" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Canonical URL
          </Label>
          <Input
            id="canonical-url"
            value={settings.canonical_url || ""}
            onChange={(e) => setSettings({ ...settings, canonical_url: e.target.value })}
            placeholder="https://kundalinidental.com/about"
          />
          <p className="text-xs text-muted-foreground">
            The preferred URL for this page. Helps avoid duplicate content issues.
          </p>
        </div>

        {/* SEO Preview */}
        <div className="space-y-2">
          <Label>Search Result Preview</Label>
          <div className="p-4 border rounded-lg bg-background">
            <div className="text-primary text-lg hover:underline cursor-pointer truncate">
              {settings.seo_title || `${pageName} | Kundalini Dental Clinic`}
            </div>
            <div className="text-green-700 text-sm truncate">
              {settings.canonical_url || `https://kundalinidental.com/${pageName.toLowerCase().replace(/\s+/g, '-')}`}
            </div>
            <div className="text-muted-foreground text-sm line-clamp-2 mt-1">
              {settings.seo_description || "No meta description set. Add a description to improve click-through rates from search results."}
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save SEO Settings
        </Button>
      </CardContent>
    </Card>
  );
}
