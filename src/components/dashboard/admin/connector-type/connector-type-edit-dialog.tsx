"use client";

import React, { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectorType } from "@/types/connector";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
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

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Tên cổng kết nối là bắt buộc"),
  description: z.string().max(200, "Mô tả tối đa 200 ký tự").optional(),
  maxPowerKw: z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: "Công suất phải là số",
    })
    .min(1, "Công suất phải lớn hơn 0")
    .max(1000, "Công suất vượt quá giới hạn cho phép"),
});

interface UpdateConnectorTypeProps {
  connectorType: ConnectorType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateConnectorType = ({
  connectorType,
  open,
  onOpenChange,
}: UpdateConnectorTypeProps) => {
  const [updateState, updateAction, pending] = useActionState(
    handleUpdateConnectorType,
    {
      success: false,
      msg: "",
    },
  );

  useEffect(() => {
    if (updateState.msg) {
      if (updateState.success) {
        toast.success(updateState.msg);
        onOpenChange(false);
      } else {
        toast.error(updateState.msg);
      }
    }
  }, [updateState]);

  const [name, setName] = useState(connectorType.name);
  const [description, setDescription] = useState(connectorType.description);
  const [maxPowerKw, setMaxPowerKw] = useState(
    connectorType.maxPowerKw.toString(),
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: connectorType.id,
      name: connectorType.name,
      description: connectorType.description,
      maxPowerKw: connectorType.maxPowerKw,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa cổng kết nối</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cổng kết nối. Nhấn lưu để thay đổi.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" action={updateAction}>
          <input type="hidden" name="id" value={connectorType.id} />
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Tên cổng kết nối</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Test AC"
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
                      id="form-rhf-demo-description"
                      placeholder="Mô tả ngắn về loại cổng kết nối (tối đa 200 ký tự)"
                      aria-invalid={fieldState.invalid}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                  <Input
                    {...field}
                    id="maxPowerKw"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    value={maxPowerKw}
                    onChange={(e) => setMaxPowerKw(e.target.value)}
                    placeholder="VD: 50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Hủy
            </Button>
            <Button disabled={pending} type="submit">
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Lưu
              thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
