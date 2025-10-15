"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Subscription } from "@/lib/zod/subscription/subscription.types";
import { useServerAction } from "@/hooks/use-server-action";
import {
  subscriptionUpdateSchema,
  type SubscriptionUpdateFormData,
} from "@/lib/zod/subscription/subscription.request";
import { updateSubscription } from "@/actions/subscriptions-actions";

interface UpdateSubscriptionProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = { success: false, msg: "" };

export function UpdateSubscription({
  subscription,
  open,
  onOpenChange,
}: UpdateSubscriptionProps) {
  const { id, name, price, totalKwh, durationDays } = subscription;
  const form = useForm<SubscriptionUpdateFormData>({
    resolver: zodResolver(
      subscriptionUpdateSchema,
    ) as Resolver<SubscriptionUpdateFormData>,
    defaultValues: {
      id: id.toString(),
      name,
      price,
      totalKwH: totalKwh,
      durationDays,
    },
  });

  const { execute, pending } = useServerAction(
    updateSubscription,
    initialState,
    {
      onSuccess: (result) => {
        toast.success("Gói đã được cập nhật", {
          description: result.msg,
        });
        onOpenChange(false);
        form.reset();
      },
      onError: (result) => {
        if (result.msg) {
          toast.error("Cập nhật không thành công", {
            description: result.msg,
          });
        }
      },
    },
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      id: id.toString(),
      name,
      price,
      totalKwH: totalKwh,
      durationDays,
    });
  }, [durationDays, form, id, name, open, price, totalKwh]);

  const handleSubmit = form.handleSubmit((data) => {
    const payload = new FormData();
    payload.append("id", data.id);
    payload.append("name", data.name);
    payload.append("price", data.price.toString());
    payload.append("totalKwH", data.totalKwH.toString());
    payload.append("durationDays", data.durationDays.toString());
    execute(payload);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset({
            id: id.toString(),
            name,
            price,
            totalKwH: totalKwh,
            durationDays,
          });
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa gói đăng ký</DialogTitle>
          <DialogDescription>Cập nhật chi tiết gói đăng ký</DialogDescription>
        </DialogHeader>

        <form
          id="subscription-update-form"
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <input type="hidden" {...form.register("id")} />
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="subscription-name">Tên</FieldLabel>
                  <Input
                    {...field}
                    id="subscription-name"
                    placeholder={"Nhập tên gói"}
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="subscription-price">Giá</FieldLabel>
                  <Input
                    id="subscription-price"
                    type="number"
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? ""
                          : Number(event.target.value),
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-invalid={fieldState.invalid}
                    placeholder={"0"}
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="subscription-total-kwh">
                    Tổng kWh
                  </FieldLabel>
                  <Input
                    id="subscription-total-kwh"
                    type="number"
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? ""
                          : Number(event.target.value),
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-invalid={fieldState.invalid}
                    placeholder={"100"}
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="subscription-duration-days">
                    Thời hạn (ngày)
                  </FieldLabel>
                  <Input
                    id="subscription-duration-days"
                    type="number"
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? ""
                          : Number(event.target.value),
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-invalid={fieldState.invalid}
                    placeholder={"30"}
                    autoComplete="off"
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
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Huỷ
          </Button>
          <Button
            form="subscription-update-form"
            type="submit"
            disabled={pending}
          >
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
