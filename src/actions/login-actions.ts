"use server";

import { redirect } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export async function handleLogin(prevState: unknown, data: FormData) {
  const t = await getTranslations("auth");
  const email = data.get("email")?.toString();

  if (!email) {
    return { success: false, msg: t("requestOtpMessages.emailRequired") };
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
        ? t("requestOtpMessages.success")
        : t("requestOtpMessages.failure"),
    };
  } catch (error) {
    console.error("handleLogin error", error);
    return {
      success: false,
      msg: t("requestOtpMessages.networkError"),
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
  const t = await getTranslations("auth");
  const locale = await getLocale();
  const email = data.get("email")?.toString();
  const code = data.get("code")?.toString();

  if (!email || !code) {
    return { success: false, msg: t("verifyOtpMessages.emailOtpRequired") };
  }

  const cookieStore = await cookies();
  if (cookieStore.get("accessToken") && cookieStore.get("refreshToken")) {
    return { success: true, msg: t("verifyOtpMessages.alreadyAuthenticated") };
  }

  const url = "https://api.go-electrify.com/api/v1/auth/verify-otp";
  try {
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
        msg: t("verifyOtpMessages.invalid"),
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
  } catch (error) {
    console.error("handleVerifyOTP error", error);
    return {
      success: false,
      msg: t("verifyOtpMessages.networkError"),
      user: null,
      tokens: null,
    };
  }
}
