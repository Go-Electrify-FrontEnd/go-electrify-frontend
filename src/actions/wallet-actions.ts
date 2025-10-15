"use server";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { walletTopupSchema } from "@/lib/zod/wallet/wallet.request";
import { TopupResponseApiSchema } from "@/lib/zod/wallet/wallet.schema";
import type { TopupResponse } from "@/lib/zod/wallet/wallet.types";

/**
 * Create a top-up intent with the backend and redirect the user to the
 * provided CheckoutUrl. This follows the same try/catch/finally redirect
 * pattern as other server actions in the repo so redirects are never
 * accidentally swallowed by error handling.
 */
export async function handleCreateTopup(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();

  if (!user || !token) {
    forbidden();
  }

  // Validate incoming form data (amount)
  const { success, data, error } = walletTopupSchema.safeParse({
    amount: String(formData.get("amount") ?? ""),
  });

  if (!success) {
    return { success: false, msg: "Giá trị truyền vào không hợp lệ." };
  }

  const url = "https://api.go-electrify.com/api/v1/wallet/me/topup";

  // Build payload using environment variables for URLs (must be set by deployer)
  const returnUrl = process.env.RETURN_URL;
  const cancelUrl = process.env.CANCEL_URL;

  if (!returnUrl || !cancelUrl) {
    return {
      success: false,
      msg: "Missing RETURN_URL or CANCEL_URL environment variables",
    };
  }

  let response: Response | undefined;
  let checkoutUrl: string | undefined;
  let parsedResponse: TopupResponse | undefined;
  let shouldRedirect = false;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Amount: data.amount,
        ReturnUrl: returnUrl,
        CancelUrl: cancelUrl,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        msg: "Không thể tạo yêu cầu nạp tiền",
      };
    }

    const body = await response.json();

    // Validate and transform the response using Zod. This ensures callers
    // always receive a well-formed object with the expected fields.
    const parsed = TopupResponseApiSchema.safeParse(body);
    if (!parsed.success) {
      // Parsing failed - surface a helpful message if available.
      return {
        success: false,
        msg:
          parsed.error.issues.map((i) => i.message).join("; ") ||
          "Phản hồi không hợp lệ từ máy chủ",
      };
    }

    parsedResponse = parsed.data;
    checkoutUrl = parsedResponse.checkoutUrl;

    if (!checkoutUrl) {
      return { success: false, msg: "Thiếu CheckoutUrl từ máy chủ" };
    }

    shouldRedirect = true;
  } catch (err: unknown) {
    console.error("handleCreateTopup network/parsing error", err);
    return { success: false, msg: "Lỗi mạng hoặc máy chủ." };
  } finally {
    if (shouldRedirect && checkoutUrl) {
      redirect(checkoutUrl);
    }
  }

  // Return the parsed response in successful non-redirect flows so the
  // caller can inspect the created topup intent. In redirect flows the
  // browser will be navigated away before this value is observed.
  return {
    success: true,
    msg: "Đã tạo yêu cầu nạp tiền",
    data: parsedResponse,
  };
}
