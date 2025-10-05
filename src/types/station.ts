import { z } from "zod";

export const StationSchema = z.object({
  id: z.number(),
  name: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  type: z.string(),
  address: z.string(),
  available: z.boolean(),
  available_connectors: z.number(),
  total_connectors: z.number(),
  distance: z.number().optional(),
});
export type Station = z.infer<typeof StationSchema>;
