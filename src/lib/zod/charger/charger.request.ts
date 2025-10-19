import * as z from "zod";

export const chargerCreateSchema = z.object({
  stationId: z.coerce
    .number<number>()
    .int("Trạm phải là số nguyên")
    .positive("Trạm phải lớn hơn 0"),
  connectorTypeId: z.coerce
    .number<number>()
    .int("Loại cổng kết nối phải là số nguyên")
    .positive("Loại cổng kết nối phải lớn hơn 0"),
  code: z
    .string()
    .min(1, "Mã sạc là bắt buộc")
    .max(100, "Mã sạc không vượt quá 100 ký tự"),
  powerKw: z.coerce
    .number<number>()
    .positive("Công suất phải lớn hơn 0")
    .max(1000, "Công suất không vượt quá 1000 kW"),
  status: z
    .string()
    .min(1, "Trạng thái là bắt buộc")
    .max(50, "Trạng thái không vượt quá 50 ký tự"),
  pricePerKwh: z.coerce
    .number<number>()
    .nonnegative("Giá phải lớn hơn hoặc bằng 0")
    .max(1000000, "Giá không vượt quá 1,000,000"),
  dockSecretHash: z
    .string()
    .min(1, "Hash bí mật là bắt buộc")
    .max(255, "Hash bí mật không vượt quá 255 ký tự"),
});

export type ChargerCreateFormData = z.infer<typeof chargerCreateSchema>;
