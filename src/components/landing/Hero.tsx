import { motion } from "framer-motion";
import { ArrowRight, Scan, Eye, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Scene3D from "@/components/viewer/Scene3D";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span className="text-sm font-medium text-muted-foreground">The Future of Restaurant Menus</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold font-display leading-[1.05] mb-6">
              See Your Food
              <br />
              <span className="text-gradient-primary">Before You</span>
              <br />
              <span className="text-gradient-accent">Order It</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              Transform your restaurant menu into an immersive 3D & AR experience.
              Guests scan, explore, and fall in love with dishes — before a single plate leaves the kitchen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group text-lg px-8 py-6 glow-primary">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Scan className="h-4 w-4 text-primary" />
                <span>QR Scan</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-accent" />
                <span>3D Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <span>AR on Table</span>
              </div>
            </div>
          </motion.div>

          {/* Right - 3D Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-hero border border-border/30" />
            <Scene3D />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full">
              <p className="text-xs text-muted-foreground">
                ✨ Interactive — drag to rotate
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
