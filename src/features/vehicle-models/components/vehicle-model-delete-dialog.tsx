"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { deleteVehicleModel } from "../services/vehicle-models-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useServerAction } from "@/hooks/use-server-action";
import {
  VehicleModelDeleteFormData,
  vehicleModelDeleteSchema,
} from "../schemas/vehicle-model.request";
import { CarModel } from "@/types/car";

interface VehicleModelDeleteProps {
  carModel: CarModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = {
  success: false,
  msg: "",
};

export default function VehicleModelDeleteDialog({
  carModel: { id, modelName },
  open,
  onOpenChange,
}: VehicleModelDeleteProps) {
  const [pending, setPending] = useState(false);

  const { execute } = useServerAction(deleteVehicleModel, initialState, {
    onSettled: (result) => {
      if (result.success) {
        toast.success("Mẫu xe đã được xóa", { description: result.msg });
        onOpenChange(false);
        form.reset();
      } else if (result.msg) {
        toast.error("Xóa mẫu xe thất bại", { description: result.msg });
      }
      setPending(false);
    },
  });

  const form = useForm<VehicleModelDeleteFormData>({
    resolver: zodResolver(vehicleModelDeleteSchema),
    defaultValues: {
      confirmText: "",
    },
  });

  const confirmText = form.watch("confirmText");
  const isInputValid = confirmText === modelName;

  const onSubmit: SubmitHandler<VehicleModelDeleteFormData> = (data) => {
    if (data.confirmText !== modelName) {
      form.setError("confirmText", {
        type: "manual",
        message: "Tên mẫu xe không khớp. Vui lòng nhập chính xác tên mẫu xe.",
      });
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.append("id", id.toString());
    execute(formData);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa mẫu xe</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">
              Bạn có chắc chắn muốn xóa mẫu xe{" "}
              <span className="font-semibold">{modelName}</span>?
            </span>
            <br />
            <span className="block">Hành động này không thể hoàn tác.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          id="delete-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <input type="hidden" name="id" value={id} />

          <FieldGroup>
            <Controller
              control={form.control}
              name="confirmText"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="confirmText">
                    Xác nhận xóa:{" "}
                    <span className="font-semibold">{modelName}</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nhập tên mẫu xe để xác nhận"
                    disabled={pending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <AlertDialogFooter className="flex gap-2">
          <Button
            type="button"
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
            disabled={pending || !isInputValid}
          >
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Đang xóa..." : "Xóa"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
