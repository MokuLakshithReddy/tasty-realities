import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Eye, Flame, Leaf, Star, QrCode, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ModelViewer from "@/components/viewer/ModelViewer";
import QRCodeGenerator from "@/components/viewer/QRCodeGenerator";
import ARViewer from "@/components/viewer/ARViewer";

interface ViewerItem {
  id: string;
  name: string;
  description: string;
  price: number;
  model_url: string | null;
  calories?: number;
  tags?: string[];
  category: string;
}

const demoItems: ViewerItem[] = [
  { id: "1", name: "Truffle Arancini", description: "Crispy risotto balls with black truffle and parmesan, served with saffron aioli", price: 16, model_url: "demo", calories: 340, tags: ["popular"], category: "Appetizers" },
  { id: "2", name: "Wagyu Carpaccio", description: "Thinly sliced A5 wagyu with capers, arugula, and aged balsamic", price: 28, model_url: "demo", calories: 220, tags: ["chef's pick"], category: "Appetizers" },
  { id: "3", name: "Pan-Seared Sea Bass", description: "Chilean sea bass with citrus beurre blanc, asparagus, and fingerling potatoes", price: 42, model_url: "demo", calories: 520, tags: ["popular"], category: "Main Course" },
  { id: "4", name: "Filet Mignon", description: "8oz prime beef tenderloin with truffle mash, roasted vegetables, and red wine jus", price: 58, model_url: "demo", calories: 680, tags: ["signature"], category: "Main Course" },
  { id: "5", name: "Wild Mushroom Risotto", description: "Arborio rice with porcini, chanterelle, and shiitake mushrooms, finished with aged parmesan", price: 32, model_url: "demo", calories: 450, tags: ["vegetarian"], category: "Main Course" },
  { id: "6", name: "Tiramisu", description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream", price: 14, model_url: "demo", calories: 380, category: "Desserts" },
  { id: "7", name: "Crème Brûlée", description: "Vanilla bean custard with caramelized sugar crust", price: 12, model_url: "demo", calories: 310, tags: ["popular"], category: "Desserts" },
  { id: "8", name: "Signature Old Fashioned", description: "Smoked bourbon with bitters and demerara sugar", price: 18, model_url: null, calories: 180, category: "Drinks" },
];

const ProductViewer = () => {
  const [selectedItem, setSelectedItem] = useState<ViewerItem>(demoItems[0]);
  const [activeCategory, setActiveCategory] = useState("Appetizers");
  const [showQR, setShowQR] = useState(false);
  const [showAR, setShowAR] = useState(false);

  const categories = useMemo(() => [...new Set(demoItems.map((i) => i.category))], []);
  const filteredItems = demoItems.filter((i) => i.category === activeCategory);

  const viewerUrl = typeof window !== "undefined" ? `${window.location.origin}/viewer` : "";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar / Menu panel */}
      <aside className="w-full lg:w-[380px] xl:w-[420px] lg:h-screen lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-border/50 bg-gradient-card flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg">MenuAR</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setShowQR(!showQR)}
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR Code</span>
            </Button>
          </div>
        </div>

        {/* QR Code panel */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-border/50"
            >
              <div className="p-6">
                <QRCodeGenerator url={viewerUrl} size={180} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category tabs */}
        <div className="px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <AnimatePresence mode="wait">
            {filteredItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedItem(item)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedItem.id === item.id
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/30 bg-card/50 hover:border-border hover:bg-card"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-display font-semibold text-sm">{item.name}</h3>
                  <span className="text-sm font-bold text-primary ml-2">${item.price}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.tags?.includes("popular") && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                      <Star className="h-2.5 w-2.5 text-primary" /> Popular
                    </Badge>
                  )}
                  {item.tags?.includes("vegetarian") && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5 text-accent border-accent/30">
                      <Leaf className="h-2.5 w-2.5" /> Veg
                    </Badge>
                  )}
                  {item.calories && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5">
                      <Flame className="h-2.5 w-2.5" /> {item.calories}
                    </Badge>
                  )}
                  {item.model_url && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5 text-primary border-primary/30">
                      <Eye className="h-2.5 w-2.5" /> 3D
                    </Badge>
                  )}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </aside>

      {/* 3D Viewer */}
      <main className="flex-1 flex flex-col min-h-[400px] lg:min-h-0 lg:h-screen relative">
        {/* Viewer area */}
        <div className="flex-1 relative">
          <ModelViewer modelUrl={selectedItem.model_url} itemName={selectedItem.name} />

          {/* Item info overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-0 left-0 right-0 p-4 lg:p-6"
            >
              <div className="glass rounded-2xl p-4 lg:p-5 max-w-lg">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="font-display font-bold text-xl lg:text-2xl">
                    {selectedItem.name}
                  </h2>
                  <span className="text-xl lg:text-2xl font-bold text-primary">
                    ${selectedItem.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedItem.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => toast.info(`Viewing ${selectedItem.name} in 3D mode`)}
                  >
                    <Eye className="h-4 w-4" /> View in 3D
                  </Button>
                  {selectedItem.model_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setShowAR(true)}
                    >
                      <Smartphone className="h-4 w-4" /> AR View
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interaction hint */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="text-xs gap-1.5 glass">
              <Box className="h-3 w-3" /> Drag to rotate · Scroll to zoom
            </Badge>
          </div>
        </div>
      </main>

      {/* AR Viewer Overlay */}
      <AnimatePresence>
        {showAR && selectedItem.model_url && (
          <ARViewer
            modelUrl={selectedItem.model_url}
            itemName={selectedItem.name}
            onClose={() => setShowAR(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductViewer;
