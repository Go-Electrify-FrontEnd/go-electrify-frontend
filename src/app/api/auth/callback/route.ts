import { performTokenRefresh } from "@/lib/auth/auth-server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const refreshToken = searchParams.get("refreshToken");

  if (!refreshToken) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 400 },
    );
  }

  let next = searchParams.get("next") || "/dashboard";
  const cookieStore = await cookies();
  const { success } = await performTokenRefresh(refreshToken, (result) => {
    const { accessToken, refreshToken, accessExpires, refreshExpires } = result;

    cookieStore.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: accessExpires,
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: refreshExpires,
      sameSite: "lax",
      path: "/",
    });
  });

  if (!success) {
    next = "/login";
  }

  return NextResponse.redirect(`${origin}${next}`);
}
