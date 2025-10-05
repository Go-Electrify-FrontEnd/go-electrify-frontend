import { z } from "zod";

export const CarModelSchema = z.object({
  id: z.number().optional(),
  modelName: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  maxPowerKw: z.number().optional(),
  batteryCapacityKwh: z.number().optional(),
  batteryCapacity: z.number().optional(),
  supportedPorts: z.array(z.string()).optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});
export type CarModel = z.infer<typeof CarModelSchema>;
