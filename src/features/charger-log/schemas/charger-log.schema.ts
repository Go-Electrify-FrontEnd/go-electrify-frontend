import * as z from "zod";

export const ChargerLogItemSchema = z.object({
  id: z.number(),
  sampleAt: z.string(),
  voltage: z.number().nullable(),
  current: z.number().nullable(),
  powerKw: z.number().nullable(),
  sessionEnergyKwh: z.number(),
  socPercent: z.number(),
  state: z.string(),
  errorCode: z.string().nullable(),
});

export const ChargerLogResponseSchema = z
  .object({
    ok: z.boolean(),
    data: z.object({
      page: z.number(),
      pageSize: z.number(),
      total: z.number(),
      items: z.array(ChargerLogItemSchema),
    }),
  })
  .transform((raw) => ({
    ok: raw.ok,
    data: {
      page: raw.data.page,
      pageSize: raw.data.pageSize,
      total: raw.data.total,
      items: raw.data.items,
    },
  }));

export type ChargerLogItem = z.infer<typeof ChargerLogItemSchema>;
export type ChargerLogResponse = z.infer<typeof ChargerLogResponseSchema>;
