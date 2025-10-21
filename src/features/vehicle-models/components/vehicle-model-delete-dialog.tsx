"use client";

import { deleteVehicleModel } from "@/actions/vehicle-models-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CarModel } from "@/lib/zod/vehicle-model/vehicle-model.types";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Field, FieldGroup } from "@/components/ui/field";

interface VehicleModelDeleteProps {
  carModel: CarModel;
  trigger: ReactNode;
}

const initialState = {
  success: false,
  msg: "",
};

export default function VehicleModelDeleteDialog({
  carModel: { id, modelName },
  trigger,
}: VehicleModelDeleteProps) {
  const t = {
    title: "Xóa mẫu xe",
    description: "Bạn sắp xóa mẫu xe",
    confirmText: "Nhập tên mẫu xe để xác nhận",
    placeholder: "Nhập tên mẫu xe",
    "common.cancel": "Hủy",
    deleting: "Đang xóa...",
    deleteButton: "Xóa",
  };
  const [open, setOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [deleteState, deleteAction, pending] = useActionState(
    deleteVehicleModel,
    initialState,
  );

  useEffect(() => {
    if (deleteState.success) {
      setOpen(false);
      setConfirmationText("");
    }

    if (deleteState.msg) {
      if (deleteState.success) {
        toast.success(deleteState.msg);
      } else {
        toast.error(deleteState.msg);
      }
    }
  }, [deleteState.success, deleteState.msg]);

  const handleCancel = () => {
    setOpen(false);
    setConfirmationText("");
  };

  const isConfirmationValid = confirmationText === modelName;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {t.description}
            <span className="font-semibold"> &ldquo;{modelName}&rdquo;</span>
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" action={deleteAction}>
          <input type="hidden" name="id" value={id} />
          <FieldGroup className="my-4">
            <Field>
              <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
                <p className="text-muted-foreground mb-2 text-sm">
                  {t.confirmText}:{" "}
                  <span className="text-foreground font-semibold">
                    {modelName}
                  </span>
                </p>
                <Input
                  placeholder={t.placeholder}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  value={confirmationText}
                  disabled={pending}
                  autoComplete="off"
                />
              </div>
            </Field>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={pending}
              >
                {t["common.cancel"]}
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!isConfirmationValid || pending}
              >
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {pending ? t.deleting : t.deleteButton}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
