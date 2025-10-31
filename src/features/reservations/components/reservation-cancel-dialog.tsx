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
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cancelReservation } from "../services/reservation-actions";
import { useServerAction } from "@/hooks/use-server-action";
import { Reservation } from "../schemas/reservation.schema";
import {
  ReservationCancelFormData,
  reservationCancelSchema,
} from "../schemas/reservation.request";

const initialState = { success: false, msg: "" };

interface ReservationCancelDialogProps {
  reservation: Reservation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationCancelDialog({
  reservation,
  open,
  onOpenChange,
}: ReservationCancelDialogProps) {
  const [pending, setPending] = useState(false);

  const { execute } = useServerAction(cancelReservation, initialState, {
    onSettled: (result) => {
      if (result.success) {
        toast.success("Đặt chỗ đã được hủy", { description: result.msg });
        onOpenChange(false);
        form.reset();
      } else if (result.msg) {
        toast.error("Hủy đặt chỗ thất bại", { description: result.msg });
      }
      setPending(false);
    },
  });

  const form = useForm<ReservationCancelFormData>({
    resolver: zodResolver(reservationCancelSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit: SubmitHandler<ReservationCancelFormData> = (data) => {
    setPending(true);
    const formData = new FormData();
    formData.append("id", reservation.id.toString());
    formData.append("reason", data.reason);
    execute(formData);
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
      }}
    >
      <AlertDialogContent className="sm:max-w-[480px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Hủy đặt chỗ</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">
              Bạn có chắc chắn muốn hủy đặt chỗ{" "}
              <span className="font-semibold">#{reservation.code}</span>?
            </span>
            <br />
            <span className="block">
              Việc hủy đặt chỗ có thể dẫn đến mất phí đặt chỗ tùy theo chính
              sách của trạm.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          id="cancel-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <input type="hidden" name="id" value={reservation.id} />

          <FieldGroup>
            <Controller
              control={form.control}
              name="reason"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="reason">
                    Lý do hủy đặt chỗ{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Vui lòng nhập lý do hủy đặt chỗ..."
                    disabled={pending}
                    aria-invalid={fieldState.invalid}
                    rows={4}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <p className="text-muted-foreground text-sm">
                    Lý do sẽ giúp chúng tôi cải thiện dịch vụ tốt hơn.
                  </p>
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Giữ đặt chỗ
          </Button>
          <Button
            form="cancel-form"
            variant="destructive"
            type="submit"
            disabled={pending}
          >
            {pending ? "Đang hủy..." : "Hủy đặt chỗ"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
