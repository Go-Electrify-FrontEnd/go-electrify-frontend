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
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
      {/* Current Configuration Display */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Cấu Hình Hiện Tại</CardTitle>
              <CardDescription>
                Phí đặt chỗ đang áp dụng trong hệ thống
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                  Loại phí
                </p>
                <div className="flex items-center gap-2">
                  {bookingFee.type === "PERCENT" ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Percent className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  )}
                  <p className="text-xl font-bold">
                    {bookingFee.type === "PERCENT"
                      ? "Phần Trăm"
                      : "Phí Cố Định"}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-left sm:text-right">
                <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                  Giá trị
                </p>
                <p className="text-primary text-3xl font-bold">
                  {bookingFee.type === "PERCENT"
                    ? `${bookingFee.value}%`
                    : `${bookingFee.value.toLocaleString("vi-VN")}`}
                </p>
                {bookingFee.type !== "PERCENT" && (
                  <p className="text-muted-foreground text-sm">VND</p>
                )}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {bookingFee.type === "PERCENT"
                  ? `Phí ${bookingFee.value}% sẽ được tính trên tổng giá trị của mỗi đặt chỗ`
                  : `Mỗi đặt chỗ sẽ được tính thêm ${bookingFee.value.toLocaleString("vi-VN")} VND`}
              </p>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
              <span>Đang áp dụng cho tất cả đặt chỗ mới</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Form */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Cập Nhật Cấu Hình</CardTitle>
              <CardDescription>
                Thay đổi loại phí và giá trị áp dụng
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
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
                            <div className="flex items-center gap-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                <DollarSign className="h-3 w-3" />
                              </div>
                              <div>
                                <div className="font-medium">Phí Cố Định</div>
                                <div className="text-muted-foreground text-xs">
                                  VND cho mỗi đặt chỗ
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="PERCENT">
                            <div className="flex items-center gap-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                <Percent className="h-3 w-3" />
                              </div>
                              <div>
                                <div className="font-medium">Phần Trăm</div>
                                <div className="text-muted-foreground text-xs">
                                  % trên tổng giá trị
                                </div>
                              </div>
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

            {/* Live Preview */}
            {getPreviewText() && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Xem trước:</strong> {getPreviewText()}
                </AlertDescription>
              </Alert>
            )}

            {/* Warning Alert */}
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Thay đổi này sẽ có hiệu lực ngay lập tức và áp dụng cho tất cả
                đặt chỗ mới trong hệ thống.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={pending}
                className="min-w-[100px]"
              >
                Đặt lại
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="min-w-[120px]"
              >
                {pending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
