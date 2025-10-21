"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUser, refreshAccessToken, refreshTokenSchema } from "@/lib/auth/auth-server";

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
    return { success: false, msg: "Email và mã OTP là bắt buộc", user: null, tokens: null };
  }

  const url = "https://api.go-electrify.com/api/v1/auth/verify-otp";
  const cookieStore = await cookies();
  let shouldRedirect = false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Otp: code }),
    });

    if (!response.ok) {
      return { success: false, msg: "Mã OTP không hợp lệ hoặc đã hết hạn", user: null, tokens: null };
    }

    const parsed = await response.json();
    const { success, data, error } = refreshTokenSchema.safeParse(parsed);
    if (!success) {
      return { success: false, msg: "Lỗi xác thực OTP. Vui lòng thử lại", user: null, tokens: null };
    }

    cookieStore.set({ name: "accessToken", value: parsed.AccessToken, httpOnly: process.env.NODE_ENV === "production", expires: data.accessExpires });
    cookieStore.set({ name: "refreshToken", value: parsed.RefreshToken, httpOnly: process.env.NODE_ENV === "production", expires: data.refreshExpires });

    shouldRedirect = true;
  } catch (error) {
    console.error("handleVerifyOTP network/parsing error", error);
    return { success: false, msg: "Lỗi xác thực OTP. Vui lòng thử lại", user: null, tokens: null };
  } finally {
    if (shouldRedirect) {
      redirect("/dashboard");
    }
  }

  return { success: true, msg: "" };
}

export async function refreshTokens() {
  await refreshAccessToken();
}
