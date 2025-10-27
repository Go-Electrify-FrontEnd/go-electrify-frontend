import * as z from "zod";

export const StationStaffSchema = z
  .object({
    StationId: z.number(),
    UserId: z.number(),
    UserEmail: z.string().email(),
    UserFullName: z.string().nullable(),
    AssignedAt: z.iso.datetime(),
    RevokedAt: z.iso.datetime().nullable(),
  })
  .transform((obj) => ({
    stationId: obj.StationId,
    userId: obj.UserId,
    userEmail: obj.UserEmail,
    userFullName: obj.UserFullName,
    assignedAt: obj.AssignedAt,
    revokedAt: obj.RevokedAt,
  }));

export const StationStaffListSchema = z.array(StationStaffSchema);

export type StationStaff = z.infer<typeof StationStaffSchema>;
export type StationStaffList = z.infer<typeof StationStaffListSchema>;
