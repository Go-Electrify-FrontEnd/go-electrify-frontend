"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Percent, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingFeeManagerProps {
  bookingFee: BookingFee;
  className?: string;
}

const initialState = { success: false, msg: "" };

export function BookingFeeManager({
  bookingFee,
  className,
}: BookingFeeManagerProps) {
  const { execute, pending } = useServerAction(updateBookingFee, initialState, {
    onSettled: (result) => {
      if (result.success) {
        toast.success("Hành động được thực hiện thành công", {
          description: result.msg,
        });
      } else if (result.msg) {
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
    mode: "all",
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

  return (
    <div className={cn("grid h-max w-full gap-4 md:gap-6", className)}>
      {/* Current Configuration Display */}
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Cấu Hình Phí Đặt Chỗ</CardTitle>
          <CardDescription>
            Thông tin về cấu hình phí đặt chỗ hiện tại
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                  Loại phí
                </p>
                <div className="flex items-center gap-2">
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
          </div>

          <Separator className="my-6" />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Loại Phí Đặt Chỗ</FieldLabel>
                    <Select
                      name={field.name}
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
                            <div className="flex items-center gap-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                <DollarSign className="h-3 w-3" />
                              </div>
                              <div className="text-muted-foreground">
                                Phí Cố Định
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="PERCENT">
                            <div className="flex items-center gap-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                <Percent className="h-3 w-3" />
                              </div>
                              <div className="text-muted-foreground">
                                % Pin Của Xe
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
                disabled={pending || !form.formState.isDirty}
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
