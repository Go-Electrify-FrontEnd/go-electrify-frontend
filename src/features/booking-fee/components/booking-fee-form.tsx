"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bookingFeeUpdateSchema,
  type BookingFeeUpdateFormData,
} from "@/lib/zod/booking-fee/booking-fee.request";
import { useServerAction } from "@/hooks/use-server-action";
import { updateBookingFee } from "../services/booking-fee-actions";
import { toast } from "sonner";
import type { BookingFee } from "@/lib/zod/booking-fee/booking-fee.types";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingFeeFormProps {
  bookingFee: BookingFee;
  onSuccess?: () => void;
}

export function BookingFeeForm({ bookingFee, onSuccess }: BookingFeeFormProps) {
  const initialState = { success: false, msg: "" };
  const { execute, pending } = useServerAction(
    updateBookingFee,
    initialState,
    {
      onSuccess: (res) => {
        toast.success(res.msg);
        onSuccess?.();
      },
      onError: (res) => {
        if (res.msg) toast.error(res.msg);
      },
    },
  );

  const form = useForm<BookingFeeUpdateFormData>({
    resolver: zodResolver(bookingFeeUpdateSchema),
    defaultValues: {
      type: bookingFee.type,
      value: bookingFee.value,
    },
  });

  const selectedType = form.watch("type");
  const currentValue = form.watch("value");

  useEffect(() => {
    if (bookingFee) {
      form.reset({
        type: bookingFee.type,
        value: bookingFee.value,
      });
    }
  }, [bookingFee, form]);

  const onSubmit = (data: BookingFeeUpdateFormData) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("value", String(data.value));
    execute(formData);
  };

  const getPreviewText = () => {
    const val = currentValue || 0;
    if (val === 0) return null;

    if (selectedType === "PERCENT") {
      return `Phí ${val}% sẽ được tính trên tổng giá trị đặt chỗ`;
    }
    return `Phí cố định ${val.toLocaleString("vi-VN")} VND cho mỗi đặt chỗ`;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Loại Phí Đặt Chỗ</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại phí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Loại phí</SelectLabel>
                    <SelectItem value="FLAT">Phí Cố Định (VND)</SelectItem>
                    <SelectItem value="PERCENT">Phần Trăm (%)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="value"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>
                Giá Trị {selectedType === "PERCENT" ? "(%)" : "(VND)"}
              </FieldLabel>
              <Input
                {...field}
                type="number"
                step={selectedType === "PERCENT" ? "0.01" : "1"}
                min="0"
                placeholder={
                  selectedType === "PERCENT"
                    ? "Nhập phần trăm (vd: 5)"
                    : "Nhập số tiền (vd: 10000)"
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {getPreviewText() && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{getPreviewText()}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Thay đổi phí đặt chỗ sẽ ảnh hưởng đến tất cả các đặt chỗ mới trong hệ
          thống.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Đang cập nhật..." : "Cập nhật phí đặt chỗ"}
        </Button>
      </div>
    </form>
  );
}
