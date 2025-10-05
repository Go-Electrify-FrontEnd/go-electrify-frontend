import { z } from "zod";

export const CarModelSchema = z.object({
  id: z.number().optional(),
  modelName: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  maxPowerKw: z.number().optional(),
  batteryCapacityKwh: z.number().optional(),
  batteryCapacity: z.number().optional(),
  supportedPorts: z.array(z.string()).optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});
export type CarModel = z.infer<typeof CarModelSchema>;

export const ChargingPortSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  maxPower: z.string(),
});
export type ChargingPort = z.infer<typeof ChargingPortSchema>;

export const ReservationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  pointId: z.number(),
  scheduledStart: z.union([z.string(), z.date()]),
  scheduledEnd: z.union([z.string(), z.date()]),
  initialSoc: z.number(),
  type: z.string(),
  status: z.string(),
  estimatedCost: z.number(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});
export type Reservation = z.infer<typeof ReservationSchema>;

export const SubscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  totalKwh: z.number(),
  durationDays: z.number(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const ConnectorTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  maxPowerKw: z.number().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});
export type ConnectorType = z.infer<typeof ConnectorTypeSchema>;

export const StationSchema = z.object({
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
export type Station = z.infer<typeof StationSchema>;

export const UserSchema = z.object({
  email: z.email(),
});
export type User = z.infer<typeof UserSchema>;

// helper validator export
export const schemas = {
  CarModel: CarModelSchema,
  ChargingPort: ChargingPortSchema,
  Reservation: ReservationSchema,
  Subscription: SubscriptionSchema,
  ConnectorType: ConnectorTypeSchema,
  Station: StationSchema,
  User: UserSchema,
};
