import { NextResponse, type NextRequest } from "next/server";
import * as jose from "jose";

type RefreshApiResponse = {
  AccessToken?: string;
  RefreshToken?: string;
  AccessExpires?: string;
  RefreshExpires?: string;
};

const FALLBACK_ACCESS_MAX_AGE = 60 * 15; // 15 minutes
const FALLBACK_REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function parseExpiry(expiry?: string | null): number | null {
  if (!expiry) return null;
  const expiryDate = new Date(expiry);
  if (Number.isNaN(expiryDate.getTime())) return null;
  const seconds = Math.floor((expiryDate.getTime() - Date.now()) / 1000);
  return seconds > 0 ? seconds : null;
}

function extractTokens(data: RefreshApiResponse) {
  const accessToken = data.AccessToken ?? null;
  const refreshToken = data.RefreshToken ?? null;
  const accessMaxAge =
    parseExpiry(data.AccessExpires ?? null) ?? FALLBACK_ACCESS_MAX_AGE;
  const refreshMaxAge =
    parseExpiry(data.RefreshExpires ?? null) ?? FALLBACK_REFRESH_MAX_AGE;

  return {
    accessToken,
    refreshToken,
    accessMaxAge,
    refreshMaxAge,
  };
}

export async function handleAuthRefresh(request: NextRequest) {
  const response = NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const encoder = new TextEncoder().encode(process.env.AUTH_SECRET_KEY);

  let needRefresh = false;
  if (accessToken) {
    try {
      await jose.jwtVerify(accessToken, encoder, {
        clockTolerance: "5s",
      });
    } catch {
      needRefresh = true;
    }
  } else if (refreshToken) {
    needRefresh = true;
  }

  if (!needRefresh) {
    return response;
  }

  if (!refreshToken) {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  try {
    const url = "https://api.go-electrify.com/api/v1/auth/refreshToken";
    const refreshResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        RefreshToken: refreshToken,
      }),
    });

    if (!refreshResponse.ok) {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    const data: RefreshApiResponse = await refreshResponse.json();
    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessMaxAge,
      refreshMaxAge,
    } = extractTokens(data);

    if (newAccessToken && newRefreshToken) {
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: accessMaxAge,
      });

      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: refreshMaxAge,
      });
    } else {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }

    return response;
  } catch {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}
