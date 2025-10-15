import * as z from "zod";

export const WalletSchema = z
  .object({
    WalletId: z.number(),
    Balance: z.number().min(0, "Balance cannot be negative"),
  })
  .transform((raw) => ({
    id: raw.WalletId,
    balance: raw.Balance,
  }));

export type Wallet = z.infer<typeof WalletSchema>;

export const TransactionSchema = z
  .object({
    Id: z.number(),
    WalletId: z.number(),
    ChargingSessionId: z.number().nullable(),
    Amount: z.number(),
    Type: z.enum(["DEPOSIT", "WITHDRAW", "CHARGE", "REFUND"]),
    Status: z.enum(["SUCCEEDED", "PENDING", "FAILED"]),
    Note: z.string().nullable(),
    CreatedAt: z.string(),
  })
  .transform((raw) => ({
    id: raw.Id,
    wallet: raw.WalletId,
    chargingSession: raw.ChargingSessionId,
    amount: raw.Amount,
    type: raw.Type,
    status: raw.Status,
    note: raw.Note,
    createdAt: new Date(raw.CreatedAt),
  }));

// API response variant: PascalCase keys with Data array
export const TransactionListApiSchema = z
  .object({
    WalletId: z.number(),
    Total: z.number(),
    Page: z.number(),
    PageSize: z.number(),
    Data: z.array(TransactionSchema),
  })
  .transform((raw) => ({
    walletId: raw.WalletId,
    total: raw.Total,
    page: raw.Page,
    pageSize: raw.PageSize,
    data: raw.Data,
  }));

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionList = z.infer<typeof TransactionListApiSchema>;

// Top-up API response schema (accepts PascalCase from API and maps to camelCase)
export const TopupResponseApiSchema = z
  .object({
    Message: z.string().optional(),
    TopupIntentId: z.number().optional(),
    OrderCode: z.union([z.number(), z.string()]).optional(),
    CheckoutUrl: z.string().url().optional(),
    // Accept camelCase variants as well
    message: z.string().optional(),
    topupIntentId: z.number().optional(),
    orderCode: z.union([z.number(), z.string()]).optional(),
    checkoutUrl: z.string().url().optional(),
  })
  .transform((raw) => ({
    message: raw.Message ?? raw.message,
    topupIntentId: raw.TopupIntentId ?? raw.topupIntentId,
    orderCode: raw.OrderCode ?? raw.orderCode,
    checkoutUrl: raw.CheckoutUrl ?? raw.checkoutUrl,
  }));

export type TopupResponse = z.infer<typeof TopupResponseApiSchema>;
