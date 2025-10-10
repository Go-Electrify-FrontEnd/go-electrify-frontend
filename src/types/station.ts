import { z } from "zod";

// Station status enum
export const StationStatus = z.enum(["active", "inactive", "maintenance"]);
export type StationStatusType = z.infer<typeof StationStatus>;

// Full Station schema (from database)
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

// Station creation schema (for forms)
export const CreateStationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  status: StationStatus,
});
export type CreateStationInput = z.infer<typeof CreateStationSchema>;

// Legacy schema for backward compatibility
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
