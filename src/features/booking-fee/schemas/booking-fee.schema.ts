
import { z } from "zod";

export const BookingFeeTypeSchema = z.enum(["FLAT", "PERCENT"]);

export const BookingFeeSchema = z.object({
  type: BookingFeeTypeSchema,
  value: z.number().nonnegative("Giá trị phải là số dương"),
});

export const BookingFeeResponseSchema = z.object({
  ok: z.boolean(),
  data: BookingFeeSchema,
});
