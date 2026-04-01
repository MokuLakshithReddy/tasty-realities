import { motion } from "framer-motion";
import { QrCode, Box, Smartphone, ShoppingCart } from "lucide-react";

const steps = [
  {
    icon: QrCode,
    title: "Scan QR Code",
    description: "Guest scans the table QR code — instantly opens your digital menu. No app download needed.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Box,
    title: "Explore in 3D",
    description: "Every dish rendered in stunning 3D. Rotate, zoom, and inspect every detail before deciding.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Smartphone,
    title: "View in AR",
    description: "Place the dish on your actual table using AR. See the real size, presentation, and plating.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ShoppingCart,
    title: "Order Confidently",
    description: "No more guessing. Guests order exactly what they want — boosting satisfaction and revenue.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            From scan to order in under 60 seconds
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-border/50 z-0" />
              )}
              <div className="bg-gradient-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 group-hover:glow-primary">
                <div className={`w-14 h-14 rounded-xl ${step.bg} flex items-center justify-center mb-6`}>
                  <step.icon className={`h-7 w-7 ${step.color}`} />
                </div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
