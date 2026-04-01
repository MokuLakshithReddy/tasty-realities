import { motion } from "framer-motion";
import { TrendingUp, Users, Sparkles, Globe, BarChart3, Zap } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Boost Order Value 25%+",
    description: "Guests who preview in AR order more confidently and spend more per visit.",
  },
  {
    icon: Users,
    title: "Zero Friction Experience",
    description: "No app download. Scan QR, browse 3D menu, view in AR — all in the browser.",
  },
  {
    icon: Sparkles,
    title: "AI Smart Recommendations",
    description: "Our AI tracks viewing patterns to suggest dishes guests are most likely to love.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Auto-translate menus for international guests. Break language barriers.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Know which dishes get the most 3D views, AR interactions, and conversions.",
  },
  {
    icon: Zap,
    title: "5-Minute Setup",
    description: "Upload your menu, add photos, and we generate 3D models. Print QR codes and go.",
  },
];

const Features = () => {
  return (
    <section className="py-32 relative" id="features">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Why Restaurants <span className="text-gradient-primary">Love Us</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Everything you need to create unforgettable dining experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gradient-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-display mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
