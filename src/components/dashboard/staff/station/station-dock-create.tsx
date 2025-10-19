"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Loader2, Plus } from "lucide-react";
import {
  Controller,
  type Resolver,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { useState } from "react";
import { createCharger } from "@/actions/chargers-actions";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";
import {
  chargerCreateSchema,
  type ChargerCreateFormData,
} from "@/lib/zod/charger/charger.request";
import { ConnectorType } from "@/types/connector";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = { success: false, msg: "" };

interface StationDockCreateProps {
  stationId: number;
  connectorTypes: ConnectorType[];
}

export default function StationDockCreate({
  stationId,
  connectorTypes,
}: StationDockCreateProps) {
  const [open, setOpen] = useState(false);

  const { execute, pending } = useServerAction(createCharger, initialState, {
    onSuccess: (result) => {
      toast.success("Sạc điện đã được tạo", {
        description: result.msg,
      });
      setOpen(false);
      form.reset();
    },
    onError: (result) => {
      if (result.msg) {
        toast.error("Tạo sạc điện thất bại", {
          description: result.msg,
        });
      }
    },
  });

  const form = useForm<ChargerCreateFormData>({
    resolver: zodResolver(
      chargerCreateSchema,
    ) as Resolver<ChargerCreateFormData>,
    defaultValues: {
      stationId,
      connectorTypeId: 1,
      code: "",
      powerKw: 7,
      status: "active",
      pricePerKwh: 5000,
      dockSecretHash: "",
    },
  });

  // Generate a random string using Math.random so the component remains a pure React client
  const generateRandomSecret = (length = 16) => {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * charset.length);
      result += charset[idx];
    }
    return result;
  };

  const onSubmit: SubmitHandler<ChargerCreateFormData> = (data) => {
    console.log("station-dock-create onSubmit", data);
    try {
      toast("Đang gửi yêu cầu tạo trụ sạc...");
    } catch {}
    const formData = new FormData();
    formData.append("stationId", data.stationId.toString());
    formData.append("connectorTypeId", data.connectorTypeId.toString());
    formData.append("code", data.code);
    formData.append("powerKw", data.powerKw.toString());
    formData.append("status", data.status);
    formData.append("pricePerKwh", data.pricePerKwh.toString());
    formData.append("dockSecretHash", data.dockSecretHash);

    execute(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="relative w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          Tạo Trụ Sạc
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Tạo Trụ Sạc</DialogTitle>
          <DialogDescription>Thêm trụ sạc mới vào trạm</DialogDescription>
        </DialogHeader>

        <form
          id="charger-form"
          className="space-y-6"
          onSubmit={(e) => {
            // Debug wrapper to ensure submit attempts are logged and validation errors are visible
            console.log("station-dock-create form submit clicked");
            e.preventDefault();
            form.handleSubmit(onSubmit, (errors) => {
              console.log("Validation errors:", errors);
              try {
                toast.error("Vui lòng kiểm tra các trường có lỗi");
              } catch {}
            })();
          }}
        >
          <input type="hidden" {...form.register("stationId")} />
          <FieldGroup>
            <Controller
              control={form.control}
              name="connectorTypeId"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="connectorTypeId">
                    Loại Cổng Kết Nối
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={String(field.value ?? "")}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại cổng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Loại Cổng Kết Nối</SelectLabel>
                        {connectorTypes.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
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
                  <FieldLabel htmlFor="code">Mã Sạc</FieldLabel>
                  <Input
                    {...field}
                    placeholder="CHARGER-001"
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
              control={form.control}
              name="powerKw"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="powerKw">Công Suất (kW)</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="0.1"
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    aria-invalid={fieldState.invalid}
                    placeholder="7"
                    autoComplete="off"
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
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="status">Trạng Thái</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
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
                  <FieldLabel htmlFor="pricePerKwh">
                    Giá Trên mỗi kWh (VND)
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    aria-invalid={fieldState.invalid}
                    placeholder="5000"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="dockSecretHash"
              render={({ field, fieldState }) => {
                const handleGenerate = () => {
                  const secret = generateRandomSecret(16);
                  field.onChange(secret);
                  // clear validation error if any
                  try {
                    form.clearErrors("dockSecretHash");
                  } catch {}
                };

                return (
                  <Field>
                    <FieldLabel htmlFor="dockSecretHash">
                      Hash Bí Mật
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="hash_value_here"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />

                    <p className="-mt-1 text-sm">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={handleGenerate}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleGenerate();
                          }
                        }}
                        className="text-primary cursor-pointer *:underline"
                        aria-label="Sinh mã bí mật 16 ký tự"
                      >
                        Sinh mã 16 ký tự
                      </span>
                    </p>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Huỷ
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Đang tạo..." : "Tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
