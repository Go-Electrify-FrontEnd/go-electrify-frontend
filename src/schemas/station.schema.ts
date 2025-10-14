import { z } from "zod";

export const stationCreateSchema = z.object({
  name: z.string().trim().min(3, "Tên phải có ít nhất 3 ký tự"),
  description: z.string().max(500).optional().or(z.literal("")),
  address: z.string().trim().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  imageUrl: z.string().optional().or(z.literal("")),
  latitude: z.string().optional().or(z.literal("")),
  longitude: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "maintenance"]).default("active"),
});

export const stationUpdateSchema = stationCreateSchema.extend({
  id: z.string().trim().min(1, "ID trạm là bắt buộc"),
});

export type StationCreateFormData = z.infer<typeof stationCreateSchema>;
export type StationUpdateFormData = z.infer<typeof stationUpdateSchema>;
