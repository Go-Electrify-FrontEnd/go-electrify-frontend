"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressSearch from "@/components/address-search";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type Resolver, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useServerAction } from "@/hooks/use-server-action";
import { createStation } from "../services/stations-actions";
import {
  StationCreateFormData,
  stationCreateSchema,
} from "../schemas/station.request";

interface StationCreateProps {
  onCancel?: () => void;
}

export default function StationCreate({ onCancel }: StationCreateProps) {
  const [open, setOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [useManualCoords, setUseManualCoords] = useState(false);

  const initialState = { success: false, msg: "" };
  const { state, execute, pending } = useServerAction(
    createStation,
    initialState,
    {
      onSettled: (result) => {
        if (result.success) {
          setOpen(false);
          toast.success(result.msg);
        } else if (result.msg) {
          toast.error(result.msg);
        }
      },
    },
  );

  const form = useForm<StationCreateFormData>({
    resolver: zodResolver(stationCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      latitude: 0,
      longitude: 0,
      status: "ACTIVE",
    },
  });

  // Get current location using browser geolocation API
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Định vị địa lý không được hỗ trợ bởi trình duyệt của bạn");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude);
        form.setValue("longitude", position.coords.longitude);
        toast.success("Đã phát hiện vị trí thành công");
        setIsLocating(false);
      },
      (error) => {
        toast.error(`Không thể lấy vị trí: ${error.message}`);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        onCancel?.();
      }
      setOpen(nextOpen);
    },
    [onCancel],
  );

  const handleSubmit = form.handleSubmit((data) => {
    const payload = new FormData();
    payload.append("name", data.name);
    payload.append("description", data.description ?? "");
    payload.append("address", data.address);
    payload.append("imageUrl", ""); // Treat as null/empty for now
    payload.append("status", data.status ?? "ACTIVE");
    payload.append("latitude", data.latitude.toString());
    payload.append("longitude", data.longitude.toString());

    execute(payload);
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Trạm
        </Button>
      </DialogTrigger>
      <DialogContent className="no-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="text-primary h-5 w-5" />
            Tạo Trạm Sạc Mới
          </DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết bên dưới để thêm trạm sạc mới vào mạng lưới.
          </DialogDescription>
        </DialogHeader>

        <form
          id="station-create-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <input
            type="hidden"
            name="useManualCoords"
            value={useManualCoords.toString()}
          />

          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="station-name">Tên Trạm *</FieldLabel>
                  <Input
                    id="station-name"
                    {...field}
                    placeholder="VD: Trạm Trung Tâm Thành Phố Hồ Chí Minh"
                    aria-invalid={fieldState.invalid}
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="station-description">Mô tả</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      id="station-description"
                      {...field}
                      placeholder="Mô tả ngắn về trạm (tối đa 200 ký tự)"
                      aria-invalid={fieldState.invalid}
                      rows={4}
                      maxLength={200}
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

            <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Vị Trí Trạm *</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseManualCoords(!useManualCoords)}
                >
                  {useManualCoords ? "Sử Dụng Địa Chỉ" : "Sử Dụng Tọa Độ"}
                </Button>
              </div>

              {!useManualCoords ? (
                <Controller
                  control={form.control}
                  name="address"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="station-address">Địa Chỉ</FieldLabel>
                      <AddressSearch
                        placeholder="Nhập địa chỉ..."
                        onSelect={(result) => {
                          field.onChange(result.address);
                          if (
                            Number.isFinite(result.latitude) &&
                            Number.isFinite(result.longitude)
                          ) {
                            form.setValue("latitude", result.latitude);
                            form.setValue("longitude", result.longitude);
                          }
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <p className="text-muted-foreground mt-2 text-xs">
                        Nhập địa chỉ đầy đủ - tọa độ sẽ được xác định tự động
                      </p>
                    </Field>
                  )}
                />
              ) : (
                <>
                  <Controller
                    control={form.control}
                    name="address"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="station-address">
                          Địa Chỉ (Tùy Chọn)
                        </FieldLabel>
                        <Input
                          id="station-address"
                          {...field}
                          placeholder="VD: 123 Đường Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Tọa Độ</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetCurrentLocation}
                      disabled={isLocating}
                    >
                      {isLocating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang Phát Hiện...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Sử Dụng Vị Trí Hiện Tại
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="latitude"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="station-latitude">
                            Vĩ Độ (Tùy Chọn)
                          </FieldLabel>
                          <Input
                            id="station-latitude"
                            {...field}
                            type="number"
                            step="0.000001"
                            placeholder="10.8231"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="longitude"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="station-longitude">
                            Kinh Độ (Tùy Chọn)
                          </FieldLabel>
                          <Input
                            id="station-longitude"
                            {...field}
                            type="number"
                            step="0.000001"
                            placeholder="106.6297"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <p className="text-muted-foreground text-xs">
                    💡 Mẹo: Nhấp “Sử Dụng Vị Trí Hiện Tại” hoặc lấy tọa độ từ
                    Google Maps
                  </p>
                </>
              )}
            </div>

            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="station-status">
                    Trạng Thái Trạm *
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="station-status"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Chọn trạm</SelectLabel>
                        <SelectItem value="ACTIVE">Hoạt Động</SelectItem>
                        <SelectItem value="INACTIVE">
                          Không Hoạt Động
                        </SelectItem>
                        <SelectItem value="MAINTENANCE">Bảo Trì</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Hủy
              </Button>
            </DialogClose>
            <Button form="station-create-form" type="submit" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pending ? "Đang Tạo..." : "Tạo Trạm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
