"use server";

import { cookies } from "next/headers";

interface LoginActionResponse {
  success: boolean;
  msg: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function handleLogin(prevState: any, data: FormData) {
  const email = data.get("email")?.toString();

  if (!email) {
    return { success: false, msg: "Email is required" };
  }

  const url = new URL(process.env.BACKEND_URL + "auth/login");
  if (process.env.NODE_ENV === "development") {
    url.searchParams.append("teamId", process.env.TEST_TEAM_ID || "");
  }

  console.log("URL: " + url.toString());

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const responseJson: LoginActionResponse = await response.json();

  return { success: responseJson.success, msg: responseJson.msg };
}

interface VerifyOTPResponse {
  accessToken: string;
  refreshToken: string;
  success: boolean;
  msg: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function handleVerifyOTP(prevState: any, data: FormData) {
  const email = data.get("email")?.toString();
  const otp = data.get("otp")?.toString();

  if (!email || !otp) {
    return { success: false, msg: "Email and OTP are required" };
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
    body: JSON.stringify({ email, otp }),
  });

  const responseJson: VerifyOTPResponse = await response.json();
  if (responseJson.success) {
    cookieStore.set({
      name: "accessToken",
      value: responseJson.accessToken,
      httpOnly: true,
    });

    cookieStore.set({
      name: "refreshToken",
      value: responseJson.refreshToken,
      httpOnly: true,
    });
  }

  return { success: responseJson.success, msg: responseJson.msg };
}
