import { z } from "zod";

export const StationSessionSchema = z
  .object({
    Id: z.number(),
    Status: z.enum(["STOPPED"]),
    StartedAt: z.string(),
    ChargerId: z.number(),
    StationId: z.number(),
    ConnectorTypeId: z.number(),
    BookingId: z.number().nullable().optional(),
    InitialSoc: z.number().nullable().optional(),
    VehicleBatteryCapacityKwh: z.number().nullable().optional(),
    VehicleMaxPowerKw: z.number().nullable().optional(),
    ChargerPowerKw: z.number().nullable().optional(),
    ConnectorMaxPowerKw: z.number().nullable().optional(),
    TargetSoc: z.number().nullable().optional(),
  })
  .transform((raw) => ({
    id: raw.Id,
    status: raw.Status,
    startedAt: raw.StartedAt,
    chargerId: raw.ChargerId,
    stationId: raw.StationId,
    connectorTypeId: raw.ConnectorTypeId,
    bookingId: raw.BookingId ?? null,
    initialSoc: raw.InitialSoc ?? null,
    vehicleBatteryCapacityKwh: raw.VehicleBatteryCapacityKwh ?? null,
    vehicleMaxPowerKw: raw.VehicleMaxPowerKw ?? null,
    chargerPowerKw: raw.ChargerPowerKw ?? null,
    connectorMaxPowerKw: raw.ConnectorMaxPowerKw ?? null,
    targetSoc: raw.TargetSoc ?? null,
  }));

export type StationSession = z.infer<typeof StationSessionSchema>;
