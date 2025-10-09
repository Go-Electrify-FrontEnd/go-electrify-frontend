import { z } from "zod";

export const ConnectorTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  maxPowerKw: z.number(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});
export type ConnectorType = z.infer<typeof ConnectorTypeSchema>;
