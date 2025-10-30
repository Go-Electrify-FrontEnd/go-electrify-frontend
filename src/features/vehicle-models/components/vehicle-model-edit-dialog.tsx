"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { useConnectorTypes } from "@/contexts/connector-type-context";
import { toast } from "sonner";
import { useVehicleModelUpdate } from "@/contexts/vehicle-model-action-context";
import { updateVehicleModel } from "../services/vehicle-models-actions";
import {
  VehicleModelFormData,
  vehicleModelSchema,
} from "../schemas/vehicle-model.request";

export default function VehicleModelEditDialog() {
  const t = {
    editTitle: "Chỉnh sửa mẫu xe",
    editDescription: "Cập nhật thông tin mẫu xe",
    form: {
      modelName: "Tên mẫu xe",
      modelNamePlaceholder: "Nhập tên mẫu xe",
      maxPowerKw: "Công suất tối đa (kW)",
      maxPowerPlaceholder: "Nhập công suất tối đa",
      batteryCapacityKwh: "Dung lượng pin (kWh)",
      batteryCapacityPlaceholder: "Nhập dung lượng pin",
      connectorTypes: "Loại cổng",
      connectorTypesPlaceholder: "Chọn loại cổng",
      updating: "Đang cập nhật...",
      updateButton: "Cập nhật",
    },
  };
  const connectorTypes = useConnectorTypes();
  const { vehicleModel, isEditDialogOpen, setEditDialogOpen } =
    useVehicleModelUpdate();

  const [updateState, updateAction, updatePending] = useActionState(
    updateVehicleModel,
    { success: false, msg: "" },
  );

  const form = useForm({
    resolver: zodResolver(vehicleModelSchema),
    defaultValues: {
      modelName: vehicleModel?.modelName || "",
      maxPowerKw: vehicleModel?.maxPowerKw || 0,
      batteryCapacityKwh: vehicleModel?.batteryCapacityKwh || 0,
      connectorTypeIds: vehicleModel?.connectorTypeIds || [],
    },
  });

  useEffect(() => {
    if (vehicleModel) {
      form.reset({
        modelName: vehicleModel.modelName,
        maxPowerKw: vehicleModel.maxPowerKw,
        batteryCapacityKwh: vehicleModel.batteryCapacityKwh,
        connectorTypeIds: vehicleModel.connectorTypeIds,
      });
    }
  }, [vehicleModel, form]);

  useEffect(() => {
    if (!updateState.msg) return;
    if (updateState.success) {
      toast.success(updateState.msg);
      setEditDialogOpen(false);
      form.reset();
    } else {
      toast.error(updateState.msg);
    }
  }, [updateState]);

  function onSubmit(data: VehicleModelFormData) {
    if (!vehicleModel) return;

    const formData = new FormData();
    formData.append("id", vehicleModel.id.toString());
    formData.append("modelName", data.modelName);
    formData.append("maxPowerKw", data.maxPowerKw.toString());
    formData.append("batteryCapacityKwh", data.batteryCapacityKwh.toString());

    data.connectorTypeIds.forEach((id: string) => {
      formData.append("connectorTypeIds", id);
    });

    startTransition(() => {
      updateAction(formData);
    });
  }

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.editTitle}</DialogTitle>
          <DialogDescription>{t.editDescription}</DialogDescription>
        </DialogHeader>

        <form
          id="vehicle-model-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
          </FieldGroup>
        </form>

        <DialogFooter className="flex w-full">
          <Button
            type="submit"
            form="vehicle-model-form"
            className="self-end"
            disabled={updatePending}
          >
            {updatePending ? t.form.updating : t.form.updateButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
