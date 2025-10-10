"use server";

import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function handleLogin(prevState: any, data: FormData) {
  const email = data.get("email")?.toString();

  if (!email) {
    return { success: false, msg: "Email là bắt buộc" };
  }

  //const url = getBackendUrl("auth/register-email");

  const url = "https://api.go-electrify.com/api/v1/auth/request-otp";
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
    msg: success ? "Đã gửi mã OTP đến email" : "Gửi mã OTP thất bại",
  };
}

interface VerifyOTPResponse {
  AccessToken: string;
  RefreshToken: string;
  AccessExpires: string;
  RefreshExpires: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function handleVerifyOTP(prevState: any, data: FormData) {
  const locale = await getLocale();
  const email = data.get("email")?.toString();
  const code = data.get("code")?.toString();

  if (!email || !code) {
    return { success: false, msg: "Email và mã OTP là bắt buộc" };
  }

  const cookieStore = await cookies();
  if (cookieStore.get("accessToken") && cookieStore.get("refreshToken")) {
    return { success: true, msg: "Đã đăng nhập" };
  }

  const url = "https://api.go-electrify.com/api/v1/auth/verify-otp";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Email: email, Otp: code }),
  });

  const success = response.ok;
  if (!success) {
    return {
      success: false,
      msg: "OTP hoặc email không hợp lệ",
      user: null,
      tokens: null,
    };
  }

  const responseJson: VerifyOTPResponse = await response.json();
  if (responseJson.AccessToken) {
    cookieStore.set({
      name: "accessToken",
      value: responseJson.AccessToken,
      httpOnly: true,
      expires: new Date(responseJson.AccessExpires),
      maxAge: 60 * 15,
    });

    cookieStore.set({
      name: "refreshToken",
      value: responseJson.RefreshToken,
      httpOnly: true,
      expires: new Date(responseJson.RefreshExpires),
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  redirect({ href: "/dashboard", locale });
}
