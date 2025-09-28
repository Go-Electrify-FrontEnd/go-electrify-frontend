"use server";

import { cookies } from "next/headers";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function handleLogin(prevState: any, data: FormData) {
  const email = data.get("email")?.toString();

  if (!email) {
    return { success: false, msg: "Email is required" };
  }

  const url = new URL(process.env.BACKEND_URL + "auth/register-email");
  if (process.env.NODE_ENV === "development") {
    url.searchParams.append("teamId", process.env.TEST_TEAM_ID || "");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const success = response.ok;

  return { success, msg: success ? "OTP sent to email" : "Failed to send OTP" };
}

interface VerifyOTPResponse {
  tokens: {
    accessToken: string;
    accessExpires: string;
    refreshToken: string;
    refreshExpires: string;
  };
  user: {
    id: number;
    email: string;
    fullName?: string;
    role: string;
  };
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

  const url = new URL(process.env.BACKEND_URL + "auth/verify-otp");
  if (process.env.NODE_ENV === "development") {
    url.searchParams.append("teamId", process.env.TEST_TEAM_ID || "");
  }

  console.log("URL: " + url.toString());

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
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
  if (responseJson.tokens) {
    cookieStore.set({
      name: "accessToken",
      value: responseJson.tokens.accessToken,
      httpOnly: true,
      expires: new Date(responseJson.tokens.accessExpires),
      maxAge: 60 * 15,
    });

    cookieStore.set({
      name: "refreshToken",
      value: responseJson.tokens.refreshToken,
      httpOnly: true,
      expires: new Date(responseJson.tokens.refreshExpires),
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return {
    success,
    msg: "OTP verified, logged in",
  };
}
