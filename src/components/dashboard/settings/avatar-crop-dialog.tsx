"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define type for pixel crop area
type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface AvatarCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  originalFileName?: string;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  onCancel: () => void;
}

// Helper function to create an image element
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

// Helper function to get cropped image as blob
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = pixelCrop.width,
  outputHeight: number = pixelCrop.height,
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  } catch (error) {
    console.error("Error in getCroppedImg:", error);
    return null;
  }
}

export function AvatarCropDialog({
  open,
  onOpenChange,
  imageUrl,
  originalFileName = "avatar.jpg",
  onCropComplete,
  onCancel,
}: AvatarCropDialogProps) {
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleCropChange = React.useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels || !imageUrl) {
      return;
    }

    setIsProcessing(true);

    try {
      const croppedBlob = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        400, // Output size: 400x400
        400,
      );

      if (!croppedBlob) {
        throw new Error("Không thể tạo ảnh đã cắt.");
      }

      // Create a new file from the blob
      const croppedFile = new File([croppedBlob], originalFileName, {
        type: "image/jpeg",
      });

      const previewUrl = URL.createObjectURL(croppedBlob);

      onCropComplete(croppedFile, previewUrl);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error("Error during cropping:", error);
      // Error is logged, parent component can handle if needed
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCroppedAreaPixels(null);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cắt ảnh đại diện</DialogTitle>
          <DialogDescription>
            Di chuyển và thay đổi kích thước vùng cắt để chọn phần ảnh bạn muốn
            sử dụng làm ảnh đại diện.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {imageUrl && (
            <Cropper
              className="h-96 w-full"
              image={imageUrl}
              onCropChange={handleCropChange}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea className="rounded-full" />
            </Cropper>
          )}

          <p className="text-muted-foreground text-center text-xs">
            Sử dụng chuột hoặc ngón tay để di chuyển và thu phóng ảnh
          </p>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!croppedAreaPixels}
          >
            Xác nhận cắt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
