"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { AlertCircle, Info, Percent, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingFeeManagerProps {
  bookingFee: BookingFee;
}

const initialState = { success: false, msg: "" };

export function BookingFeeManager({ bookingFee }: BookingFeeManagerProps) {
  const { execute, pending } = useServerAction(updateBookingFee, initialState, {
    onSuccess: (result) => {
      toast.success("Hành động được thực hiện thành công", {
        description: result.msg,
      });
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
  const isPercent = selectedType === "PERCENT";

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
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Quản Lý Phí Đặt Chỗ</CardTitle>
            <CardDescription>
              Xem và cập nhật cấu hình phí đặt chỗ hệ thống
            </CardDescription>
          </div>
          <Badge
            variant={isPercent ? "default" : "secondary"}
            className="w-fit text-xs"
          >
            {isPercent ? "Phần Trăm" : "Cố Định"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid space-y-6 lg:grid-cols-2 lg:gap-8">
          {/* Current Configuration Display */}
          <div className="col-span-1 rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="bg-background flex h-8 w-8 items-center justify-center rounded-md">
                <Info className="text-muted-foreground h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold">Cấu Hình Hiện Tại</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                    bookingFee.type === "PERCENT"
                      ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700"
                      : "bg-gradient-to-br from-green-100 to-green-200 text-green-700"
                  }`}
                >
                  {bookingFee.type === "PERCENT" ? (
                    <Percent className="h-7 w-7" />
                  ) : (
                    <DollarSign className="h-7 w-7" />
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Loại phí
                  </p>
                  <p className="text-lg font-bold">
                    {bookingFee.type === "PERCENT"
                      ? "Phần Trăm"
                      : "Phí Cố Định"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Giá trị
                </p>
                <p className="text-2xl font-bold">
                  {bookingFee.type === "PERCENT"
                    ? `${bookingFee.value}%`
                    : `${bookingFee.value.toLocaleString("vi-VN")}`}
                </p>
                {bookingFee.type !== "PERCENT" && (
                  <p className="text-muted-foreground text-xs">VND</p>
                )}
              </div>
            </div>
            <div className="bg-background mt-4 rounded-md p-3">
              <p className="text-muted-foreground text-xs leading-relaxed">
                {bookingFee.type === "PERCENT"
                  ? `Phí ${bookingFee.value}% sẽ được tính trên tổng giá trị của mỗi đặt chỗ`
                  : `Mỗi đặt chỗ sẽ được tính thêm ${bookingFee.value.toLocaleString("vi-VN")} VND`}
              </p>
            </div>
          </div>

          {/* Update Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="col-span-1 space-y-6 rounded-lg border p-4"
          >
            <div>
              <h3 className="mb-4 text-sm font-semibold">Cập Nhật Cấu Hình</h3>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Loại Phí Đặt Chỗ</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={pending}
              >
                Đặt lại
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="min-w-[140px]"
              >
                {pending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
