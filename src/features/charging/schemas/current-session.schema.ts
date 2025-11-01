import { z } from "zod";

/**
 * Schema for the Ably token details from the current session endpoint
 */
export const AblyTokenSchema = z.object({
  token: z.string(),
  issued: z.number(), // milliseconds since epoch
  expires: z.number(), // milliseconds since epoch
  capability: z.string(),
  clientId: z.string(),
});

/**
 * Schema for the charging session data from the current session endpoint
 */
export const CurrentChargingSessionSchema = z
  .object({
    id: z.number(),
    status: z.enum([
      "RUNNING",
      "COMPLETED",
      "TIMEOUT",
      "FAILED",
      "UNPAID",
      "PAID",
      "PENDING",
    ]),
    startedAt: z.string(),
    endedAt: z.string().nullable(),
    targetSoc: z.number(),
    socStart: z.number(),
    finalSoc: z.number().nullable(),
    energyKwh: z.number(),
    cost: z.number().nullable(),
    bookingId: z.number(),
    chargerId: z.number(),
    channelId: z.string(),
  })
  .transform((raw) => ({
    id: raw.id,
    status: raw.status,
    startedAt: raw.startedAt,
    endedAt: raw.endedAt,
    targetSoc: raw.targetSoc,
    socStart: raw.socStart,
    finalSoc: raw.finalSoc,
    energyKwh: raw.energyKwh,
    cost: raw.cost,
    bookingId: raw.bookingId,
    chargerId: raw.chargerId,
    channelId: raw.channelId,
  }));

/**
 * Schema for the complete current session with token response
 */
export const CurrentSessionWithTokenResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    session: CurrentChargingSessionSchema,
    ablyToken: z.string(),
    expiresAt: z.string(), // ISO 8601 datetime string
  }),
});

/**
 * Type exports for TypeScript
 */
export type AblyToken = z.infer<typeof AblyTokenSchema>;
export type CurrentChargingSession = z.infer<
  typeof CurrentChargingSessionSchema
>;
export type CurrentSessionWithTokenResponse = z.infer<
  typeof CurrentSessionWithTokenResponseSchema
>;
