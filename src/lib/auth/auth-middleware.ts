import { NextResponse, type NextRequest } from "next/server";
import { getUserFromToken, performTokenRefresh } from "./auth-server";

export async function handleAuthRefresh(request: NextRequest) {
  const response = NextResponse.next({ request });

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Check if access token is valid (not expired)
  if (accessToken) {
    const { user } = await getUserFromToken(accessToken);
    if (user) {
      // Token is valid, no refresh needed
      return response;
    }
    // Token exists but is invalid/expired, continue to refresh logic
  }

  // No valid access token, check for refresh token
  if (!refreshToken) {
    // No refresh token available, clear cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // Attempt to refresh the access token
  const result = await performTokenRefresh(refreshToken, (tokens) => {
    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: tokens.accessExpires,
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: tokens.refreshExpires,
    });
  });

  // If refresh failed, clear all auth cookies
  if (!result.success) {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
  }

  return response;
}
