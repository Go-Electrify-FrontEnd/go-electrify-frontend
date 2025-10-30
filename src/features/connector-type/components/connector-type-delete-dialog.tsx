"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { handleDeleteConnectorType } from "../services/connector-type-actions";
import { useServerAction } from "@/hooks/use-server-action";
import { ConnectorType } from "@/types/connector";
import {
  ConnectorTypeDeleteFormData,
  connectorTypeDeleteSchema,
} from "../schemas/connector-type.request";
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
  const [pending, setPending] = useState(false);

  const { execute } = useServerAction(handleDeleteConnectorType, initialState, {
    onSettled: (result) => {
      if (result.success) {
        toast.success("Cổng kết nối đã được xóa thành công.");
        onOpenChange(false);
        form.reset();
      } else {
        toast.error("Đã xảy ra lỗi khi xóa cổng kết nối.");
      }
      setPending(false);
    },
  });

  const form = useForm<ConnectorTypeDeleteFormData>({
    resolver: zodResolver(connectorTypeDeleteSchema),
    defaultValues: {
      confirmText: "",
    },
  });

  const confirmText = form.watch("confirmText");
  const isInputValid = confirmText === connectorType.name;

  const onSubmit: SubmitHandler<ConnectorTypeDeleteFormData> = (data) => {
    if (data.confirmText !== connectorType.name) {
      form.setError("confirmText", {
        type: "manual",
        message:
          "Tên cổng kết nối không khớp. Vui lòng nhập chính xác tên cổng kết nối.",
      });
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.append("id", connectorType.id.toString());
    execute(formData);
  };

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

        <form
          id="delete-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <input type="hidden" name="id" value={connectorType.id} />

          <FieldGroup>
            <Controller
              control={form.control}
              name="confirmText"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="confirmText">
                    Xác nhận xóa:{" "}
                    <span className="font-semibold">{connectorType.name}</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nhập tên cổng kết nối để xác nhận"
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
            disabled={pending || !isInputValid}
          >
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Đang xóa..." : "Xóa"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
