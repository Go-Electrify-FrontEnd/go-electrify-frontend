import { z } from "zod";

const priceField = z.coerce
  .number()
  .refine((value) => !Number.isNaN(value), {
    message: "Giá phải là số không âm",
  })
  .min(0, "Giá phải là số không âm");

const totalKwHField = z.coerce
  .number()
  .refine((value) => !Number.isNaN(value), {
    message: "Tổng kWh phải lớn hơn 0",
  })
  .min(1, "Tổng kWh phải lớn hơn 0");

const durationField = z.coerce
  .number()
  .refine((value) => !Number.isNaN(value), {
    message: "Thời hạn phải lớn hơn 0",
  })
  .min(1, "Thời hạn phải lớn hơn 0");

const subscriptionBaseSchema = z.object({
  name: z.string().trim().min(1, "Tên gói đăng ký là bắt buộc"),
  price: priceField,
  totalKwH: totalKwHField,
  durationDays: durationField,
});

export const subscriptionCreateSchema = subscriptionBaseSchema;

export const subscriptionUpdateSchema = subscriptionBaseSchema.extend({
  id: z.string().trim().min(1, "ID gói đăng ký là bắt buộc"),
});

export type SubscriptionCreateFormData = z.infer<
  typeof subscriptionCreateSchema
>;

export type SubscriptionUpdateFormData = z.infer<
  typeof subscriptionUpdateSchema
>;
