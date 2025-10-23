"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  getUser,
  refreshAccessToken,
  refreshTokenSchema,
} from "@/lib/auth/auth-server";

export async function requestOtp(email: string) {
  if (!email) {
    return { success: false, msg: "Email là bắt buộc" };
  }

  const url = "https://api.go-electrify.com/api/v1/auth/request-otp";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email }),
    });

    if (response.ok) {
      return { success: true, msg: "Mã OTP đã được gửi đến email của bạn" };
    }

    return { success: false, msg: "Không thể gửi OTP. Vui lòng thử lại" };
  } catch (error) {
    console.error("requestOtp error", error);
    return { success: false, msg: "Lỗi kết nối. Vui lòng thử lại" };
  }
}

export async function handleLogin(prevState: unknown, data: FormData) {
  const email = data.get("email")?.toString() ?? "";
  return requestOtp(email);
}

export async function handleVerifyOTP(prevState: unknown, data: FormData) {
  const email = data.get("email")?.toString();
  const code = data.get("code")?.toString();

  if (!email || !code) {
    return {
      success: false,
      msg: "Email và mã OTP là bắt buộc",
      user: null,
      tokens: null,
    };
  }

  const cookieStore = await cookies();
  const existingAccess = cookieStore.get("accessToken");
  const existingRefresh = cookieStore.get("refreshToken");

  if (existingAccess?.value || existingRefresh?.value) {
    // User already has valid tokens, redirect to dashboard
    redirect("/dashboard");
  }

  // Verify OTP with backend
  const url = "https://api.go-electrify.com/api/v1/auth/verify-otp";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Otp: code }),
    });

    if (!response.ok) {
      console.error(
        "OTP verification failed:",
        response.status,
        response.statusText,
      );
      return {
        success: false,
        msg: "Mã OTP không hợp lệ hoặc đã hết hạn",
        user: null,
        tokens: null,
      };
    }

    const responseData = await response.json();
    const parseResult = refreshTokenSchema.safeParse(responseData);

    if (!parseResult.success) {
      console.error("Failed to parse OTP response:", parseResult.error);
      return {
        success: false,
        msg: "Lỗi xác thực OTP. Vui lòng thử lại",
        user: null,
        tokens: null,
      };
    }

    const { accessToken, refreshToken, accessExpires, refreshExpires } =
      parseResult.data;

    // Set authentication cookies
    cookieStore.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: process.env.NODE_ENV === "production",
      expires: accessExpires,
    });

    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: process.env.NODE_ENV === "production",
      expires: refreshExpires,
    });

    redirect("/dashboard");
  } catch (error) {
    console.error("handleVerifyOTP network/parsing error:", error);
    return {
      success: false,
      msg: "Lỗi kết nối. Vui lòng thử lại",
      user: null,
      tokens: null,
    };
  }
}

export async function refreshTokens() {
  await refreshAccessToken();
}
