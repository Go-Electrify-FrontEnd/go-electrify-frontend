import { z } from "zod";

export const CarModelSchema = z.object({
  id: z.number(),
  modelName: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.string().optional(),
  maxPowerKw: z.number(),
  batteryCapacityKwh: z.number(),
  batteryCapacity: z.number(),
  supportedPorts: z.array(z.string()),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});
export type CarModel = z.infer<typeof CarModelSchema>;
