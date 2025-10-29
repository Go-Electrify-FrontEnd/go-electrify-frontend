"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
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
import { toast } from "sonner";
import type { Subscription } from "@/lib/zod/subscription/subscription.types";
import { deleteSubscription } from "../services/subscriptions";

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
  // Vietnamese literals
  const [confirmText, setConfirmText] = useState("");
  const [deleteState, deleteAction, pending] = useActionState(
    deleteSubscription,
    { success: false, msg: "" },
  );

  const resetForm = useCallback(() => {
    setConfirmText("");
  }, []);

  useEffect(() => {
    if (deleteState.success) {
      toast.success("Loại đăng ký đã được xóa", {
        description: deleteState.msg,
      });
      onOpenChange(false);
      // Schedule reset after dialog closes
      queueMicrotask(() => resetForm());
    } else if (!deleteState.success && deleteState.msg) {
      toast.error("Xóa không thành công", {
        description: deleteState.msg,
      });
    }
  }, [deleteState.msg, deleteState.success, onOpenChange, resetForm]);

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
          <AlertDialogTitle>Xóa gói đăng ký</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">
              Bạn có chắc chắn muốn xóa gói{" "}
              <span className="font-semibold">{subscription.name}</span>?
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
              Xác nhận xóa:{" "}
              <span className="text-foreground font-semibold">
                {subscription.name}
              </span>
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={pending}
            />
          </div>
        </div>

        <form id="delete-form" action={deleteAction}>
          <input type="hidden" name="id" value={subscription.id} />
        </form>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Hủy
          </Button>
          <Button
            form="delete-form"
            variant="destructive"
            type="submit"
            disabled={pending || confirmText !== subscription.name}
          >
            {pending ? "Đang xóa..." : "Xóa"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
