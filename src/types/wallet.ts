import * as z from "zod";

export const WalletSchema = z.object({
  walletId: z.number(),
  balance: z.number().min(0, "Balance cannot be negative"),
});

export type Wallet = z.infer<typeof WalletSchema>;

export const TransactionSchema = z.object({
  Id: z.number(),
  WalletId: z.number(),
  ChargingSessionId: z.number().nullable(),
  Amount: z.number(),
  Type: z.enum(["DEPOSIT", "WITHDRAW", "CHARGE", "REFUND"]),
  Status: z.enum(["SUCCEEDED", "PENDING", "FAILED"]),
  Note: z.string().nullable(),
  CreatedAt: z.string(),
});

export const TransactionListSchema = z.object({
  walletId: z.number(),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  data: z.array(TransactionSchema),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionList = z.infer<typeof TransactionListSchema>;
