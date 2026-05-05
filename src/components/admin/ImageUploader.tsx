import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string; // path within site-assets bucket
  label?: string;
  placeholder?: string;
  required?: boolean;
}

/**
 * Reusable image uploader: accepts a pasted URL OR uploads a file
 * to the public `site-assets` bucket and returns the public URL.
 */
export function ImageUploader({
  value,
  onChange,
  folder = "uploads",
  label,
  placeholder = "https://... or upload below",
  required,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const valid = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!valid.includes(file.type)) {
      toast({ title: "Invalid file type", description: "PNG, JPG, WebP or SVG only", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("site-assets").getPublicUrl(path);
      onChange(publicUrl);
      toast({ title: "Image uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          title="Upload image"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onChange("")}
            title="Clear"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFile}
        className="hidden"
      />
      {value && (
        <div className="w-full h-32 bg-muted rounded border overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
        </div>
      )}
    </div>
  );
}
