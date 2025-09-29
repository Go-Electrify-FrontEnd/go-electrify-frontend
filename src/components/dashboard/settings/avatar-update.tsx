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

export default function AvatarUpdate() {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  const mockUser = {
    fullName: "Người dùng",
    email: "user@example.com",
  };

  const handleClickAvatar = () => {
    fileRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Card className="max-w-[1000px]">
      {/* Header uses relative positioning so the avatar can be absolutely positioned */}
      <CardHeader className="relative">
        <CardTitle>Ảnh đại diện</CardTitle>
        <CardDescription>Đây là ảnh đại diện của bạn.</CardDescription>

        {/* absolutely positioned avatar on the top-right */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={handleClickAvatar}
            aria-label="Tải lên ảnh đại diện"
            className="focus:ring-ring rounded-full focus:ring-2 focus:outline-none"
          >
            <Avatar className="h-16 w-16">
              {preview ? (
                <AvatarImage src={preview} alt={mockUser.fullName} />
              ) : (
                <AvatarFallback className="text-lg font-semibold">
                  {mockUser.fullName
                    ?.split(" ")
                    .filter((w) => w.length > 0)
                    .map((w) => w[0]?.toUpperCase() ?? "")
                    .join("") || "ND"}
                </AvatarFallback>
              )}
            </Avatar>
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">
          Nhấp vào ảnh đại diện để tải ảnh từ thiết bị của bạn.
        </p>
      </CardContent>

      {/* Footer uses relative container; actions are absolutely positioned to the right */}
      <CardFooter className="relative border-t">
        <p className="text-muted-foreground text-sm">
          Ảnh đại diện là tuỳ chọn nhưng nên thiết lập để hoàn thiện hồ sơ.
        </p>

        <div className="absolute top-1/2 right-4 flex h-12 -translate-y-1/2 items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
