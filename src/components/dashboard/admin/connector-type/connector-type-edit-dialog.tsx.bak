"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { handleUpdateConnectorType } from "@/actions/connector-type-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useConnectorTypeUpdate } from "@/contexts/connector-type-update-context";
import {
  connectorTypeUpdateSchema,
  type ConnectorTypeUpdateFormData,
} from "@/lib/zod/connector-type/connector-type.request";
import { useServerAction } from "@/hooks/use-server-action";

export const UpdateConnectorType = () => {
  const { connectorType, isEditDialogOpen, setEditDialogOpen } =
    useConnectorTypeUpdate();
  const initialState = { success: false, msg: "" };
  const { execute, pending } = useServerAction(
    handleUpdateConnectorType,
    initialState,
    {
      onSuccess: (result) => {
        toast.success(result.msg);
        setEditDialogOpen(false);
        form.reset();
      },
      onError: (result) => {
        if (result.msg) {
          toast.error(result.msg);
        }
      },
    },
  );
  const form = useForm({
    resolver: zodResolver(connectorTypeUpdateSchema),
    defaultValues: {
      id: connectorType?.id?.toString() ?? "",
      name: connectorType?.name || "",
      description: connectorType?.description || "",
      maxPowerKw: connectorType?.maxPowerKw || 0,
    },
  });

  // Reset form when connectorType changes
  useEffect(() => {
    if (connectorType) {
      form.reset({
        id: connectorType.id.toString(),
        name: connectorType.name,
        description: connectorType.description,
        maxPowerKw: connectorType.maxPowerKw,
      });
    }
  }, [connectorType, form]);

  const onSubmit = (data: ConnectorTypeUpdateFormData) => {
    if (!connectorType) return;

    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("maxPowerKw", data.maxPowerKw.toString());
    execute(formData);
  };

  if (!connectorType) return null;

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa cổng kết nối</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cổng kết nối. Nhấn lưu để thay đổi.
          </DialogDescription>
        </DialogHeader>

        <form
          id="connector-type-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="my-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Tên cổng kết nối</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Nhập tên cổng kết nối"
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
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Mô tả</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="description"
                      placeholder="Nhập mô tả cổng kết nối (tùy chọn)"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      rows={3}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="maxPowerKw"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="maxPowerKw">
                    Công suất tối đa (kW)
                  </FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      type="number"
                      id="maxPowerKw"
                      placeholder="Nhập công suất tối đa"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      value={
                        typeof field.value === "number" ||
                        typeof field.value === "string"
                          ? field.value
                          : ""
                      }
                    />
                    <InputGroupAddon>
                      <InputGroupText>kW</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditDialogOpen(false)}
            disabled={pending}
          >
            Hủy
          </Button>
          <Button type="submit" form="connector-type-form" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
