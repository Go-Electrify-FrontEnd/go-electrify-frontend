import { z } from "zod";

export const connectorTypeCreateSchema = z.object({
  name: z.string().trim().min(1, "Tên cổng kết nối là bắt buộc"),
  description: z
    .string()
    .trim()
    .max(200, "Mô tả tối đa 200 ký tự")
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  maxPowerKw: z.coerce
    .number<number>()
    .refine((value) => !Number.isNaN(value), {
      message: "Công suất phải là số",
    })
    .min(1, "Công suất phải lớn hơn 0")
    .max(1000, "Công suất vượt quá giới hạn cho phép"),
});

export const connectorTypeUpdateSchema = connectorTypeCreateSchema.extend({
  id: z.string().trim().min(1, "ID cổng kết nối là bắt buộc"),
});

export type ConnectorTypeCreateFormData = z.infer<
  typeof connectorTypeCreateSchema
>;
export type ConnectorTypeUpdateFormData = z.infer<
  typeof connectorTypeUpdateSchema
>;
