import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Loader2, Trash2, Image as ImageIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/use-audit-log";

interface LogoUploaderProps {
  currentLogoUrl: string | null;
  onLogoChange: (url: string | null) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

export function LogoUploader({ currentLogoUrl, onLogoChange, onSave, saving }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { logAction } = useAuditLog();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, SVG, or WebP image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Delete old logo if exists
      if (currentLogoUrl) {
        const oldPath = currentLogoUrl.split('/site-assets/')[1];
        if (oldPath) {
          await supabase.storage.from('site-assets').remove([oldPath]);
        }
      }

      // Upload new logo
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onLogoChange(publicUrl);

      await logAction({
        action: "update",
        entityType: "setting",
        entityId: "site_logo",
        newValues: { logo_url: publicUrl },
      });

      toast({ title: "Logo uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Error uploading logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = async () => {
    if (!currentLogoUrl) return;

    setUploading(true);
    try {
      const oldPath = currentLogoUrl.split('/site-assets/')[1];
      if (oldPath) {
        const { error } = await supabase.storage.from('site-assets').remove([oldPath]);
        if (error) throw error;
      }

      setPreviewUrl(null);
      onLogoChange(null);

      await logAction({
        action: "delete",
        entityType: "setting",
        entityId: "site_logo",
        oldValues: { logo_url: currentLogoUrl },
      });

      toast({ title: "Logo removed" });
    } catch (error: any) {
      toast({
        title: "Error removing logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Site Logo
        </CardTitle>
        <CardDescription>
          Upload your clinic logo. It will appear in the header and other areas of the website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="flex items-start gap-6">
          <div className="w-40 h-40 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30 overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Logo preview"
                className="max-w-full max-h-full object-contain p-2"
              />
            ) : (
              <div className="text-center text-muted-foreground p-4">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No logo uploaded</p>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="logo-upload" className="text-sm font-medium">
                Upload Logo
              </Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Recommended: PNG or SVG with transparent background. Max 2MB.
              </p>
              <div className="flex gap-2">
                <Input
                  id="logo-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="flex-1"
                />
                {previewUrl && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleRemoveLogo}
                    disabled={uploading}
                    title="Remove logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </div>
            )}

            <div className="pt-2">
              <Button onClick={onSave} disabled={saving || uploading}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Logo Settings
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
