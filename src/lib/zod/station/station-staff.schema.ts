import * as z from "zod";

export const StationStaffSchema = z.object({
  StationId: z.number(),
  UserId: z.number(),
  UserEmail: z.string().email(),
  UserFullName: z.string().nullable(),
  AssignedAt: z.string().datetime(),
  RevokedAt: z.string().datetime().nullable(),
});

export const StationStaffListSchema = z.array(StationStaffSchema);

export type StationStaff = z.infer<typeof StationStaffSchema>;
export type StationStaffList = z.infer<typeof StationStaffListSchema>;

// Normalized format for the table row
export const StationStaffRowSchema = z.object({
  stationId: z.number(),
  userId: z.number(),
  userEmail: z.string(),
  userFullName: z.string().nullable(),
  assignedAt: z.string(),
  revokedAt: z.string().nullable(),
});

export type StationStaffRow = z.infer<typeof StationStaffRowSchema>;
