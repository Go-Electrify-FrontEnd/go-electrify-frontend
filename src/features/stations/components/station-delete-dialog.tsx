"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import type { Station } from "../schemas/station.types";
import { deleteStation } from "../services/stations-actions";
import { useServerAction } from "@/hooks/use-server-action";
import {
stationDeleteSchema,
type StationDeleteFormData,
} from "../schemas/station.request";

interface DeleteStationProps {
  station: Station;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = { success: false, msg: "" };

export function DeleteStation({
  station,
  open,
  onOpenChange,
}: DeleteStationProps) {
  const [pending, setPending] = useState(false);

  const { execute } = useServerAction(deleteStation, initialState, {
    onSettled: (result) => {
      if (result.success) {
        toast.success("Trạm đã được xóa", { description: result.msg });
        onOpenChange(false);
        form.reset();
      } else if (result.msg) {
        toast.error("Xóa không thành công", { description: result.msg });
      }
      setPending(false);
    },
  });

  const form = useForm<StationDeleteFormData>({
    resolver: zodResolver(stationDeleteSchema),
    defaultValues: {
      confirmText: "",
    },
  });

  const confirmText = form.watch("confirmText");
  const isInputValid = confirmText === station.name;

  const onSubmit: SubmitHandler<StationDeleteFormData> = async (data) => {
    if (data.confirmText !== station.name) {
      form.setError("confirmText", {
        type: "manual",
        message: "Tên trạm không khớp. Vui lòng nhập chính xác tên trạm.",
      });
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.append("id", station.id.toString());
    execute(formData);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(newOpen) => {
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

        <form
          id="delete-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <input type="hidden" name="id" value={station.id} />

          <FieldGroup>
            <Controller
              control={form.control}
              name="confirmText"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="confirmText">
                    Xác nhận xóa:{" "}
                    <span className="font-semibold">{station.name}</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nhập tên trạm để xác nhận"
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
            {pending ? "Đang xóa..." : "Xóa"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
