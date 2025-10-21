"use client";

import React, { useActionState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { ConnectorType } from "@/lib/zod/connector-type/connector-type.types";
import { handleDeleteConnectorType } from "@/actions/connector-type-actions";
import { Loader2 } from "lucide-react";

interface DeleteConnectorTypeProps {
  connectorType: ConnectorType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = { success: false, msg: "" };

export const DeleteConnectorType = ({
  connectorType,
  open,
  onOpenChange,
}: DeleteConnectorTypeProps) => {
  const [deleteState, deleteAction, pending] = useActionState(
    handleDeleteConnectorType,
    initialState,
  );

  useEffect(() => {
    if (!deleteState.msg) return;
    if (deleteState.success) {
      toast.success("Cổng kết nối đã được xóa thành công.");
      onOpenChange(false);
    } else {
      toast.error("Đã xảy ra lỗi khi xóa cổng kết nối.");
      onOpenChange(false);
    }
  }, [deleteState]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa cổng kết nối</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa cổng kết nối{" "}
            <span className="font-semibold">{connectorType.name}</span>? Hành
            động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={connectorType.id} />
            <AlertDialogAction
              type="submit"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={pending}
            >
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
