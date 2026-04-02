import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Eye, ShoppingCart, ArrowLeft, Flame, Leaf, Star, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Scene3D from "@/components/viewer/Scene3D";
import ARViewer from "@/components/viewer/ARViewer";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  model_url: string | null;
  calories: number | null;
  allergens: string[] | null;
  tags: string[] | null;
  is_available: boolean;
  is_featured: boolean;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
  slug: string;
}

// Demo data for when no restaurant exists yet
const demoCategories: Category[] = [
  { id: "1", name: "Appetizers", sort_order: 0 },
  { id: "2", name: "Main Course", sort_order: 1 },
  { id: "3", name: "Desserts", sort_order: 2 },
  { id: "4", name: "Drinks", sort_order: 3 },
];

const demoItems: MenuItem[] = [
  { id: "1", name: "Truffle Arancini", description: "Crispy risotto balls with black truffle and parmesan, served with saffron aioli", price: 16, image_url: null, model_url: "demo", calories: 340, allergens: ["gluten", "dairy"], tags: ["popular"], is_available: true, is_featured: true, category_id: "1" },
  { id: "2", name: "Wagyu Carpaccio", description: "Thinly sliced A5 wagyu with capers, arugula, and aged balsamic", price: 28, image_url: null, model_url: "demo", calories: 220, allergens: null, tags: ["chef's pick"], is_available: true, is_featured: false, category_id: "1" },
  { id: "3", name: "Pan-Seared Sea Bass", description: "Chilean sea bass with citrus beurre blanc, asparagus, and fingerling potatoes", price: 42, image_url: null, model_url: "demo", calories: 520, allergens: ["fish", "dairy"], tags: ["popular"], is_available: true, is_featured: true, category_id: "2" },
  { id: "4", name: "Filet Mignon", description: "8oz prime beef tenderloin with truffle mash, roasted vegetables, and red wine jus", price: 58, image_url: null, model_url: "demo", calories: 680, allergens: null, tags: ["signature"], is_available: true, is_featured: true, category_id: "2" },
  { id: "5", name: "Wild Mushroom Risotto", description: "Arborio rice with porcini, chanterelle, and shiitake mushrooms, finished with aged parmesan", price: 32, image_url: null, model_url: "demo", calories: 450, allergens: ["dairy"], tags: ["vegetarian"], is_available: true, is_featured: false, category_id: "2" },
  { id: "6", name: "Tiramisu", description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream", price: 14, image_url: null, model_url: "demo", calories: 380, allergens: ["gluten", "dairy", "eggs"], tags: null, is_available: true, is_featured: false, category_id: "3" },
  { id: "7", name: "Crème Brûlée", description: "Vanilla bean custard with caramelized sugar crust", price: 12, image_url: null, model_url: "demo", calories: 310, allergens: ["dairy", "eggs"], tags: ["popular"], is_available: true, is_featured: true, category_id: "3" },
  { id: "8", name: "Signature Cocktail", description: "Smoked old fashioned with bourbon, bitters, and demerara", price: 18, image_url: null, model_url: null, calories: 180, allergens: null, tags: null, is_available: true, is_featured: false, category_id: "4" },
];

const MenuPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [items, setItems] = useState<MenuItem[]>(demoItems);
  const [activeCategory, setActiveCategory] = useState<string>("1");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showAR, setShowAR] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    if (slug && slug !== "demo") {
      loadRestaurant();
    }
  }, [slug]);

  const loadRestaurant = async () => {
    const { data: rest } = await supabase
      .from("restaurants")
      .select("*")
      .eq("slug", slug!)
      .single();

    if (rest) {
      setRestaurant(rest);
      setIsDemo(false);
      const { data: cats } = await supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", rest.id)
        .order("sort_order");
      if (cats && cats.length > 0) {
        setCategories(cats);
        setActiveCategory(cats[0].id);
      }
      const { data: menuItems } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", rest.id)
        .eq("is_available", true)
        .order("sort_order");
      if (menuItems) setItems(menuItems);
    }
  };

  const filteredItems = items.filter((item) => item.category_id === activeCategory);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 glass">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold">
              {restaurant?.name || "MenuAR Demo"}
            </span>
          </div>
          {isDemo && (
            <Badge variant="outline" className="text-primary border-primary/30">
              Demo Menu
            </Badge>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[52px] z-30 glass">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4">
          <AnimatePresence mode="wait">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all group"
              >
                <div className="p-5 flex gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-display font-bold text-lg">{item.name}</h3>
                      <span className="text-lg font-bold text-primary ml-2 shrink-0">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.is_featured && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Star className="h-3 w-3 text-primary" /> Featured
                        </Badge>
                      )}
                      {item.calories && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Flame className="h-3 w-3" /> {item.calories} cal
                        </Badge>
                      )}
                      {item.tags?.includes("vegetarian") && (
                        <Badge variant="outline" className="gap-1 text-xs text-accent border-accent/30">
                          <Leaf className="h-3 w-3" /> Vegetarian
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* 3D Preview Button */}
                  {item.model_url && (
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="w-20 h-20 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center gap-1 shrink-0 hover:bg-primary/20 transition-colors"
                    >
                      <Eye className="h-5 w-5 text-primary" />
                      <span className="text-[10px] font-medium text-primary">View 3D</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 3D Viewer Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to menu
                </button>
                <Badge className="bg-accent text-accent-foreground">3D Preview</Badge>
              </div>

              <div className="flex-1">
                <Scene3D />
              </div>

              <div className="p-6 glass rounded-t-3xl">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-display font-bold">{selectedItem.name}</h2>
                  <span className="text-2xl font-bold text-primary">${selectedItem.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{selectedItem.description}</p>
                <div className="flex gap-3">
                  <Button className="flex-1 gap-2" size="lg">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Order
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Eye className="h-5 w-5" />
                    AR View
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
