"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function handleLogin(prevState: unknown, data: FormData) {
  const t = {
    "requestOtpMessages.emailRequired": "Email là bắt buộc",
    "requestOtpMessages.success": "Mã OTP đã được gửi đến email của bạn",
    "requestOtpMessages.failure": "Không thể gửi OTP. Vui lòng thử lại",
    "requestOtpMessages.networkError": "Lỗi kết nối. Vui lòng thử lại",
  };
  const email = data.get("email")?.toString();

  if (!email) {
    return { success: false, msg: t["requestOtpMessages.emailRequired"] };
  }

  const url = "https://api.go-electrify.com/api/v1/auth/request-otp";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Email: email }),
    });

    const success = response.ok;
    return {
      success,
      msg: success
        ? t["requestOtpMessages.success"]
        : t["requestOtpMessages.failure"],
    };
  } catch (error) {
    console.error("handleLogin error", error);
    return {
      success: false,
      msg: t["requestOtpMessages.networkError"],
    };
  }
}

interface VerifyOTPResponse {
  AccessToken: string;
  RefreshToken: string;
  AccessExpires: string;
  RefreshExpires: string;
}

export async function handleVerifyOTP(prevState: unknown, data: FormData) {
  const t = {
    "verifyOtpMessages.emailOtpRequired": "Email và mã OTP là bắt buộc",
    "verifyOtpMessages.alreadyAuthenticated": "Bạn đã đăng nhập",
    "verifyOtpMessages.invalid": "Mã OTP không hợp lệ hoặc đã hết hạn",
    "verifyOtpMessages.networkError": "Lỗi kết nối. Vui lòng thử lại",
  };

  const email = data.get("email")?.toString();
  const code = data.get("code")?.toString();

  if (!email || !code) {
    return { success: false, msg: t["verifyOtpMessages.emailOtpRequired"] };
  }

  const cookieStore = await cookies();
  if (cookieStore.get("accessToken") && cookieStore.get("refreshToken")) {
    return { success: true, msg: t["verifyOtpMessages.alreadyAuthenticated"] };
  }

  const url = "https://api.go-electrify.com/api/v1/auth/verify-otp";
  let shouldRedirect = false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Email: email, Otp: code }),
    });

    if (!response.ok) {
      return {
        success: false,
        msg: t["verifyOtpMessages.invalid"],
        user: null,
        tokens: null,
      };
    }

    const parsed = (await response.json()) as VerifyOTPResponse;

    // Validate response payload
    if (!parsed?.AccessToken || !parsed?.RefreshToken) {
      return {
        success: false,
        msg: t["verifyOtpMessages.invalid"],
        user: null,
        tokens: null,
      };
    }

    // Set cookies
    cookieStore.set({
      name: "accessToken",
      value: parsed.AccessToken,
      httpOnly: true,
      expires: new Date(parsed.AccessExpires),
      maxAge: 60 * 15,
    });

    cookieStore.set({
      name: "refreshToken",
      value: parsed.RefreshToken,
      httpOnly: true,
      expires: new Date(parsed.RefreshExpires),
      maxAge: 60 * 60 * 24 * 30,
    });

    // Mark for redirect
    shouldRedirect = true;
  } catch (error) {
    console.error("handleVerifyOTP network/parsing error", error);
    return {
      success: false,
      msg: t["verifyOtpMessages.networkError"],
      user: null,
      tokens: null,
    };
  } finally {
    // Perform redirect in finally block to ensure it's never caught
    if (shouldRedirect) {
      redirect("/dashboard");
    }
  }

  return { success: true, msg: "" };
}
