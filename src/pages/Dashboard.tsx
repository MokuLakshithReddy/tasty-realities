import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Box, Plus, LogOut, BarChart3, UtensilsCrossed, QrCode,
  Settings, Pencil, Trash2, Eye, ChevronRight, TrendingUp,
  Users, Scan
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  subscription_tier: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  model_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useRequireAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "qr" | "settings">("overview");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  // New item form
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category_id: "" });
  const [newRestaurant, setNewRestaurant] = useState({ name: "", slug: "" });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    const { data: rest } = await supabase
      .from("restaurants")
      .select("*")
      .eq("owner_id", user!.id)
      .maybeSingle();

    if (rest) {
      setRestaurant(rest);
      const [{ data: items }, { data: cats }] = await Promise.all([
        supabase.from("menu_items").select("*").eq("restaurant_id", rest.id).order("sort_order"),
        supabase.from("categories").select("*").eq("restaurant_id", rest.id).order("sort_order"),
      ]);
      if (items) setMenuItems(items);
      if (cats) setCategories(cats);
    } else {
      setShowSetup(true);
    }
  };

  const createRestaurant = async () => {
    if (!newRestaurant.name || !newRestaurant.slug) return;
    const { data, error } = await supabase.from("restaurants").insert({
      name: newRestaurant.name,
      slug: newRestaurant.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      owner_id: user!.id,
    }).select().single();

    if (error) {
      toast.error(error.message);
      return;
    }
    // Create default categories
    await supabase.from("categories").insert([
      { restaurant_id: data.id, name: "Appetizers", sort_order: 0 },
      { restaurant_id: data.id, name: "Main Course", sort_order: 1 },
      { restaurant_id: data.id, name: "Desserts", sort_order: 2 },
      { restaurant_id: data.id, name: "Drinks", sort_order: 3 },
    ]);
    toast.success("Restaurant created!");
    setShowSetup(false);
    loadData();
  };

  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price || !restaurant) return;
    const { error } = await supabase.from("menu_items").insert({
      restaurant_id: restaurant.id,
      name: newItem.name,
      description: newItem.description || null,
      price: parseFloat(newItem.price),
      category_id: newItem.category_id || null,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Menu item added!");
    setNewItem({ name: "", description: "", price: "", category_id: "" });
    setShowAddItem(false);
    loadData();
  };

  const deleteMenuItem = async (id: string) => {
    await supabase.from("menu_items").delete().eq("id", id);
    toast.success("Item deleted");
    loadData();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Setup wizard
  if (showSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-hero" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md glass rounded-2xl p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg">MenuAR</span>
          </div>
          <h1 className="text-2xl font-bold font-display mb-2">Set up your restaurant</h1>
          <p className="text-muted-foreground text-sm mb-6">Let's create your AR-powered menu</p>

          <div className="space-y-4">
            <div>
              <Label>Restaurant Name</Label>
              <Input
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant({
                  ...newRestaurant,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                })}
                placeholder="La Bella Italia"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Menu URL Slug</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">menuar.com/</span>
                <Input
                  value={newRestaurant.slug}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, slug: e.target.value })}
                  placeholder="la-bella-italia"
                />
              </div>
            </div>
            <Button onClick={createRestaurant} className="w-full" size="lg">
              Create Restaurant
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const stats = [
    { label: "Menu Items", value: menuItems.length, icon: UtensilsCrossed, color: "text-primary" },
    { label: "QR Scans Today", value: 0, icon: Scan, color: "text-accent" },
    { label: "3D Views", value: 0, icon: Eye, color: "text-primary" },
    { label: "AR Sessions", value: 0, icon: TrendingUp, color: "text-accent" },
  ];

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "menu" as const, label: "Menu", icon: UtensilsCrossed },
    { id: "qr" as const, label: "QR Codes", icon: QrCode },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <div className="sticky top-0 z-40 glass">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold">{restaurant?.name}</span>
              <Badge variant="outline" className="ml-2 text-xs">{restaurant?.subscription_tier}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate(`/menu/${restaurant?.slug}`)}>
              <Eye className="h-4 w-4 mr-2" /> Preview Menu
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-card rounded-xl border border-border/50 p-5"
                >
                  <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
                  <p className="text-2xl font-bold font-display">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-card rounded-xl border border-border/50 p-8 text-center">
              <h3 className="text-xl font-display font-bold mb-2">Get Started</h3>
              <p className="text-muted-foreground mb-4">Add menu items and share your QR code to start collecting data</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setActiveTab("menu")}>
                  <Plus className="h-4 w-4 mr-2" /> Add Menu Items
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("qr")}>
                  <QrCode className="h-4 w-4 mr-2" /> Generate QR
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Menu Items</h2>
              <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="font-display">Add Menu Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Dish name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="A brief description"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="0.00"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <select
                        value={newItem.category_id}
                        onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <Button onClick={addMenuItem} className="w-full">Add Item</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {menuItems.length === 0 ? (
              <div className="bg-gradient-card rounded-xl border border-border/50 p-12 text-center">
                <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg mb-2">No menu items yet</h3>
                <p className="text-muted-foreground mb-4">Start building your AR menu</p>
                <Button onClick={() => setShowAddItem(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add First Item
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-card rounded-xl border border-border/50 p-4 flex items-center justify-between group hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.model_url && (
                        <Badge variant="outline" className="text-accent border-accent/30">3D</Badge>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteMenuItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QR Tab */}
        {activeTab === "qr" && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-8">
              <QrCode className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">Your Menu QR Code</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Share this link or print the QR code for your tables
              </p>
              <div className="glass rounded-lg p-4 mb-4">
                <code className="text-sm text-primary break-all">
                  {window.location.origin}/menu/{restaurant?.slug}
                </code>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/menu/${restaurant?.slug}`);
                  toast.success("Link copied!");
                }}
                className="w-full"
              >
                Copy Menu Link
              </Button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-md">
            <div className="bg-gradient-card rounded-xl border border-border/50 p-6 space-y-4">
              <h3 className="font-display font-bold text-lg">Restaurant Settings</h3>
              <div>
                <Label>Restaurant Name</Label>
                <Input value={restaurant?.name || ""} disabled className="mt-1" />
              </div>
              <div>
                <Label>URL Slug</Label>
                <Input value={restaurant?.slug || ""} disabled className="mt-1" />
              </div>
              <div>
                <Label>Subscription</Label>
                <Input value={restaurant?.subscription_tier || "free"} disabled className="mt-1" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
