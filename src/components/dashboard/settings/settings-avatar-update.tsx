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

export default function AvatarUpdate() {
  const { user } = useUser();
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [blob, setBlob] = React.useState<PutBlobResult | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClickAvatar = () => {
    fileRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFile(file);
    setBlob(null);
    setError(null);
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    setBlob(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Vui lòng chọn một ảnh trước khi tải lên.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const newBlob = await upload(selectedFile.name, selectedFile, {
        access: "public",
        handleUploadUrl: "/api/avatar/upload",
      });

      setBlob(newBlob);
      setPreview(newBlob.url);
      setSelectedFile(null);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã có lỗi xảy ra khi tải ảnh lên.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
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
          Nhấp vào nút bên dưới để chọn ảnh từ thiết bị của bạn, sau đó bấm
          &ldquo;Tải ảnh lên&rdquo; để lưu.
        </p>
        {selectedFile && (
          <div className="text-sm">
            <span className="text-muted-foreground">Ảnh đã chọn:</span>{" "}
            <span className="text-foreground font-medium">
              {selectedFile.name}
            </span>
          </div>
        )}
        {blob && (
          <div className="border-primary/40 bg-primary/5 rounded-lg border border-dashed p-3 text-sm">
            <p className="text-foreground font-medium">
              Ảnh đã tải lên thành công.
            </p>
            <p className="text-muted-foreground">
              Bạn có thể xem ảnh tại:{" "}
              <a
                href={blob.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                {blob.url}
              </a>
            </p>
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
            Chọn ảnh
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={handleRemove}
            disabled={!preview && !blob && !selectedFile}
          >
            Gỡ ảnh
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Đang tải..." : "Tải ảnh lên"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
