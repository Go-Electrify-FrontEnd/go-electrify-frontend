import { z } from "zod";

export const SubscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  totalKwh: z.number(),
  durationDays: z.number(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;
