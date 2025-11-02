import { z } from "zod";

// ============================================================================
// Shared Primitives
// ============================================================================

const isoDateString = z
  .string()
  .min(1)
  .refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  });

const socPercentage = z.number().min(0).max(100);
const positiveInt = z.number().int().positive();
const nonNegativeInt = z.number().int().nonnegative();

// ============================================================================
// Session Status
// ============================================================================

const sessionStatus = z.enum([
  "RUNNING",
  "COMPLETED",
  "TIMEOUT",
  "FAILED",
  "UNPAID",
  "PAID",
  "PENDING",
]);

// ============================================================================
// Charging Session Schema
// ============================================================================

export const CurrentChargingSessionSchema = z.object({
  id: positiveInt,
  status: sessionStatus,
  startedAt: isoDateString,
  endedAt: isoDateString.nullable(),
  targetSoc: socPercentage,
  socStart: socPercentage,
  finalSoc: socPercentage.nullable(),
  energyKwh: z.number().nonnegative(),
  cost: z.number().nullable(),
  bookingId: nonNegativeInt,
  chargerId: nonNegativeInt,
  channelId: z.string().min(1),
});

export type CurrentChargingSession = z.infer<
  typeof CurrentChargingSessionSchema
>;

// ============================================================================
// Current Session Data Schema
// ============================================================================

const CurrentSessionDataSchema = z.object({
  session: CurrentChargingSessionSchema,
  ablyToken: z.string(),
  expiresAt: isoDateString,
});

export type CurrentSessionData = z.infer<typeof CurrentSessionDataSchema>;

// ============================================================================
// API Response Schemas
// ============================================================================

const CurrentSessionSuccessResponseSchema = z.object({
  ok: z.literal(true),
  data: CurrentSessionDataSchema,
});

const CurrentSessionErrorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.string().min(1),
  message: z.string().optional(),
});

export const CurrentSessionWithTokenResponseSchema = z.discriminatedUnion(
  "ok",
  [CurrentSessionSuccessResponseSchema, CurrentSessionErrorResponseSchema],
);

export type CurrentSessionSuccessResponse = z.infer<
  typeof CurrentSessionSuccessResponseSchema
>;
export type CurrentSessionErrorResponse = z.infer<
  typeof CurrentSessionErrorResponseSchema
>;
export type CurrentSessionWithTokenResponse = z.infer<
  typeof CurrentSessionWithTokenResponseSchema
>;
