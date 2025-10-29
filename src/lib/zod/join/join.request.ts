import { z } from "zod";

export const joinSchema = z.object({
  joinCode: z.string().min(1, "Mã tham gia là bắt buộc"),
});

export type JoinFormData = z.infer<typeof joinSchema>;
