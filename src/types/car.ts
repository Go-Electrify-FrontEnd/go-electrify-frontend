import { z } from "zod";

export const CarModelSchema = z
  .object({
    Id: z.number(),
    ModelName: z.string(),
    MaxPowerKw: z.number(),
    BatteryCapacityKwh: z.number(),
    ConnectorTypeIds: z.array(z.string()),
  })
  .transform((raw) => ({
    id: raw.Id,
    modelName: raw.ModelName,
    maxPowerKw: raw.MaxPowerKw,
    batteryCapacityKwh: raw.BatteryCapacityKwh,
    connectorTypeIds: raw.ConnectorTypeIds,
  }));

export type CarModel = z.infer<typeof CarModelSchema>;
