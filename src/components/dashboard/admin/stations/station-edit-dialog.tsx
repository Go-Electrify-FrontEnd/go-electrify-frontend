"use client";

import { useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import type { Station } from "@/lib/zod/station/station.types";
import { useServerAction } from "@/hooks/use-server-action";
import {
  stationUpdateSchema,
  type StationUpdateFormData,
} from "@/lib/zod/station/station.request";
import { updateStation } from "@/actions/stations-actions";

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

  const form = useForm<StationUpdateFormData>({
    resolver: zodResolver(
      stationUpdateSchema,
    ) as Resolver<StationUpdateFormData>,
    defaultValues: {
      id: id.toString(),
      name,
      description: description ?? "",
      address,
      latitude: latitude?.toString?.() ?? "",
      longitude: longitude?.toString?.() ?? "",
      status,
    },
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
    form.reset({
      id: id.toString(),
      name,
      description: description ?? "",
      address,
      latitude: latitude?.toString?.() ?? "",
      longitude: longitude?.toString?.() ?? "",
      status,
    });
  }, [open, id, name, description, address, latitude, longitude, status, form]);

  const handleSubmit = form.handleSubmit((data) => {
    const payload = new FormData();
    payload.append("id", data.id);
    payload.append("name", data.name);
    payload.append("description", data.description ?? "");
    payload.append("address", data.address);
    payload.append("status", data.status);
    if (data.latitude) payload.append("latitude", data.latitude);
    if (data.longitude) payload.append("longitude", data.longitude);

    // handle image file input if present in the DOM
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (file) {
      payload.append("image", file);
    }

    execute(payload);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset({
            id: id.toString(),
            name,
            description: description ?? "",
            address,
            latitude: latitude?.toString?.() ?? "",
            longitude: longitude?.toString?.() ?? "",
            status,
          });
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
                  <Input
                    id="station-description"
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
              name="address"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="station-address">Địa chỉ</FieldLabel>
                  <Input
                    id="station-address"
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
              name="latitude"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="station-latitude">
                    Vĩ độ (tùy chọn)
                  </FieldLabel>
                  <Input
                    id="station-latitude"
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
              name="longitude"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="station-longitude">
                    Kinh độ (tùy chọn)
                  </FieldLabel>
                  <Input
                    id="station-longitude"
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
              name="status"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="station-status">Trạng thái</FieldLabel>
                  <select
                    {...field}
                    id="station-status"
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                  </select>
                </Field>
              )}
            />
          </FieldGroup>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Hình ảnh (tùy chọn)
            </label>
            <input type="file" accept="image/*" />
            {imageUrl && (
              <p className="text-muted-foreground mt-2 text-sm">
                URL hiện tại: {imageUrl}
              </p>
            )}
          </div>
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
