"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function handleLogin(prevState: any, data: FormData) {
  const email = data.get("email")?.toString();

  if (!email) {
    return { success: false, msg: "Email is required" };
  }

  //const url = getBackendUrl("auth/register-email");

  const url = "https://9a575a72a9f9.ngrok-free.app/api/v1/auth/request-otp";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Email: email }),
  });

  const success = response.ok;

  return { success, msg: success ? "OTP sent to email" : "Failed to send OTP" };
}

interface VerifyOTPResponse {
  AccessToken: string;
  RefreshToken: string;
  AccessExpires: string;
  RefreshExpires: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function handleVerifyOTP(prevState: any, data: FormData) {
  const email = data.get("email")?.toString();
  const code = data.get("code")?.toString();

  if (!email || !code) {
    return { success: false, msg: "Email and code are required" };
  }

  const cookieStore = await cookies();

  if (cookieStore.get("accessToken") && cookieStore.get("refreshToken")) {
    return { success: true, msg: "Already logged in" };
  }

  const url = getBackendUrl(
    "https://9a575a72a9f9.ngrok-free.app/api/v1/auth/verify-otp",
  );

  console.log("URL: " + url);

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
      msg: "Invalid OTP or email",
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

  return {
    success,
    msg: "OTP verified, logged in",
  };
}
