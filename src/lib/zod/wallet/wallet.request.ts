import { z } from "zod";

export const walletTopupSchema = z.object({
  amount: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v), { message: "Số tiền không hợp lệ" })
    .min(10000, "Số tiền phải lớn hơn 10000"),
});

export type WalletTopupFormData = z.infer<typeof walletTopupSchema>;
