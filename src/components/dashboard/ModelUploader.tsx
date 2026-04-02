import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Loader2, FileBox } from "lucide-react";
import { toast } from "sonner";

interface ModelUploaderProps {
  restaurantId: string;
  menuItemId: string;
  currentModelUrl: string | null;
  onUploadComplete: (url: string) => void;
}

const ModelUploader = ({ restaurantId, menuItemId, currentModelUrl, onUploadComplete }: ModelUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".glb") && !file.name.endsWith(".gltf")) {
      toast.error("Please upload a .glb or .gltf file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large. Max 50MB.");
      return;
    }

    setUploading(true);
    setProgress(30);

    const filePath = `${restaurantId}/${menuItemId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("models")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    setProgress(70);

    const { data: publicUrl } = supabase.storage
      .from("models")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("menu_items")
      .update({ model_url: publicUrl.publicUrl })
      .eq("id", menuItemId);

    if (updateError) {
      toast.error("Failed to save model URL");
      setUploading(false);
      return;
    }

    setProgress(100);
    toast.success("3D model uploaded!");
    onUploadComplete(publicUrl.publicUrl);
    setUploading(false);
    setProgress(0);
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        className="gap-2 w-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading {progress}%
          </>
        ) : currentModelUrl ? (
          <>
            <CheckCircle className="h-4 w-4 text-accent" />
            Replace 3D Model
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload GLB Model
          </>
        )}
      </Button>
      {currentModelUrl && (
        <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
          <FileBox className="h-3 w-3 shrink-0" />
          Model attached
        </p>
      )}
    </div>
  );
};

export default ModelUploader;
