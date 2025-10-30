import * as z from "zod";

export const vehicleModelSchema = z.object({
  modelName: z.string().trim().min(1, "Tên mẫu xe là bắt buộc"),
  maxPowerKw: z.coerce
    .number<number>()
    .refine((value) => !Number.isNaN(value), {
      message: "Công suất phải là số",
    })
    .min(1, "Công suất phải lớn hơn 0")
    .max(1000, "Công suất vượt quá giới hạn cho phép"),
  batteryCapacityKwh: z.coerce
    .number<number>()
    .refine((value) => !Number.isNaN(value), {
      message: "Dung lượng pin phải là số",
    })
    .min(1, "Dung lượng pin tối thiểu là 1 kWh"),
  connectorTypeIds: z
    .array(z.string())
    .min(1, "Phải có ít nhất một loại cổng kết nối"),
});

export const vehicleModelDeleteSchema = z.object({
  confirmText: z.string().min(1, "Vui lòng nhập tên mẫu xe để xác nhận"),
});

export type VehicleModelFormData = z.infer<typeof vehicleModelSchema>;
export type VehicleModelDeleteFormData = z.infer<typeof vehicleModelDeleteSchema>;
