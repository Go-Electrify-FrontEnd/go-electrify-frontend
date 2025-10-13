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
import { useTranslations } from "next-intl";
import { useServerAction } from "@/hooks/use-server-action";
import {
  subscriptionCreateSchema,
  type SubscriptionCreateFormData,
} from "@/schemas/subscription.schema";

const initialState = { success: false, msg: "" };

export default function SubscriptionCreateDialog() {
  const t = useTranslations("admin.subscription");
  const [open, setOpen] = useState(false);

  const { execute, pending } = useServerAction(
    createSubscription,
    initialState,
    {
      onSuccess: (result) => {
        toast.success(t("create.success"), {
          description: result.msg,
        });
        setOpen(false);
        form.reset();
      },
      onError: (result) => {
        if (result.msg) {
          toast.error(t("create.failure"), {
            description: result.msg,
          });
        }
      },
    },
  );

  const form = useForm<SubscriptionCreateFormData>({
    resolver: zodResolver(
      subscriptionCreateSchema,
    ) as Resolver<SubscriptionCreateFormData>,
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
          {t("create.title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
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
                  <FieldLabel htmlFor="name">{t("form.name")}</FieldLabel>
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
                  <FieldLabel htmlFor="price">{t("form.price")}</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
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
                  <FieldLabel htmlFor="totalKwH">
                    {t("form.totalKwh")}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
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
                    {t("form.durationDays")}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
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
              {t("common.cancel")}
            </Button>
          </DialogClose>
          <Button form="subscription-form" type="submit" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? t("form.creating") : t("form.createButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
