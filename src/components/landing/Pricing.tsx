import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: 49,
    description: "Perfect for single-location restaurants",
    features: [
      "1 restaurant location",
      "Up to 20 menu items",
      "10 3D food models",
      "Basic analytics",
      "QR code generator",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 149,
    description: "For growing restaurant brands",
    features: [
      "Up to 3 locations",
      "Unlimited menu items",
      "50 3D food models",
      "Advanced analytics dashboard",
      "Custom branding & themes",
      "AI-powered recommendations",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 399,
    description: "For restaurant chains & franchises",
    features: [
      "Unlimited locations",
      "Unlimited everything",
      "API access",
      "White-label solution",
      "Dedicated account manager",
      "Custom 3D model creation",
      "SLA guarantee",
    ],
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section className="py-32 relative" id="pricing">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Simple, <span className="text-gradient-accent">Transparent</span> Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Start free. Scale as your restaurant grows.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative rounded-2xl p-8 border transition-all duration-500 ${
                plan.popular
                  ? "border-primary/50 glow-primary bg-gradient-card scale-105"
                  : "border-border/50 bg-gradient-card hover:border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold font-display mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold font-display">${plan.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <Button
                className="w-full mb-8"
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                Get Started
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
