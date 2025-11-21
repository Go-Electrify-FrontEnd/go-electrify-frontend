"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useChargerUpdate } from "@/features/stations/contexts/charger-update-context";
import { useServerAction } from "@/hooks/use-server-action";
import { updateCharger } from "@/features/stations/services/chargers-actions";
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
import type { ConnectorType } from "@/features/connector-type/schemas/connector-type.schema";
import {
  ChargerUpdateFormData,
  chargerUpdateSchema,
} from "@/features/chargers/schemas/charger.request";

interface UpdateChargerProps {
  connectorTypes: ConnectorType[];
}

export default function UpdateCharger({ connectorTypes }: UpdateChargerProps) {
  const { charger, isEditDialogOpen, setEditDialogOpen, setCharger } =
    useChargerUpdate();

  const initialState = { success: false, msg: "" };
  const { execute, pending } = useServerAction(updateCharger, initialState, {
    onSettled: (res) => {
      if (res.success) {
        toast.success(res.msg);
        setEditDialogOpen(false);
        form.reset();
        setCharger(null);
      } else if (res.msg) {
        toast.error(res.msg);
      }
    },
  });

  const form = useForm<ChargerUpdateFormData>({
    resolver: zodResolver(chargerUpdateSchema),
    values: charger
      ? {
          id: charger.id.toString(),
          connectorTypeId: charger.connectorTypeId,
          code: charger.code,
          powerKw: charger.powerKw,
          status: charger.status,
          pricePerKwh: charger.pricePerKwh,
        }
      : undefined,
  });

  if (!charger) return null;

  const onSubmit = (data: ChargerUpdateFormData) => {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("connectorTypeId", data.connectorTypeId.toString());
    formData.append("code", data.code);
    formData.append("powerKw", data.powerKw.toString());
    formData.append("status", data.status);
    formData.append("pricePerKwh", data.pricePerKwh.toString());

    execute(formData);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Cập nhật trụ sạc</DialogTitle>
          <DialogDescription>Chỉnh sửa chi tiết trụ sạc</DialogDescription>
        </DialogHeader>

        <form
          id="charger-update-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="connectorTypeId"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Loại Cổng Kết Nối</FieldLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại cổng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Loại Cổng</SelectLabel>
                        {connectorTypes.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Mã Dock</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      placeholder="CHARGER-001"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="powerKw"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Công Suất (kW)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type="number"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Trạng Thái</FieldLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Trạng thái</SelectLabel>
                        <SelectItem value="ONLINE">Hoạt Động</SelectItem>
                        <SelectItem value="OFFLINE">Không Hoạt Động</SelectItem>
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

            <Controller
              control={form.control}
              name="pricePerKwh"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Giá (VND/kWh)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type="number"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setEditDialogOpen(false)}
            disabled={pending}
          >
            Hủy
          </Button>
          <Button form="charger-update-form" type="submit" disabled={pending}>
            {pending ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
