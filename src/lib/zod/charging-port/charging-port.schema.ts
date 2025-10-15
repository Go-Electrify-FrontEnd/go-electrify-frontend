import { z } from "zod";

export const ChargingPortSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  maxPower: z.string(),
});

export type ChargingPort = z.infer<typeof ChargingPortSchema>;
