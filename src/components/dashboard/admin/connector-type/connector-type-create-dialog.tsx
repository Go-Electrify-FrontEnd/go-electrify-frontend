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
import { Loader2, Plug, Plus } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { handleCreateConnectorType } from "@/actions/connector-type-actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  connectorTypeCreateSchema,
  type ConnectorTypeCreateFormData,
} from "@/schemas/connector-type.schema";
import { useServerAction } from "@/hooks/use-server-action";

const initialState = { success: false, msg: "" };

export default function ConnectorTypeCreateDialog() {
  const t = useTranslations("connectorType");
  const [open, setOpen] = useState(false);
  const { execute, pending } = useServerAction(
    handleCreateConnectorType,
    initialState,
    {
      onSuccess: (result) => {
        toast.success(
          t("toast.createSuccess", { defaultValue: "Tạo thành công" }),
          {
            description: result.msg,
          },
        );
        setOpen(false);
        form.reset();
      },
      onError: (result) => {
        if (result.msg) {
          toast.error(
            t("toast.createError", { defaultValue: "Tạo thất bại" }),
            {
              description: result.msg,
            },
          );
        }
      },
    },
  );
  const form = useForm({
    resolver: zodResolver(connectorTypeCreateSchema),
    defaultValues: {
      name: "",
      description: undefined,
      maxPowerKw: 0,
    },
  });
  const handleSubmit = form.handleSubmit(
    (data: ConnectorTypeCreateFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("maxPowerKw", data.maxPowerKw.toString());
      execute(formData);
    },
    (errors) => {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(t("toast.createError", { defaultValue: "Tạo thất bại" }), {
          description: firstError.message,
        });
      }
    },
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="relative w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          {t("create.title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plug className="text-primary h-5 w-5" />
            {t("create.title")}
          </DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">{t("form.name")}</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder={t("form.namePlaceholder")}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="Mô tả ngắn về loại cổng kết nối (tối đa 200 ký tự)"
                      aria-invalid={fieldState.invalid}
                      rows={6}
                      className="min-h-24 resize-none"
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value == null ? 0 : field.value.length}/100
                        characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="maxPowerKw"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="maxPowerKw">
                    Công suất tối đa (kW) *
                  </FieldLabel>
                  <Input
                    {...field}
                    id="maxPowerKw"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 350"
                    required
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                {t("common.cancel", { defaultValue: "Cancel" })}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? t("form.creating") : t("form.createButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
