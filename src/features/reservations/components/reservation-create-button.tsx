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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Plus,
  Check,
  ChevronsUpDown,
  ArrowLeft,
  Info,
  DollarSign,
} from "lucide-react";
import { startTransition, useActionState, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  reservationFormSchema,
  type ReservationFormData,
} from "../schemas/reservation.request";
import type { Station } from "@/features/stations/schemas/station.types";
import type { CarModel } from "@/features/vehicle-models/schemas/vehicle-model.types";
import type { ConnectorType } from "@/features/connector-type/schemas/connector-type.types";
import { cn } from "@/lib/utils";
import { createReservation } from "../services/reservation-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { BookingFee } from "@/features/booking-fee/schemas/booking-fee.types";

const initialState = {
  success: false,
  msg: "",
};

interface CreateReservationButtonProps {
  stations: Station[];
  vehicleModels: CarModel[];
  connectorTypes: ConnectorType[];
  bookingFee: BookingFee;
  preSelectedStationId?: string;
  defaultOpen?: boolean;
}

export default function CreateReservationButton({
  stations,
  vehicleModels,
  connectorTypes,
  bookingFee,
  preSelectedStationId,
  defaultOpen = false,
}: CreateReservationButtonProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [step, setStep] = useState<1 | 2>(1);
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
      stationId: preSelectedStationId || "",
      vehicleModelId: "",
      connectorTypeId: "",
      initialSoc: 20,
    },
  });

  const selectedVehicleModelId = form.watch("vehicleModelId");

  const availableConnectorTypes = useMemo(
    () =>
      selectedVehicleModelId
        ? connectorTypes.filter((ct) => {
            const vehicleModel = vehicleModels.find(
              (vm) => vm.id.toString() === selectedVehicleModelId,
            );
            return vehicleModel?.connectorTypeIds.includes(ct.id.toString());
          })
        : [],
    [selectedVehicleModelId, connectorTypes, vehicleModels],
  );

  useEffect(() => {
    if (!createState.msg) return;

    if (createState.success) {
      form.reset();
      setStep(1);
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

    startTransition(() => {
      createAction(formData);
    });
  }

  const handleNextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStep(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus />
          <span className="font-semibold">Tạo Đặt Chỗ Mới</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {step === 1 ? "Tạo Đặt Chỗ Mới" : "Xác Nhận Phí Đặt Chỗ"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Đặt chỗ sạc xe cho 60 phút kể từ bây giờ"
              : "Vui lòng xem xét chi phí và điều khoản trước khi xác nhận"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <form className="space-y-6">
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
                                (station) =>
                                  station.id.toString() === field.value,
                              )?.name
                            : "Chọn trạm sạc"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Tìm kiếm trạm sạc..." />
                          <CommandList>
                            <CommandEmpty>
                              Không tìm thấy trạm sạc.
                            </CommandEmpty>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    <Popover
                      open={openVehicleModel}
                      onOpenChange={setOpenVehicleModel}
                    >
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
                            ? vehicleModels.find(
                                (vm) => vm.id.toString() === field.value,
                              )?.modelName
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
                                      field.value === vm.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0",
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    <Popover
                      open={openConnectorType}
                      onOpenChange={setOpenConnectorType}
                    >
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
                            ? connectorTypes.find(
                                (ct) => ct.id.toString() === field.value,
                              )?.name
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
                            <CommandEmpty>
                              Không tìm thấy loại cổng.
                            </CommandEmpty>
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
                                      field.value === ct.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0",
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <DialogFooter className="flex w-full">
                <Button
                  type="button"
                  className="self-end"
                  onClick={handleNextStep}
                >
                  Tiếp tục
                </Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        ) : (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Thông tin phí đặt chỗ</AlertTitle>
              <AlertDescription>
                Khi đặt chỗ, bạn sẽ được tính phí như sau:
              </AlertDescription>
            </Alert>

            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="text-primary h-5 w-5" />
                <h3 className="font-semibold">Chi phí đặt chỗ</h3>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí đặt chỗ:</span>
                  <span className="text-lg font-semibold">
                    {bookingFee.value.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <p className="font-medium">Cách thức tính phí:</p>
                  <ul className="text-muted-foreground space-y-2">
                    <li>
                      Phí đặt chỗ sẽ được <strong>trừ vào ví</strong> của bạn
                      ngay khi tạo đặt chỗ
                    </li>
                    <li>
                      Nếu bạn <strong>hoàn thành</strong> việc sạc trong thời
                      gian đặt chỗ (60 phút), phí sẽ được{" "}
                      <strong className="text-green-600">hoàn lại 100%</strong>
                    </li>
                    <li>
                      Nếu bạn <strong>không sử dụng</strong> đặt chỗ hoặc đến
                      trễ, phí sẽ{" "}
                      <strong className="text-red-600">
                        không được hoàn lại
                      </strong>
                    </li>
                    <li>
                      Thời gian đặt chỗ có hiệu lực: <strong>60 phút</strong> kể
                      từ bây giờ
                    </li>
                  </ul>
                </div>

                <Alert variant="default" className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Đảm bảo bạn có đủ số dư trong ví để thanh toán phí đặt chỗ.
                    Số dư ví hiện tại của bạn phải lớn hơn hoặc bằng{" "}
                    <strong>
                      {bookingFee.value.toLocaleString("vi-VN")} VNĐ
                    </strong>
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={pending}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "Đang tạo..." : "Xác nhận & Tạo"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
