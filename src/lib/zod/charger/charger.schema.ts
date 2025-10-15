import { z } from "zod";

export const ChargerApiSchema = z
  .object({
    Id: z.number(),
    StationId: z.number(),
    ConnectorTypeId: z.number(),
    Code: z.string(),
    PowerKw: z.number(),
    Status: z.enum(["ONLINE", "OFFLINE", "MAINTENANCE"]).optional(),
    PricePerKwh: z.number(),
    CreatedAt: z.string(),
    UpdatedAt: z.string(),
  })
  .transform((raw) => ({
    id: raw.Id,
    stationId: raw.StationId,
    connectorTypeId: raw.ConnectorTypeId,
    code: raw.Code,
    powerKw: raw.PowerKw,
    status: raw.Status ?? "ONLINE",
    pricePerKwh: raw.PricePerKwh,
    createdAt: new Date(raw.CreatedAt),
    updatedAt: new Date(raw.UpdatedAt),
  }));

export type Charger = z.infer<typeof ChargerApiSchema>;
