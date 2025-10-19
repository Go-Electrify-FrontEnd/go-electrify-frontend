"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Loader2, Plus } from "lucide-react";
import {
  Controller,
  type Resolver,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { useState } from "react";
import { createSubscription } from "@/actions/subscriptions-actions";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";
import {
  subscriptionCreateSchema,
  type SubscriptionCreateFormData,
} from "@/lib/zod/subscription/subscription.request";

const initialState = { success: false, msg: "" };

export default function SubscriptionCreateDialog() {
  // Vietnamese text hardcoded
  const [open, setOpen] = useState(false);

  const { execute, pending } = useServerAction(
    createSubscription,
    initialState,
    {
      onSuccess: (result) => {
        toast.success("Gói đăng ký đã được tạo", {
          description: result.msg,
        });
        setOpen(false);
        form.reset();
      },
      onError: (result) => {
        if (result.msg) {
          toast.error("Tạo gói đăng ký thất bại", {
            description: result.msg,
          });
        }
      },
    },
  );

  const form = useForm<SubscriptionCreateFormData>({
    resolver: zodResolver(subscriptionCreateSchema),
    defaultValues: {
      name: "",
      price: 1000,
      totalKwH: 50,
      durationDays: 30,
    },
  });

  const onSubmit: SubmitHandler<SubscriptionCreateFormData> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("totalKwH", data.totalKwH.toString());
    formData.append("durationDays", data.durationDays.toString());
    execute(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="relative w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          Tạo Gói Đăng Ký
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Tạo Gói Đăng Ký</DialogTitle>
          <DialogDescription>Thêm gói đăng ký mới</DialogDescription>
        </DialogHeader>

        <form
          id="subscription-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">Tên</FieldLabel>
                  <Input
                    {...field}
                    placeholder="VIP"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="price">Giá</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="totalKwH"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="totalKwH">Tổng kWh</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    aria-invalid={fieldState.invalid}
                    placeholder="1"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="durationDays"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="durationDays">
                    Thời hạn (ngày)
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    aria-invalid={fieldState.invalid}
                    placeholder="30"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Huỷ
            </Button>
          </DialogClose>
          <Button form="subscription-form" type="submit" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Đang tạo..." : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
