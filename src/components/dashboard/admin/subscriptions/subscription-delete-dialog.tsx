"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Subscription } from "@/types";

interface DeleteSubscriptionProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSubscription({
  subscription,
  open,
  onOpenChange,
}: DeleteSubscriptionProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== subscription.name) {
      toast.error("Tên gói đăng ký không khớp");
      return;
    }

    setIsLoading(true);

    try {
      // Here you would make the API call to delete the subscription
      // await deleteSubscription(subscription.id);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast.success("Xóa gói đăng ký thành công!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa gói đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setConfirmText("");
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">
              Hành động này không thể hoàn tác. Gói đăng ký{" "}
              <span className="font-semibold">{subscription.name}</span> sẽ bị
              xóa vĩnh viễn khỏi hệ thống.
            </span>
            <br />
            <span className="block">
              Điều này có thể ảnh hưởng đến các người dùng đang sử dụng gói này.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">
              Để xác nhận, vui lòng nhập tên gói đăng ký:{" "}
              <span className="text-foreground font-semibold">
                {subscription.name}
              </span>
            </p>
            <Input
              placeholder="Nhập tên gói đăng ký để xác nhận"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading || confirmText !== subscription.name}
          >
            {isLoading ? "Đang xóa..." : "Xóa gói đăng ký"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
