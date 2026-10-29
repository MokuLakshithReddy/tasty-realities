import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-6 leading-tight">
            Ready to <span className="text-gradient-primary">Transform</span> Your Menu?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join 500+ restaurants already using AR menus to boost engagement and revenue. Start your free 14-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group text-lg px-10 py-6 glow-primary" onClick={() => navigate("/auth")}>
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6" onClick={() => navigate("/menu/demo")}>
              Book a Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required · Setup in 5 minutes · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
