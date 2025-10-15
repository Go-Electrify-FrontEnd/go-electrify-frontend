import { z } from "zod";

export const StationStatus = z.enum(["active", "inactive", "maintenance"]);
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
    status: raw.Status.toLowerCase() as StationStatusType,
    createdAt: new Date(raw.CreatedAt),
    updatedAt: new Date(raw.UpdatedAt),
  }));

export const LegacyStationSchema = z.object({
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
export type LegacyStation = z.infer<typeof LegacyStationSchema>;
