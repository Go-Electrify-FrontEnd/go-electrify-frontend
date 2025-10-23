"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";
import type { Station } from "@/lib/zod/station/station.types";
import { useServerAction } from "@/hooks/use-server-action";
import {
  stationUpdateSchema,
  type StationUpdateFormData,
} from "@/lib/zod/station/station.request";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressSearch from "@/components/shared/address-search";
import { StationStatusType } from "@/lib/zod/station/station.schema";
import { updateStation } from "../services/stations-actions";

interface UpdateStationProps {
  station: Station;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = { success: false, msg: "" };

export function UpdateStation({
  station,
  open,
  onOpenChange,
}: UpdateStationProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [useManualCoords, setUseManualCoords] = useState(false);
  const {
    id,
    name,
    description,
    address,
    imageUrl,
    latitude,
    longitude,
    status,
  } = station;

  // station status (debug removed)

  const defaultValues: StationUpdateFormData = {
    id,
    name,
    description: description ?? "",
    address,
    latitude,
    longitude,
    status: status as StationStatusType,
  };

  const form = useForm<StationUpdateFormData>({
    resolver: zodResolver(stationUpdateSchema),
    defaultValues,
  });

  const { execute, pending } = useServerAction(updateStation, initialState, {
    onSuccess: (result) => {
      toast.success("Trạm đã được cập nhật", { description: result.msg });
      onOpenChange(false);
      form.reset();
    },
    onError: (result) => {
      if (result.msg) {
        toast.error("Cập nhật không thành công", { description: result.msg });
      }
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset(defaultValues);
  }, [open, id, name, description, address, latitude, longitude, status, form]);

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

  const handleSubmit = form.handleSubmit((data) => {
    const payload = new FormData();
    payload.append("id", data.id.toString());
    payload.append("name", data.name);
    payload.append("description", data.description ?? "");
    payload.append("address", data.address);
    payload.append("status", data.status);
    payload.append("latitude", String(data.latitude));
    payload.append("longitude", String(data.longitude));
    payload.append("imageUrl", data.imageUrl ?? "");
    execute(payload);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset(defaultValues);
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa trạm</DialogTitle>
          <DialogDescription>Cập nhật thông tin trạm</DialogDescription>
        </DialogHeader>

        <form
          id="station-update-form"
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <input type="hidden" {...form.register("id")} />
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="station-name">Tên</FieldLabel>
                  <Input
                    id="station-name"
                    {...field}
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
                      {...field}
                      placeholder="Mô tả ngắn về trạm (tối đa 200 ký tự)"
                      aria-invalid={fieldState.invalid}
                      rows={6}
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
                        placeholder={field.value || "Nhập địa chỉ để tìm..."}
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
                    💡 Mẹo: Nhấp &ldquo;Sử Dụng Vị Trí Hiện Tại&rdquo; hoặc lấy
                    tọa độ từ Google Maps
                  </p>
                </>
              )}
            </div>

            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="station-status">Trạng thái</FieldLabel>
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
                        <SelectLabel>Trạng thái</SelectLabel>
                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                        <SelectItem value="INACTIVE">
                          Không hoạt động
                        </SelectItem>
                        <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
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
        </form>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Huỷ
          </Button>
          <Button form="station-update-form" type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
