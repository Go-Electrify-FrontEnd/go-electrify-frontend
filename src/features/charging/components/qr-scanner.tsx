"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: Error) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");

  const startScanning = () => {
    setError("");
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted relative aspect-video overflow-hidden rounded-lg border">
        {isScanning ? (
          <Scanner
            onScan={(detectedCodes) => {
              if (detectedCodes.length > 0) {
                onScan(detectedCodes[0].rawValue);
                setIsScanning(false);
              }
            }}
            onError={(error: any) => {
              console.error("QR Scanner error:", error);
              setError("Không thể truy cập camera hoặc quét mã QR thất bại");
              setIsScanning(false);
              if (onError) {
                onError(new Error(error?.message || "QR scan error"));
              }
            }}
            constraints={{
              facingMode: "environment", // Prefer back camera
            }}
            styles={{
              container: {
                width: "100%",
                height: "100%",
                borderRadius: "0.5rem",
              },
              video: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
              },
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <CameraOff className="text-muted-foreground mx-auto h-12 w-12" />
              <p className="text-muted-foreground mt-2 text-sm">
                Camera chưa được kích hoạt
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {!isScanning ? (
          <Button onClick={startScanning} className="w-full" size="lg">
            <Camera className="mr-2 h-4 w-4" />
            Bắt đầu quét
          </Button>
        ) : (
          <Button
            onClick={stopScanning}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <CameraOff className="mr-2 h-4 w-4" />
            Dừng quét
          </Button>
        )}
      </div>
    </div>
  );
}
