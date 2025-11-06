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
import { useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";
import { useConnectorTypes } from "@/contexts/connector-type-context";
import { createVehicleModel } from "../services/vehicle-models-actions";
import {
  VehicleModelFormData,
  vehicleModelSchema,
} from "../schemas/vehicle-model.request";

const initialState = {
  success: false,
  msg: "",
};

export default function VehicleModelCreateDialog() {
  const connectorTypes = useConnectorTypes();
  const [open, setOpen] = useState(false);

  const { execute, pending } = useServerAction(
    createVehicleModel,
    initialState,
    {
      onSettled: (result) => {
        if (result.success) {
          form.reset();
          setOpen(false);
          toast.success(result.msg);
        } else if (result.msg) {
          toast.error(result.msg);
        }
      },
    },
  );

  const form = useForm<VehicleModelFormData>({
    resolver: zodResolver(vehicleModelSchema),
    defaultValues: {
      modelName: "",
      maxPowerKw: 50,
      batteryCapacityKwh: 50,
      connectorTypeIds: [],
    },
  });

  function onSubmit(data: VehicleModelFormData) {
    const formData = new FormData();
    formData.append("modelName", data.modelName);
    formData.append("maxPowerKw", data.maxPowerKw.toString());
    formData.append("batteryCapacityKwh", data.batteryCapacityKwh.toString());

    data.connectorTypeIds.forEach((id: string) => {
      formData.append("connectorTypeIds", id);
    });

    // Execute server action (startTransition is handled inside the hook)
    execute(formData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus />
          <span className="font-semibold">Tạo mẫu xe</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo mẫu xe</DialogTitle>
          <DialogDescription>Thêm mẫu xe mới vào hệ thống</DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="my-4">
            <Controller
              name="modelName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="modelName">Tên mẫu xe</FieldLabel>
                  <Input
                    {...field}
                    id="modelName"
                    placeholder={"Nhập tên mẫu xe"}
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
                    Công suất tối đa (kW)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="maxPowerKw"
                    placeholder={"Nhập công suất tối đa"}
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
              name="batteryCapacityKwh"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="batteryCapacityKwh">
                    Dung lượng pin (kWh)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="batteryCapacityKwh"
                    placeholder={"Nhập dung lượng pin"}
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
              name="connectorTypeIds"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="connectorTypeIds">Loại cổng</FieldLabel>
                  <MultiSelect
                    onValuesChange={field.onChange}
                    values={field.value}
                    aria-invalid={fieldState.invalid}
                  >
                    <MultiSelectTrigger className="w-full max-w-[400px]">
                      <MultiSelectValue
                        placeholder={"Chọn loại cổng"}
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
                {pending ? "Đang tạo..." : "Tạo"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
