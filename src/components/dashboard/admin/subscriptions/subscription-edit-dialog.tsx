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
import { useTranslations } from "next-intl";
import { Subscription } from "@/types/subscription";
import { useServerAction } from "@/hooks/use-server-action";
import {
  subscriptionUpdateSchema,
  type SubscriptionUpdateFormData,
} from "@/schemas/subscription.schema";
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
  const t = useTranslations("admin.subscription");
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
        toast.success(t("edit.toast.success", { defaultValue: "Updated" }), {
          description: result.msg,
        });
        onOpenChange(false);
        form.reset();
      },
      onError: (result) => {
        if (result.msg) {
          toast.error(
            t("edit.toast.failure", { defaultValue: "Update failed" }),
            {
              description: result.msg,
            },
          );
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
          <DialogTitle>
            {t("edit.title", { defaultValue: "Edit Subscription" })}
          </DialogTitle>
          <DialogDescription>
            {t("edit.description", {
              defaultValue: "Update subscription plan details",
            })}
          </DialogDescription>
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
                  <FieldLabel htmlFor="subscription-name">
                    {t("form.name", { defaultValue: "Name" })}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="subscription-name"
                    placeholder={t("form.namePlaceholder", {
                      defaultValue: "Enter subscription name",
                    })}
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
                  <FieldLabel htmlFor="subscription-price">
                    {t("form.price", { defaultValue: "Price" })}
                  </FieldLabel>
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
                    placeholder={t("form.pricePlaceholder", {
                      defaultValue: "0",
                    })}
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
                    {t("form.totalKwh", { defaultValue: "Total kWh" })}
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
                    placeholder={t("form.totalKwhPlaceholder", {
                      defaultValue: "100",
                    })}
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
                    {t("form.durationDays", {
                      defaultValue: "Duration (Days)",
                    })}
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
                    placeholder={t("form.durationDaysPlaceholder", {
                      defaultValue: "30",
                    })}
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
            {t("common.cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button
            form="subscription-update-form"
            type="submit"
            disabled={pending}
          >
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending
              ? t("form.updating", { defaultValue: "Updating..." })
              : t("form.updateButton", { defaultValue: "Update" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
