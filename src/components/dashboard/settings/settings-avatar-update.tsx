"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useUser } from "@/contexts/user-context";
import { Crop } from "lucide-react";
import { toast } from "sonner";
import { AvatarCropDialog } from "./avatar-crop-dialog";

export default function AvatarUpdate() {
  const { user } = useUser();
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [originalImage, setOriginalImage] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [blob, setBlob] = React.useState<PutBlobResult | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = React.useState(false);
  const [croppedFile, setCroppedFile] = React.useState<File | null>(null);

  const handleClickAvatar = () => {
    fileRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setSelectedFile(file);
    setShowCropDialog(true);
    setBlob(null);
    setError(null);
  };

  const handleCropComplete = (croppedFile: File, previewUrl: string) => {
    // Revoke old preview URL
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(previewUrl);
    setCroppedFile(croppedFile);
    setShowCropDialog(false);
  };

  const handleCancelCrop = () => {
    setShowCropDialog(false);
    setOriginalImage(null);
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    if (originalImage && originalImage.startsWith("blob:")) {
      URL.revokeObjectURL(originalImage);
    }

    setPreview(null);
    setOriginalImage(null);
    setSelectedFile(null);
    setCroppedFile(null);
    setBlob(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleUpload = async () => {
    const fileToUpload = croppedFile || selectedFile;

    if (!fileToUpload) {
      setError("Vui lòng chọn và cắt ảnh trước khi tải lên.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Ensure the file name is URL-safe
      const uuid = crypto.randomUUID();
      const safeName = `avatar-${uuid}.jpg`;
      const newBlob = await upload(safeName, fileToUpload, {
        access: "public",
        handleUploadUrl: `/api/avatar/upload`,
      });

      setBlob(newBlob);

      // Clean up old preview
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      setPreview(newBlob.url);
      setSelectedFile(null);
      setCroppedFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      // Show success toast
      toast.success("Tải ảnh lên thành công!", {
        description: "Ảnh đại diện của bạn đã được cập nhật.",
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError("Đã có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.");
      toast.error("Tải ảnh lên thất bại", {
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      if (originalImage && originalImage.startsWith("blob:")) {
        URL.revokeObjectURL(originalImage);
      }
    };
  }, [preview, originalImage]);

  return (
    <>
      <Card className="max-w-[1000px]">
        <CardHeader className="relative">
          <CardTitle>Ảnh đại diện</CardTitle>
          <CardDescription>Đây là ảnh đại diện của bạn.</CardDescription>

          {/* absolutely positioned avatar on the top-right */}
          <div className="absolute top-4 right-4">
            <Avatar className="h-16 w-16">
              {preview ? (
                <AvatarImage src={preview} alt={user!.name} />
              ) : (
                <AvatarFallback className="text-lg font-semibold">
                  {user?.name
                    ?.split(" ")
                    .filter((w) => w.length > 0)
                    .map((w) => w[0]?.toUpperCase() ?? "")
                    .join("") || "ND"}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Nhấp vào nút bên dưới để chọn ảnh từ thiết bị của bạn, cắt ảnh theo
            ý muốn, sau đó bấm &ldquo;Tải ảnh lên&rdquo; để lưu.
          </p>
          {(croppedFile || selectedFile) && (
            <div className="text-sm">
              <span className="text-muted-foreground">Ảnh đã chọn:</span>{" "}
              <span className="text-foreground font-medium">
                {croppedFile?.name || selectedFile?.name}
              </span>
              {croppedFile && (
                <span className="text-muted-foreground ml-2">(đã cắt)</span>
              )}
            </div>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Ảnh đại diện là tùy chọn nhưng nên thiết lập để hoàn thiện hồ sơ.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="outline" onClick={handleClickAvatar} type="button">
              <Crop className="mr-2 h-4 w-4" />
              Chọn ảnh
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={handleRemove}
              disabled={!preview && !blob && !croppedFile && !selectedFile}
            >
              Gỡ ảnh
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!croppedFile || isUploading}
            >
              {isUploading ? "Đang tải..." : "Tải ảnh lên"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Crop Dialog */}
      <AvatarCropDialog
        open={showCropDialog}
        onOpenChange={setShowCropDialog}
        imageUrl={originalImage}
        originalFileName={selectedFile?.name}
        onCropComplete={handleCropComplete}
        onCancel={handleCancelCrop}
      />
    </>
  );
}
