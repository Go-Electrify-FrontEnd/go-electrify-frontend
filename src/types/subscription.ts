import { z } from "zod";

export const SubscriptionSchema = z
  .object({
    Id: z.number(),
    Name: z.string(),
    Price: z.number(),
    TotalKwh: z.number(),
    DurationDays: z.number(),
  })
  .transform((raw) => ({
    id: raw.Id,
    name: raw.Name,
    price: raw.Price,
    totalKwh: raw.TotalKwh,
    durationDays: raw.DurationDays,
  }));
export type Subscription = z.infer<typeof SubscriptionSchema>;
