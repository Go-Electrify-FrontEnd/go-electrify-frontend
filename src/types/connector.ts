import { z } from "zod";

// Accept backend payloads that use PascalCase keys (Id, Name, Description, MaxPowerKw)
// but expose a camelCase TypeScript type for internal use.
export const ConnectorTypeSchema = z
  .object({
    Id: z.number().optional(),
    Name: z.string().optional(),
    Description: z.string().optional(),
    MaxPowerKw: z.number().optional(),
  })
  .transform((raw) => ({
    id: raw.Id as number,
    name: raw.Name as string,
    description: raw.Description as string | undefined,
    maxPowerKw: raw.MaxPowerKw as number,
  }));

export type ConnectorType = z.infer<typeof ConnectorTypeSchema>;
