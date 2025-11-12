import { z } from "zod";

export const StationStatus = z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]);
export type StationStatusType = z.infer<typeof StationStatus>;

export const StationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  address: z.string(),
  imageUrl: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  status: StationStatus,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Station = z.infer<typeof StationSchema>;

export const StationApiSchema = z
  .object({
    Id: z.number(),
    Name: z.string(),
    Description: z.string().optional().nullable(),
    Address: z.string(),
    ImageUrl: z.string().optional().nullable(),
    Latitude: z.number(),
    Longitude: z.number(),
    // API returns uppercase status values (e.g. "ACTIVE"); validate them separately
    Status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]),
    CreatedAt: z.string(),
    UpdatedAt: z.string(),
  })
  .transform((raw) => ({
    id: raw.Id,
    name: raw.Name,
    description: raw.Description ?? undefined,
    address: raw.Address,
    imageUrl: raw.ImageUrl ?? undefined,
    latitude: raw.Latitude,
    longitude: raw.Longitude,
    status: raw.Status as StationStatusType,
    createdAt: new Date(raw.CreatedAt),
    updatedAt: new Date(raw.UpdatedAt),
  }));

export const StationBookingSchema = z.object({
  id: z.number(),
  code: z.string(),
  status: z.string(),
  scheduledStart: z.string(),
  initialSoc: z.number().nullable(),
  estimatedCost: z.number().nullable(),
  stationId: z.number(),
  connectorTypeId: z.number(),
  vehicleModelId: z.number().nullable(),
});

export const StationBookingApiSchema = z
  .object({
    Id: z.number(),
    Code: z.string(),
    Status: z.string(),
    ScheduledStart: z.string(),
    InitialSoc: z.number().nullable(),
    StationId: z.number(),
    ConnectorTypeId: z.number(),
    VehicleModelId: z.number().nullable(),
    EstimatedCost: z.number().nullable(),
    ChargerId: z.number().nullable(),
  })
  .transform((raw) => ({
    id: raw.Id,
    code: raw.Code,
    status: raw.Status,
    scheduledStart: raw.ScheduledStart,
    initialSoc: raw.InitialSoc,
    estimatedCost: raw.EstimatedCost,
    stationId: raw.StationId,
    connectorTypeId: raw.ConnectorTypeId,
    vehicleModelId: raw.VehicleModelId,
  }));

export const StationBookingListApiSchema = z.object({
  ok: z.boolean().optional(),
  data: z.array(StationBookingApiSchema).optional(),
});

export type StationBooking = z.infer<typeof StationBookingSchema>;
