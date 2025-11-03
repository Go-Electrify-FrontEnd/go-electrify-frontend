import { z } from "zod";

// Payment method enum - MUST match API (case-sensitive)
export const paymentMethodSchema = z.enum(["WALLET", "SUBSCRIPTION"]);

export const completePaymentSchema = z.object({
  sessionId: z.string().min(1, "Session ID không hợp lệ"),
  method: paymentMethodSchema,
});

export const completePaymentFormSchema = completePaymentSchema.omit({
  sessionId: true,
});

export type CompletePaymentPayload = z.infer<typeof completePaymentSchema>;
export type CompletePaymentFormValues = z.infer<
  typeof completePaymentFormSchema
>;
