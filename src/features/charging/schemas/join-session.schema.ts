import { z } from "zod";

const isoDateStringSchema = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date string",
  });

const JoinSessionDataSchema = z.object({
  sessionId: z.coerce.number().int().positive(),
  channelId: z.string().min(1),
  ablyToken: z.string().min(1),
  expiresAt: isoDateStringSchema,
});

const JoinSessionSuccessSchema = z.object({
  ok: z.literal(true),
  data: JoinSessionDataSchema,
});

const JoinSessionErrorSchema = z.object({
  ok: z.literal(false),
  message: z.string().optional(),
  error: z.string().optional(),
});

export const JoinSessionResponseSchema = z.union([
  JoinSessionSuccessSchema,
  JoinSessionErrorSchema,
]);

export type JoinSessionData = z.infer<typeof JoinSessionDataSchema>;
export type JoinSessionSuccessResponse = z.infer<
  typeof JoinSessionSuccessSchema
>;
export type JoinSessionResponse = z.infer<typeof JoinSessionResponseSchema>;
