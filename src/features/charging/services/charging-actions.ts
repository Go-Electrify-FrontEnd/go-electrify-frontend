"use server";

import { JoinSessionResponseSchema } from "@/features/charging/schemas/join-session.schema";
import { getUser } from "@/lib/auth/auth-server";
import { completePaymentSchema } from "@/lib/zod/session/complete-payment.request";
import { redirect } from "next/navigation";
import { API_BASE_URL, createJsonAuthHeaders } from "@/lib/api-config";
import { formatNumber } from "@/lib/formatters";

export type CompletePaymentActionState = {
  success: boolean;
  msg: string;
  suggestion: string | null;
  code: string | null;
};

export async function handleJoin(_prev: unknown, formData: FormData) {
  let redirectUrl: string | null = null;

  try {
    const { token } = await getUser();
    const joinCode = formData.get("joinCode") as string;

    if (!token || !joinCode) {
      return {
        success: false,
        msg: "Missing authentication token or join code.",
        data: null,
      };
    }

    const response = await fetch(`${API_BASE_URL}/docks/join`, {
      method: "POST",
      headers: createJsonAuthHeaders(token),
      body: JSON.stringify({
        Code: joinCode,
        Role: "dashboard",
      }),
    });

    const rawJson = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        msg:
          (rawJson && typeof rawJson === "object" && "message" in rawJson
            ? (rawJson as { message?: string }).message
            : undefined) || `Failed to join session (${response.status})`,
        data: null,
      };
    }

    const parsedResponse = JoinSessionResponseSchema.safeParse(rawJson);
    if (!parsedResponse.success) {
      return {
        success: false,
        msg: "Invalid response from server.",
        data: null,
      };
    }

    const parsedData = parsedResponse.data;

    if (!parsedData.ok) {
      return {
        success: false,
        msg:
          parsedData.message || parsedData.error || "Failed to join session.",
        data: null,
      };
    }

    const { sessionId, channelId, ablyToken, expiresAt } = parsedData.data;

    const queryParams = new URLSearchParams({
      sessionId: String(sessionId),
      channelId,
      ablyToken,
      expiresAt,
    });

    redirectUrl = `/dashboard/charging/binding?${queryParams.toString()}`;
  } catch (error) {
    console.error("Join session error:", error);
    return {
      success: false,
      msg: "An unexpected error occurred while joining the session.",
      data: null,
    };
  } finally {
    // Perform redirect if URL was prepared successfully
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }
}

export async function handleBindBooking(_prev: unknown, formData: FormData) {
  let redirectUrl: string | null = null;

  try {
    const { token } = await getUser();
    const bookingCode = formData.get("bookingCode") as string;
    const targetSOC = formData.get("targetSOC") as string;
    const sessionId = formData.get("sessionId") as string;

    if (!token || !bookingCode || !targetSOC || !sessionId) {
      return {
        success: false,
        msg: "Missing required booking information.",
        data: null,
      };
    }

    const targetSOCNumber = Number(targetSOC);
    if (
      isNaN(targetSOCNumber) ||
      targetSOCNumber < 0 ||
      targetSOCNumber > 100
    ) {
      return {
        success: false,
        msg: "Invalid target SOC value. Must be between 0 and 100.",
        data: null,
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/charging-sessions/${sessionId}/bind-booking`,
      {
        method: "POST",
        headers: createJsonAuthHeaders(token),
        body: JSON.stringify({
          bookingCode,
          initialSOC: 20, // Fixed initial SOC as per current implementation
          targetSOC: targetSOCNumber,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        msg: errorData.message || `Failed to bind booking (${response.status})`,
        data: null,
      };
    }

    const { data } = await response.json();

    if (!data?.Id || !data?.BookingId) {
      return {
        success: false,
        msg: "Invalid response from server.",
        data: null,
      };
    }

    // Get the current URL params (ablyToken, channelId, expiresAt) to pass them forward
    // Note: Since this is a server action, we'll need to receive these from the formData
    const ablyToken = formData.get("ablyToken") as string;
    const channelId = formData.get("channelId") as string;
    const expiresAt = formData.get("expiresAt") as string;

    if (ablyToken && channelId && expiresAt) {
      redirectUrl = `/dashboard/charging/binding/progress?sessionId=${sessionId}&ablyToken=${ablyToken}&channelId=${channelId}&expiresAt=${expiresAt}`;
    }

    return {
      success: true,
      msg: "Booking bound successfully!",
      data: {
        Id: data.Id,
        BookingId: data.BookingId,
        vehicleModelId: data.vehicleModelId,
        SocStart: data.SocStart,
        TargetSoc: data.TargetSoc,
      },
    };
  } catch (error) {
    console.error("Bind booking error:", error);
    return {
      success: false,
      msg: "An unexpected error occurred while binding the booking.",
      data: null,
    };
  } finally {
    // Perform redirect if URL was prepared successfully
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }
}

export async function completeSessionPayment(
  _prev: CompletePaymentActionState,
  formData: FormData,
): Promise<CompletePaymentActionState> {
  try {
    console.log("[Payment] Starting payment process...");

    // Validate input
    const parsed = completePaymentSchema.safeParse({
      sessionId: formData.get("sessionId"),
      method: formData.get("method"),
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message;
      console.error("[Payment] Validation failed:", parsed.error);
      return {
        success: false,
        msg: firstError || "Dữ liệu thanh toán không hợp lệ.",
        suggestion: null,
        code: null,
      };
    }

    const { sessionId, method } = parsed.data;
    console.log("[Payment] Session ID:", sessionId, "Method:", method);

    const { token } = await getUser();

    if (!token) {
      console.error("[Payment] Authentication token not found");
      return {
        success: false,
        msg: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        suggestion: null,
        code: null,
      };
    }

    // Call API - Method must be case-sensitive (WALLET or SUBSCRIPTION)
    console.log(
      "[Payment] Calling API:",
      `${API_BASE_URL}/charging-sessions/${sessionId}/complete-payment`,
    );
    const response = await fetch(
      `${API_BASE_URL}/charging-sessions/${sessionId}/complete-payment`,
      {
        method: "POST",
        headers: createJsonAuthHeaders(token),
        body: JSON.stringify({
          Method: method, // WALLET or SUBSCRIPTION (case-sensitive)
        }),
        cache: "no-store",
      },
    );

    console.log("[Payment] API response status:", response.status);

    // Parse response
    type ApiErrorResponse = {
      ok: false;
      code: string;
      message: string;
      suggestion?: string;
    };

    type ApiSuccessResponse = {
      ok: true;
      data: {
        Status: string;
        EnergyKwh: number;
        BilledAmount: number;
        PaymentMethod: string;
        CoveredBySubscriptionKwh?: number;
        Transactions?: Array<{ Type: string; Status: string }>;
      };
    };

    type ApiResponse = ApiErrorResponse | ApiSuccessResponse | null;

    const rawJson: ApiResponse = await response.json().catch(() => null);

    if (!rawJson) {
      console.error("[Payment] Failed to parse JSON response");
      return {
        success: false,
        msg: `Không thể phân tích phản hồi từ server (${response.status})`,
        suggestion: null,
        code: null,
      };
    }

    console.log("[Payment] Parsed response:", JSON.stringify(rawJson, null, 2));

    // Handle error response
    if (!rawJson.ok) {
      const errorResponse = rawJson as ApiErrorResponse;
      console.error("[Payment] Payment failed:", {
        code: errorResponse.code,
        message: errorResponse.message,
        suggestion: errorResponse.suggestion,
      });
      return {
        success: false,
        msg: errorResponse.message || "Thanh toán không thành công",
        suggestion: errorResponse.suggestion ?? null,
        code: errorResponse.code ?? null,
      };
    }

    // Handle success response
    const successResponse = rawJson as ApiSuccessResponse;
    const { data } = successResponse;

    console.log("[Payment] Payment successful:", {
      status: data.Status,
      energyKwh: data.EnergyKwh,
      billedAmount: data.BilledAmount,
      paymentMethod: data.PaymentMethod,
      coveredBySubscription: data.CoveredBySubscriptionKwh,
    });

    let successMessage = "Thanh toán thành công!";
    if (data.PaymentMethod === "WALLET") {
      successMessage = `Thanh toán thành công ${formatNumber(data.BilledAmount)} VND từ ví điện tử cho ${formatNumber(data.EnergyKwh, 2)} kWh.`;
    } else if (data.PaymentMethod === "SUBSCRIPTION") {
      if (data.CoveredBySubscriptionKwh) {
        successMessage = `Thanh toán thành công bằng gói đăng ký cho ${formatNumber(data.CoveredBySubscriptionKwh, 2)} kWh.`;
      }
    }

    console.log("[Payment] Success message:", successMessage);

    return {
      success: true,
      msg: successMessage,
      suggestion: null,
      code: null,
    };
  } catch (error) {
    console.error("[Payment] Unexpected error:", error);
    return {
      success: false,
      msg: "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.",
      suggestion: null,
      code: null,
    };
  }
}
