import { z } from "zod";

export const BookingFeeSchema = z.object({
  type: z.enum(["FLAT", "PERCENT"]),
  value: z.number().nonnegative("Giá trị phải là số dương"),
});

export const BookingFeeResponseSchema = z.object({
  ok: z.boolean(),
  data: BookingFeeSchema,
});
