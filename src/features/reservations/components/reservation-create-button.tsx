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
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Plus, Check, ChevronsUpDown } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createReservation } from "@/features/reservations/services/reservations";
import { toast } from "sonner";
import {
  reservationFormSchema,
  type ReservationFormData,
} from "@/lib/zod/reservation/reservation.request";
import type { Station } from "@/lib/zod/station/station.types";
import type { CarModel } from "@/lib/zod/vehicle-model/vehicle-model.types";
import type { ConnectorType } from "@/lib/zod/connector-type/connector-type.types";
import { cn } from "@/lib/utils";

const initialState = {
  success: false,
  msg: "",
};

interface CreateReservationButtonProps {
  stations: Station[];
  vehicleModels: CarModel[];
  connectorTypes: ConnectorType[];
}

export default function CreateReservationButton({
  stations,
  vehicleModels,
  connectorTypes,
}: CreateReservationButtonProps) {
  const [open, setOpen] = useState(false);
  const [openStation, setOpenStation] = useState(false);
  const [openVehicleModel, setOpenVehicleModel] = useState(false);
  const [openConnectorType, setOpenConnectorType] = useState(false);

  const [createState, createAction, pending] = useActionState(
    createReservation,
    initialState,
  );

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      stationId: "",
      vehicleModelId: "",
      connectorTypeId: "",
      initialSoc: 20,
    },
  });

  const selectedVehicleModelId = form.watch("vehicleModelId");

  const availableConnectorTypes = selectedVehicleModelId
    ? connectorTypes.filter((ct) => {
        const vehicleModel = vehicleModels.find(
          (vm) => vm.id.toString() === selectedVehicleModelId,
        );
        return vehicleModel?.connectorTypeIds.includes(ct.id.toString());
      })
    : [];

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

  useEffect(() => {
    if (selectedVehicleModelId) {
      const currentConnectorTypeId = form.getValues("connectorTypeId");
      const isCurrentConnectorTypeAvailable = availableConnectorTypes.some(
        (ct) => ct.id.toString() === currentConnectorTypeId,
      );
      if (!isCurrentConnectorTypeAvailable) {
        form.setValue("connectorTypeId", "");
      }
    }
  }, [selectedVehicleModelId, availableConnectorTypes, form]);

  function onSubmit(data: ReservationFormData) {
    const formData = new FormData();
    formData.append("stationId", data.stationId);
    formData.append("vehicleModelId", data.vehicleModelId);
    formData.append("connectorTypeId", data.connectorTypeId);
    formData.append("initialSoc", data.initialSoc.toString());

    startTransition(() => {
      createAction(formData);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus />
          <span className="font-semibold">Tạo Đặt Chỗ Mới</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Tạo Đặt Chỗ Mới
          </DialogTitle>
          <DialogDescription>
            Đặt chỗ sạc xe cho 60 phút kể từ bây giờ
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="my-4">
            {/* Station Selection */}
            <Controller
              name="stationId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stationId">Trạm sạc</FieldLabel>
                  <Popover open={openStation} onOpenChange={setOpenStation}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openStation}
                        aria-invalid={fieldState.invalid}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? stations.find(
                              (station) => station.id.toString() === field.value,
                            )?.name
                          : "Chọn trạm sạc"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Tìm kiếm trạm sạc..." />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy trạm sạc.</CommandEmpty>
                          <CommandGroup>
                            {stations.map((station) => (
                              <CommandItem
                                key={station.id}
                                value={station.name}
                                onSelect={() => {
                                  field.onChange(station.id.toString());
                                  setOpenStation(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === station.id.toString()
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {station.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Vehicle Model Selection */}
            <Controller
              name="vehicleModelId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="vehicleModelId">Mẫu xe</FieldLabel>
                  <Popover open={openVehicleModel} onOpenChange={setOpenVehicleModel}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openVehicleModel}
                        aria-invalid={fieldState.invalid}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? vehicleModels.find((vm) => vm.id.toString() === field.value)?.modelName
                          : vehicleModels.length === 0
                          ? "Đang tải mẫu xe..."
                          : "Chọn mẫu xe của bạn"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Tìm kiếm mẫu xe..." />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy mẫu xe.</CommandEmpty>
                          <CommandGroup>
                            {vehicleModels.map((vm) => (
                              <CommandItem
                                key={vm.id}
                                value={vm.modelName}
                                onSelect={() => {
                                  field.onChange(vm.id.toString());
                                  setOpenVehicleModel(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === vm.id.toString() ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {vm.modelName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Connector Type Selection */}
            <Controller
              name="connectorTypeId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="connectorTypeId">Loại cổng</FieldLabel>
                  <Popover open={openConnectorType} onOpenChange={setOpenConnectorType}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openConnectorType}
                        aria-invalid={fieldState.invalid}
                        disabled={!selectedVehicleModelId}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? connectorTypes.find((ct) => ct.id.toString() === field.value)?.name
                          : selectedVehicleModelId
                          ? "Chọn loại cổng"
                          : "Vui lòng chọn mẫu xe trước"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Tìm kiếm loại cổng..." />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy loại cổng.</CommandEmpty>
                          <CommandGroup>
                            {availableConnectorTypes.map((ct) => (
                              <CommandItem
                                key={ct.id}
                                value={ct.name}
                                onSelect={() => {
                                  field.onChange(ct.id.toString());
                                  setOpenConnectorType(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === ct.id.toString() ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {ct.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Initial SOC */}
            <Controller
              name="initialSoc"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="initialSoc">Mức sạc ban đầu (%)</FieldLabel>
                  <Input
                    {...field}
                    id="initialSoc"
                    placeholder="Nhập mức sạc ban đầu"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
