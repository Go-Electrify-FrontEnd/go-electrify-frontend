import { z } from "zod";

export const UserSubscriptionSchema = z
  .object({
    Id: z.number(),
    SubscriptionId: z.number(),
    SubscriptionName: z.string(),
    Price: z.number(),
    TotalKwh: z.number(),
    RemainingKwh: z.number(),
    Status: z.string(),
    StartDate: z.string(),
    EndDate: z.string(),
  })
  .transform((raw) => ({
    id: raw.Id,
    subscriptionId: raw.SubscriptionId,
    subscriptionName: raw.SubscriptionName,
    price: raw.Price,
    totalKwh: raw.TotalKwh,
    remainingKwh: raw.RemainingKwh,
    status: raw.Status,
    startDate: raw.StartDate,
    endDate: raw.EndDate,
  }));

export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;
