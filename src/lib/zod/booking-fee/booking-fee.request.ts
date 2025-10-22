import * as z from "zod";

export const bookingFeeUpdateSchema = z.object({
  type: z.enum(["FLAT", "PERCENT"]),
  value: z.coerce.number<number>().nonnegative("Giá trị phải là số dương"),
});

export type BookingFeeUpdateFormData = z.infer<typeof bookingFeeUpdateSchema>;
