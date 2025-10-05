import { z } from "zod";

export const ConnectorTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  maxPowerKw: z.number().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});
export type ConnectorType = z.infer<typeof ConnectorTypeSchema>;
