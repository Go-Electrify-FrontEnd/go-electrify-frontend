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
}

const initialState = { success: false, msg: "" };

export function BookingFeeForm({ bookingFee }: BookingFeeFormProps) {
  const { execute, pending } = useServerAction(updateBookingFee, initialState, {
    onSuccess: (result) => {
      toast.success("Hành động được thực hiện thành công", {
        description: result.msg,
      });
      form.reset();
    },
    onError: (result) => {
      if (result.msg) {
        toast.error("Hành động không thành công", {
          description: result.msg,
        });
      }
    },
  });

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
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn loại phí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Chọn loại phí</SelectLabel>
                    <SelectItem value="FLAT">
                      <div className="flex items-center gap-2">
                        <span>💵</span>
                        <span>Phí Cố Định (VND)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PERCENT">
                      <div className="flex items-center gap-2">
                        <span>📊</span>
                        <span>Phần Trăm (%)</span>
                      </div>
                    </SelectItem>
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
                className="h-11"
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
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            {getPreviewText()}
          </AlertDescription>
        </Alert>
      )}

      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <span className="font-medium">Lưu ý:</span> Thay đổi phí đặt chỗ sẽ
          ảnh hưởng đến tất cả các đặt chỗ mới trong hệ thống.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={pending}
        >
          Đặt lại
        </Button>
        <Button type="submit" disabled={pending} className="min-w-[140px]">
          {pending ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </div>
    </form>
  );
}
