import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.has("accessToken")) {
    cookieStore.delete("accessToken");
  }

  if (cookieStore.has("refreshToken")) {
    cookieStore.delete("refreshToken");
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
