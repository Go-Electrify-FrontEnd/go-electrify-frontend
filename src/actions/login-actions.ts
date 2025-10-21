"use server";

import {
  handleLogin as _handleLogin,
  handleVerifyOTP as _handleVerifyOTP,
  requestOtp as _requestOtp,
  refreshTokens as _refreshTokens,
} from "@/features/auth/services/auth";

export async function handleLogin(prevState: unknown, data: FormData) {
  return await _handleLogin(prevState, data);
}

export async function handleVerifyOTP(prevState: unknown, data: FormData) {
  return await _handleVerifyOTP(prevState, data);
}

export async function requestOtp(email: string) {
  return await _requestOtp(email);
}

export async function refreshTokens() {
  return await _refreshTokens();
}
