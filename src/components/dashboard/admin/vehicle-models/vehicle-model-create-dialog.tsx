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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createVehicleModel } from "@/actions/vehicle-models-actions";
import { toast } from "sonner";
import {
  vehicleModelSchema,
  type VehicleModelFormData,
} from "@/schemas/vehicle-model.schema";
import { useConnectorTypes } from "@/contexts/connector-type-context";
// Translations removed; using Vietnamese literals

const initialState = {
  success: false,
  msg: "",
};

export default function VehicleModelCreateDialog() {
  const t = {
    createTitle: "Tạo mẫu xe",
    createDescription: "Thêm mẫu xe mới vào hệ thống",
    form: {
      modelName: "Tên mẫu xe",
      modelNamePlaceholder: "Nhập tên mẫu xe",
      maxPowerKw: "Công suất tối đa (kW)",
      maxPowerPlaceholder: "Nhập công suất tối đa",
      batteryCapacityKwh: "Dung lượng pin (kWh)",
      batteryCapacityPlaceholder: "Nhập dung lượng pin",
      connectorTypes: "Loại cổng",
      connectorTypesPlaceholder: "Chọn loại cổng",
      creating: "Đang tạo...",
      createButton: "Tạo",
    },
  };
  const connectorTypes = useConnectorTypes();
  const [open, setOpen] = useState(false);

  const [createState, createAction, pending] = useActionState(
    createVehicleModel,
    initialState,
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
      setOpen(false);
      toast.success(createState.msg);
    } else {
      toast.error(createState.msg);
    }
  }, [createState, form]);

  function onSubmit(data: VehicleModelFormData) {
    const formData = new FormData();
    formData.append("modelName", data.modelName);
    formData.append("maxPowerKw", data.maxPowerKw.toString());
    formData.append("batteryCapacityKwh", data.batteryCapacityKwh.toString());

    data.connectorTypeIds.forEach((id: string) => {
      formData.append("connectorTypeIds", id);
    });

    startTransition(() => {
      createAction(formData);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus />
          <span className="font-semibold">{t.createTitle}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.createTitle}</DialogTitle>
          <DialogDescription>{t.createDescription}</DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="my-4">
            <Controller
              name="modelName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="modelName">
                    {t.form.modelName}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="modelName"
                    placeholder={t.form.modelNamePlaceholder}
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
                  <FieldLabel htmlFor="maxPowerKw">
                    {t.form.maxPowerKw}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id="maxPowerKw"
                    placeholder={t.form.maxPowerPlaceholder}
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
                    {t.form.batteryCapacityKwh}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id="batteryCapacityKwh"
                    placeholder={t.form.batteryCapacityPlaceholder}
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
                    {t.form.connectorTypes}
                  </FieldLabel>
                  <MultiSelect
                    onValuesChange={field.onChange}
                    values={field.value}
                    aria-invalid={fieldState.invalid}
                  >
                    <MultiSelectTrigger className="w-full max-w-[400px]">
                      <MultiSelectValue
                        placeholder={t.form.connectorTypesPlaceholder}
                        overflowBehavior="wrap"
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
                {pending ? t.form.creating : t.form.createButton}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
