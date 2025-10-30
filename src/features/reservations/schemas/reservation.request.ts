import * as z from "zod";
import { ReservationSchema } from "./reservation.schema";

export const reservationFormSchema = z.object({
  stationId: z.string().min(1, "Trạm sạc là bắt buộc"),
  vehicleModelId: z.string().min(1, "Mẫu xe là bắt buộc"),
  connectorTypeId: z.string().min(1, "Loại cổng là bắt buộc"),
  initialSoc: z.coerce
    .number<number>()
    .min(0, "Mức sạc ban đầu không được nhỏ hơn 0")
    .max(100, "Mức sạc ban đầu không được lớn hơn 100"),
});

export type ReservationFormData = z.infer<typeof reservationFormSchema>;

export const reservationCancelSchema = z.object({
  reason: z.string().min(1, "Lý do hủy là bắt buộc").max(500, "Lý do không được vượt quá 500 ký tự"),
});

export type ReservationCancelFormData = z.infer<typeof reservationCancelSchema>;

export const ReservationAPI = z.object({
  ok: z.boolean(),
  data: ReservationSchema.array(),
});
export type ReservationApi = z.infer<typeof ReservationAPI>;
