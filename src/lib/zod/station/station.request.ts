import { z } from "zod";
import { StationStatus } from "./station.schema";

export const stationCreateSchema = z.object({
  name: z.string().trim().min(3, "Tên phải có ít nhất 3 ký tự"),
  description: z
    .string()
    .max(200, "Mô tả không được vượt quá 200 ký tự")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  imageUrl: z.string().optional().or(z.literal("")),
  latitude: z.coerce.number<number>(),
  longitude: z.coerce.number<number>(),
  status: StationStatus,
});

export const stationUpdateSchema = stationCreateSchema.extend({
  id: z.coerce.number<number>().min(1, "ID trạm là bắt buộc"),
});

export type StationCreateFormData = z.infer<typeof stationCreateSchema>;
export type StationUpdateFormData = z.infer<typeof stationUpdateSchema>;
