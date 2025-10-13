"use client";

import { useActionState, useEffect, useState } from "react";
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
import { Subscription } from "@/types/subscription";
import { deleteSubscription } from "@/actions/subscriptions-actions";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("admin.subscription");
  const [confirmText, setConfirmText] = useState("");
  const [deleteState, deleteAction, pending] = useActionState(
    deleteSubscription,
    { success: false, msg: "" },
  );

  const resetForm = () => {
    setConfirmText("");
  };

  useEffect(() => {
    if (deleteState.success) {
      toast.success(t("delete.toast.success"), {
        description: deleteState.msg,
      });
      onOpenChange(false);
      resetForm();
    } else if (!deleteState.success && deleteState.msg) {
      toast.error(t("delete.delete.failure"), {
        description: deleteState.msg,
      });
    }
  }, [deleteState.msg, onOpenChange]);

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
          <AlertDialogTitle>{t("delete.dialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">
              {t("delete.dialog.description.1")}{" "}
              <span className="font-semibold">{subscription.name}</span>{" "}
              {t("delete.dialog.description.2")}
            </span>
            <br />
            <span className="block">
              Điều này có thể ảnh hưởng đến các người dùng đang sử dụng gói này.
              {t("delete.dialog.description.3")}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">
              {t("delete.dialog.confirm")}:{" "}
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
            {pending
              ? t("delete.dialog.button.loading")
              : t("delete.dialog.button.delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
