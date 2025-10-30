import * as z from "zod";

export const ReservationSchema = z
  .object({
    Id: z.coerce.number<number>(),
    Code: z.string(),
    Status: z.enum(["PENDING", "CONFIRMED", "CANCELED", "EXPIRED", "CONSUMED"]),
    ScheduledStart: z.string(),
    InitialSoc: z.coerce.number<number>(),
    StationId: z.coerce.number<number>(),
    ConnectorTypeId: z.coerce.number<number>(),
    VehicleModelId: z.coerce.number<number>(),
    EstimatedCost: z.coerce.number<number>().nullable(),
  })
  .transform((raw) => ({
    id: raw.Id,
    code: raw.Code,
    status: raw.Status,
    scheduledStart: new Date(raw.ScheduledStart),
    initialSoc: raw.InitialSoc,
    stationId: raw.StationId,
    connectorTypeId: raw.ConnectorTypeId,
    vehicleModelId: raw.VehicleModelId,
    estimatedCost: raw.EstimatedCost,
  }));

export type Reservation = z.infer<typeof ReservationSchema>;
