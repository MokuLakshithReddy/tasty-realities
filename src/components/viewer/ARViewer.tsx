import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Smartphone, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ARViewerProps {
  modelUrl: string;
  itemName: string;
  onClose: () => void;
}

const ARViewer = ({ modelUrl, itemName, onClose }: ARViewerProps) => {
  // For demo items, use a placeholder — model-viewer needs a real URL
  const isDemo = modelUrl === "demo";
  const actualUrl = isDemo ? "" : modelUrl;

  useEffect(() => {
    // Dynamically load model-viewer script if not loaded
    if (!customElements.get("model-viewer")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
      document.head.appendChild(script);
    }
  }, []);

  if (isDemo) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col"
      >
        <div className="flex items-center justify-between p-4">
          <Badge className="bg-accent text-accent-foreground gap-1">
            <Smartphone className="h-3 w-3" /> AR Mode
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3">AR Preview</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Upload a real .glb 3D model from the dashboard to enable AR placement. Demo items show a placeholder.
            </p>
            <Button onClick={onClose} variant="outline">
              Back to Menu
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background flex flex-col"
    >
      <div className="flex items-center justify-between p-4 glass z-10">
        <div>
          <Badge className="bg-accent text-accent-foreground gap-1">
            <Smartphone className="h-3 w-3" /> AR Mode
          </Badge>
          <p className="text-sm font-medium mt-1">{itemName}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 relative">
        {/* @ts-ignore - model-viewer is a web component */}
        <model-viewer
          src={actualUrl}
          alt={`3D model of ${itemName}`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          shadow-softness="1"
          exposure="1"
          environment-image="neutral"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            "--poster-color": "transparent",
          } as React.CSSProperties}
        >
          <button
            slot="ar-button"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm flex items-center gap-2 shadow-lg"
          >
            <Smartphone className="h-4 w-4" />
            Place on Surface
          </button>
        </model-viewer>
      </div>

      <div className="p-4 glass flex gap-3 justify-center">
        <Button variant="outline" size="sm" className="gap-2" onClick={onClose}>
          <RotateCcw className="h-4 w-4" /> Back to 3D View
        </Button>
      </div>
    </motion.div>
  );
};

export default ARViewer;
