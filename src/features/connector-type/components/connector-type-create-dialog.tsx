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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";
import { handleCreateConnectorType } from "../services/connector-type-actions";
import {
  ConnectorTypeCreateFormData,
  connectorTypeCreateSchema,
} from "../schemas/connector-type.request";

const initialState = { success: false, msg: "" };

export default function ConnectorTypeCreateDialog() {
  const [open, setOpen] = useState(false);
  const { execute, pending } = useServerAction(
    handleCreateConnectorType,
    initialState,
    {
      onSettled: (result) => {
        if (result.success) {
          toast.success("Hành động được thực hiện thành công", {
            description: result.msg,
          });
          setOpen(false);
          form.reset();
        } else if (result.msg) {
          toast.error("Hành động không thành công", {
            description: result.msg,
          });
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
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="relative w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          Tạo Loại Cổng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Tạo Loại Cổng Sạc</DialogTitle>
          <DialogDescription>
            Thêm loại cổng sạc mới vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">Tên</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nhập tên cổng sạc"
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
              name="description"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="description">Mô tả</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      placeholder="Mô tả ngắn về loại cổng kết nối (tối đa 200 ký tự)"
                      aria-invalid={fieldState.invalid}
                      rows={6}
                      className="min-h-24 resize-none"
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value == null ? 0 : field.value.length}/200 từ
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
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="350"
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
                Huỷ
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Đang tạo..." : "Tạo Loại Cổng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
