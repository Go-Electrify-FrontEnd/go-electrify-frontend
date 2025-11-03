"use server";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { walletTopupSchema } from "../schemas/wallet.request";
import { TopupResponseApiSchema } from "../schemas/wallet.schema";
import { API_BASE_URL } from "@/lib/api-config";

export async function handleCreateTopup(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();

  if (!user || !token) {
    forbidden();
  }

  const { success, data, error } = walletTopupSchema.safeParse({
    amount: String(formData.get("amount") ?? ""),
  });

  if (!success) {
    return { success: false, msg: "Giá trị truyền vào không hợp lệ." };
  }

  const url = `${API_BASE_URL}/wallet/me/topup`;
  const returnUrl = process.env.RETURN_URL;
  const cancelUrl = process.env.CANCEL_URL;

  if (!returnUrl || !cancelUrl) {
    return {
      success: false,
      msg: "Missing RETURN_URL or CANCEL_URL environment variables",
    };
  }

  let response;
  let checkoutUrl;
  let parsedResponse;
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
      return { success: false, msg: "Không thể tạo yêu cầu nạp tiền" };
    }

    const body = await response.json();
    const parsed = TopupResponseApiSchema.safeParse(body);
    if (!parsed.success) {
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
  } catch (err) {
    console.error("handleCreateTopup network/parsing error", err);
    return { success: false, msg: "Lỗi mạng hoặc máy chủ." };
  } finally {
    if (shouldRedirect && checkoutUrl) {
      redirect(checkoutUrl);
    }
  }

  return {
    success: true,
    msg: "Đã tạo yêu cầu nạp tiền",
    data: parsedResponse,
  };
}
