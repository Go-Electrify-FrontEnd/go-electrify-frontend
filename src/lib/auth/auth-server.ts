import "server-only";

import { cookies } from "next/headers";
import type { User } from "@/features/users/schemas/user.types";
import * as jose from "jose";
import * as z from "zod";
import { API_BASE_URL } from "@/lib/api-config";

const DEFAULT_ACCESS_MAX_AGE = 60 * 15; // 15 minutes
const DEFAULT_REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const secret = new TextEncoder().encode(process.env.AUTH_SECRET_KEY);

export const refreshTokenSchema = z
  .object({
    AccessToken: z.string(),
    RefreshToken: z.string(),
    AccessExpires: z.coerce
      .date<Date>()
      .default(() => new Date(Date.now() + DEFAULT_ACCESS_MAX_AGE * 1000)),
    RefreshExpires: z.coerce
      .date<Date>()
      .default(() => new Date(Date.now() + DEFAULT_REFRESH_MAX_AGE * 1000)),
  })
  .transform((raw) => ({
    refreshToken: raw.RefreshToken,
    accessToken: raw.AccessToken,
    accessExpires: raw.AccessExpires,
    refreshExpires: raw.RefreshExpires,
  }));

export async function performTokenRefresh(
  refreshToken: string,
  updateCookies: (token: {
    accessToken: string;
    refreshToken: string;
    accessExpires: Date;
    refreshExpires: Date;
  }) => void,
) {
  try {
    const url = `${API_BASE_URL}/auth/refreshToken`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        RefreshToken: refreshToken,
      }),
    });

    if (!response.ok) {
      return { success: false };
    }

    const responseJson = await response.json();
    const { success, data } = refreshTokenSchema.safeParse(responseJson);

    if (success) {
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessExpires,
        refreshExpires,
      } = data;

      updateCookies({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessExpires,
        refreshExpires,
      });
    }

    return { success };
  } catch {
    return { success: false };
  }
}

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken");

    if (!accessTokenCookie || !accessTokenCookie.value) {
      console.log("No access token cookie found");
      return { user: null, token: null };
    }

    let user: User | null = null;
    if (accessTokenCookie.value) {
      user = (await getUserFromToken(accessTokenCookie.value)).user;
    }

    return { user, token: accessTokenCookie.value };
  } catch (error) {
    console.error("Error in getUser:", error);
    return { user: null, token: null };
  }
}

export async function getUserFromToken(accessToken: string) {
  if (!accessToken) {
    return { user: null };
  }
  try {
    const { payload } = await jose.jwtVerify<User>(accessToken, secret, {
      clockTolerance: "5s",
    });

    if (payload) {
      const user: User = {
        uid: payload.uid,
        email: payload.email,
        role: payload.role,
        name: payload.name,
        avatar: payload.avatar,
      };
      return { user };
    }
  } catch {
    // jwt verify error
  }

  return { user: null };
}

export async function refreshAccessToken() {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");

    if (!refreshTokenCookie || !refreshTokenCookie.value) {
      return { success: false, msg: "Không tìm thấy refresh token" };
    }

    const result = await performTokenRefresh(
      refreshTokenCookie.value,
      (tokens) => {
        cookieStore.set({
          name: "accessToken",
          value: tokens.accessToken,
          httpOnly: process.env.NODE_ENV === "production",
          expires: tokens.accessExpires,
        });

        cookieStore.set({
          name: "refreshToken",
          value: tokens.refreshToken,
          httpOnly: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30,
        });
      },
    );

    if (result.success) {
      return { success: true, msg: "" };
    } else {
      return { success: false, msg: "Làm mới token không thành công" };
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { success: false, msg: "Lỗi máy chủ" };
  }
}
