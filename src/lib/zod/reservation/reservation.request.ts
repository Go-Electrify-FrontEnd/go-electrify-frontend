import * as z from "zod";

export const reservationFormSchema = z.object({
  stationId: z.string().min(1, "Trạm sạc là bắt buộc"),
  vehicleModelId: z.string().min(1, "Mẫu xe là bắt buộc"),
  connectorTypeId: z.string().min(1, "Loại cổng là bắt buộc"),
  initialSoc: z.coerce
    .number<number>()
    .min(0, "Mức sạc ban đầu không được nhỏ hơn 0")
    .max(100, "Mức sạc ban đầu không được lớn hơn 100"),
});

export type ReservationFormData = z.infer<typeof reservationFormSchema>;

// Booking API response schema (maps backend PascalCase -> client-friendly fields)
export const BookingApiSchema = z
  .object({
    Id: z.number(),
    Code: z.string(),
    Status: z.enum(["PENDING", "CONFIRMED", "CANCELED", "EXPIRED", "CONSUMED"]),
    ScheduledStart: z.string(),
    InitialSoc: z.number(),
    StationId: z.number(),
    ConnectorTypeId: z.number(),
    VehicleModelId: z.number(),
    EstimatedCost: z.number().nullable(),
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

export type BookingApi = z.infer<typeof BookingApiSchema>;
