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
import type { Station } from "@/lib/zod/station/station.types";
import { deleteStation } from "@/actions/stations-actions";

interface DeleteStationProps {
  station: Station;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteStation({
  station,
  open,
  onOpenChange,
}: DeleteStationProps) {
  const [confirmText, setConfirmText] = useState("");
  const [deleteState, deleteAction, pending] = useActionState(deleteStation, {
    success: false,
    msg: "",
  });

  const resetForm = () => setConfirmText("");

  useEffect(() => {
    if (deleteState.success) {
      toast.success("Trạm đã được xóa", { description: deleteState.msg });
      onOpenChange(false);
      resetForm();
    } else if (!deleteState.success && deleteState.msg) {
      toast.error("Xóa không thành công", { description: deleteState.msg });
    }
  }, [deleteState.msg, deleteState.success, onOpenChange]);

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
          <AlertDialogTitle>Xóa trạm</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">
              Bạn có chắc chắn muốn xóa trạm{" "}
              <span className="font-semibold">{station.name}</span>?
            </span>
            <br />
            <span className="block">Hành động này không thể hoàn tác.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">
              Xác nhận xóa:{" "}
              <span className="text-foreground font-semibold">
                {station.name}
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
          <input type="hidden" name="id" value={station.id} />
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
            disabled={pending || confirmText !== station.name}
          >
            {pending ? "Đang xóa..." : "Xóa"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
