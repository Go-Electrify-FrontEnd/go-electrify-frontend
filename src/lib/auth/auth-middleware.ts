import { NextResponse, type NextRequest } from "next/server";
import { getUserFromToken, performTokenRefresh } from "./auth-server";

export async function handleAuthRefresh(request: NextRequest) {
  const response = NextResponse.next({ request });

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (accessToken) {
    const { user } = await getUserFromToken(accessToken);
    if (user) return response;
  }

  if (!refreshToken) {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  const result = await performTokenRefresh(refreshToken, (tokens) => {
    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: tokens.accessMaxAge,
    });
    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: tokens.refreshMaxAge,
    });
  });

  if (!result.success) {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
  }

  return response;
}
