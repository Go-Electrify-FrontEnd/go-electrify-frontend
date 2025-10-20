"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { refreshTokens } from "@/actions/login-actions";
import { startTransition, useEffect, useRef, useState, useMemo } from "react";

export default function AvatarUpdate() {
  const { user } = useUser();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(
    () => user?.avatar ?? null,
  );
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const refreshTimeoutRef = useRef<number | null>(null);

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

  // Derive the displayed preview from local preview state or the user's stored avatar.
  // useMemo avoids recalculating the derived value on every render.
  const displayedPreview = useMemo(
    () => preview ?? user?.avatar ?? null,
    [preview, user?.avatar],
  );

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

      startTransition(() => {
        refreshTokens();
      });

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

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      if (originalImage && originalImage.startsWith("blob:")) {
        URL.revokeObjectURL(originalImage);
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [preview, originalImage]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ảnh đại diện</CardTitle>
          <CardDescription>
            Tải lên và quản lý ảnh đại diện của bạn
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Left side - Avatar Preview */}
            <div className="flex flex-col items-center gap-4 lg:w-64">
              <div className="relative">
                <Avatar className="ring-background size-32 shadow-lg ring-4 lg:size-40">
                  {displayedPreview ? (
                    <AvatarImage
                      src={displayedPreview}
                      alt={user?.name ?? "Avatar"}
                    />
                  ) : (
                    <AvatarFallback className="text-4xl font-semibold lg:text-5xl">
                      {user?.name
                        ?.split(" ")
                        .filter((w) => w.length > 0)
                        .map((w) => w[0]?.toUpperCase() ?? "")
                        .join("") || "ND"}
                    </AvatarFallback>
                  )}
                </Avatar>
                {displayedPreview && (
                  <div className="bg-primary text-primary-foreground absolute -right-2 -bottom-2 rounded-full p-2 shadow-md">
                    <Crop className="size-4" />
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="text-foreground font-medium">
                  {user?.name || "Người dùng"}
                </p>
                <p className="text-muted-foreground text-sm">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            {/* Right side - Upload Controls */}
            <div className="flex flex-1 flex-col gap-4">
              {/* Instructions */}
              <div className="bg-muted/50 space-y-2 rounded-lg border p-4">
                <h4 className="text-foreground text-sm font-semibold">
                  Hướng dẫn tải ảnh
                </h4>
                <ul className="text-muted-foreground space-y-1.5 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      Nhấp &ldquo;Chọn ảnh&rdquo; để chọn ảnh từ thiết bị
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Cắt và điều chỉnh ảnh theo ý muốn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Nhấp &ldquo;Tải ảnh lên&rdquo; để lưu thay đổi</span>
                  </li>
                </ul>
              </div>

              {/* Selected File Info */}
              {(croppedFile || selectedFile) && (
                <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                      <Crop className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground mb-1 font-medium">
                        {croppedFile?.name || selectedFile?.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {croppedFile
                          ? "✓ Đã cắt và sẵn sàng tải lên"
                          : "Vui lòng cắt ảnh trước khi tải lên"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-4">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={handleClickAvatar}
                  type="button"
                  className="flex-1 sm:flex-none"
                >
                  <Crop className="mr-2 size-4" />
                  Chọn ảnh
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleRemove}
                  disabled={
                    !displayedPreview && !blob && !croppedFile && !selectedFile
                  }
                  className="flex-1 sm:flex-none"
                >
                  Gỡ ảnh
                </Button>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={!croppedFile || isUploading}
                  className="flex-1 sm:flex-auto"
                >
                  {isUploading ? "Đang tải..." : "Tải ảnh lên"}
                </Button>
              </div>

              {/* File Requirements */}
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-muted-foreground text-xs">
                  <span className="font-medium">Yêu cầu:</span> JPG, PNG, GIF •
                  Tối đa 5MB • Tỷ lệ khuyến nghị 1:1
                </p>
              </div>
            </div>
          </div>
        </CardContent>
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
