import * as z from "zod";
import { BookingFeeTypeSchema } from "./booking-fee.schema";

export const bookingFeeUpdateSchema = z.object({
  type: BookingFeeTypeSchema,
  value: z.coerce.number<number>().nonnegative("Giá trị phải là số dương"),
});

export type BookingFeeUpdateFormData = z.infer<typeof bookingFeeUpdateSchema>;
