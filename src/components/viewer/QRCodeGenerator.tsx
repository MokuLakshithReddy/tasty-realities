import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
}

const QRCodeGenerator = ({ url, size = 200 }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 2,
      color: { dark: "#ffffff", light: "#00000000" },
      errorCorrectionLevel: "H",
    }).then(() => setReady(true));
  }, [url, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    // Create a new canvas with background for download
    const downloadCanvas = document.createElement("canvas");
    downloadCanvas.width = size + 40;
    downloadCanvas.height = size + 40;
    const ctx = downloadCanvas.getContext("2d")!;
    ctx.fillStyle = "#0f172a";
    ctx.roundRect(0, 0, downloadCanvas.width, downloadCanvas.height, 16);
    ctx.fill();
    ctx.drawImage(canvasRef.current, 20, 20);
    const link = document.createElement("a");
    link.download = "menu-qr-code.png";
    link.href = downloadCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 rounded-2xl bg-card border border-border/50">
        <canvas ref={canvasRef} />
      </div>
      {ready && (
        <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download QR Code
        </Button>
      )}
      <p className="text-xs text-muted-foreground text-center max-w-[240px]">
        Scan to open the interactive 3D menu viewer
      </p>
    </div>
  );
};

export default QRCodeGenerator;
