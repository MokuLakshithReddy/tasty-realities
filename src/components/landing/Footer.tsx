import { Box } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Box className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold">MenuAR</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 MenuAR. Transforming how the world experiences food.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
