import { z } from "zod";

export const ReservationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  pointId: z.number(),
  scheduledStart: z.union([z.string(), z.date()]),
  scheduledEnd: z.union([z.string(), z.date()]),
  initialSoc: z.number(),
  type: z.string(),
  status: z.string(),
  estimatedCost: z.number(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});
export type Reservation = z.infer<typeof ReservationSchema>;
