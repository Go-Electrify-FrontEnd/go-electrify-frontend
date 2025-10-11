"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { ConnectorType } from "@/types/connector";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { createVehicleModel } from "@/actions/vehicle-models-actions";
import { toast } from "sonner";
import { on } from "events";

// Define the schema for vehicle model creation
const vehicleModelSchema = z.object({
  modelName: z.string().trim().min(1, "Tên mẫu xe là bắt buộc"),
  maxPowerKw: z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: "Công suất phải là số",
    })
    .min(1, "Công suất phải lớn hơn 0")
    .max(1000, "Công suất vượt quá giới hạn cho phép"),
  batteryCapacityKwh: z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: "Công suất phải là số",
    })
    .min(1, "Dung lượng pin tối thiểu là 1 kWh"),
  connectorTypeIds: z
    .array(z.string())
    .min(1, "Phải có ít nhất một loại cổng kết nối"),
});

interface VehicleModelCreateDialogProps {
  connectorTypes: ConnectorType[];
}

export default function VehicleModelCreateDialog({
  connectorTypes,
}: VehicleModelCreateDialogProps) {
  const [createState, createAction, pending] = useActionState(
    createVehicleModel,
    {
      success: false,
      msg: "",
    },
  );
  const form = useForm({
    resolver: zodResolver(vehicleModelSchema),
    defaultValues: {
      modelName: "",
      maxPowerKw: 50,
      batteryCapacityKwh: 50,
      connectorTypeIds: [],
    },
  });

  useEffect(() => {
    if (!createState.msg) return;

    if (createState.success) {
      form.reset();
      toast.success(createState.msg);
    } else {
      toast.error(createState.msg);
    }
  }, [createState, form]);

  function onSubmit(data: z.infer<typeof vehicleModelSchema>) {
    const formData = new FormData();
    formData.append("modelName", data.modelName);
    formData.append("maxPowerKw", data.maxPowerKw.toString());
    formData.append("batteryCapacityKwh", data.batteryCapacityKwh.toString());
    formData.append("connectorTypeIds", data.connectorTypeIds.join(","));

    startTransition(() => {
      createAction(formData);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus />
          <span className="font-semibold">Thêm Xe Mới</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm Mẫu Xe Điện Mới</DialogTitle>
          <DialogDescription>
            Thêm thông tin cho mẫu xe điện mới cho hệ thống.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="my-4">
            <Controller
              name="modelName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="modelName">Tên Mẫu Xe</FieldLabel>
                  <Input
                    {...field}
                    id="modelName"
                    placeholder="Tên mẫu xe"
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
              name="maxPowerKw"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="maxPowerKw">Công Suất (kW)</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id="maxPowerKw"
                    placeholder="Công suất tối đa (kW)"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
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

            <Controller
              name="batteryCapacityKwh"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="batteryCapacityKwh">
                    Dung Lượng Pin (kWh)
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id="batteryCapacityKwh"
                    placeholder="Dung lượng pin (kWh)"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
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

            <Controller
              name="connectorTypeIds"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="connectorTypeIds">
                    Loại Cổng Kết Nối
                  </FieldLabel>
                  <MultiSelect
                    onValuesChange={field.onChange}
                    values={field.value}
                    aria-invalid={fieldState.invalid}
                  >
                    <MultiSelectTrigger className="w-full max-w-[400px]">
                      <MultiSelectValue
                        placeholder="Chọn cổng sạc..."
                        overflowBehavior="wrap-when-open"
                      />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        {connectorTypes.map((ct) => (
                          <MultiSelectItem key={ct.id} value={ct.id.toString()}>
                            {ct.name}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter className="flex w-full">
              <Button type="submit" className="self-end" disabled={pending}>
                {pending ? "Đang thêm..." : "Thêm Mẫu Xe"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
