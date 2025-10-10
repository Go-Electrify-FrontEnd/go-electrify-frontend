"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Circle, Loader2, Plug, Plus } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Controller, useForm } from "react-hook-form";
import { useActionState, useEffect, useState } from "react";
import { handleCreateConnectorType } from "@/actions/connector-type-actions";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().trim().min(1, "Tên cổng kết nối là bắt buộc"),
  description: z
    .string()
    .trim()
    .max(200, "Mô tả tối đa 200 ký tự")
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  maxPowerKw: z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: "Công suất phải là số",
    })
    .min(1, "Công suất phải lớn hơn 0")
    .max(1000, "Công suất vượt quá giới hạn cho phép"),
});

export default function ConnectorTypeCreateDialog() {
  const [open, setOpen] = useState(false);
  const [createActionResult, createAction, pending] = useActionState(
    handleCreateConnectorType,
    {
      success: false,
      msg: "",
    },
  );
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: undefined,
      maxPowerKw: 0,
    },
  });

  useEffect(() => {
    if (!createActionResult) return;
    if (createActionResult.success) {
      setOpen(false);
      form.reset();
    }

    if (createActionResult.msg) {
      if (createActionResult.success) {
        toast.success("Thành Công", {
          description: createActionResult.msg,
        });
      } else {
        toast.error("Thất Bại", {
          description: createActionResult.msg,
        });
      }
    }
  }, [createActionResult]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="relative w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          Thêm Cổng Mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plug className="text-primary h-5 w-5" />
            Thêm loại cổng kết nối
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo loại cổng sạc mới. Trường có dấu * là bắt
            buộc.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" action={createAction}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">Tên cổng *</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Ví dụ: Type2-AC"
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
                  <FieldLabel htmlFor="description">Mô tả</FieldLabel>
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
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Tạo cổng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
