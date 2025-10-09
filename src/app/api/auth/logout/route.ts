import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/utils";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  const response = await fetch(getBackendUrl("auth/logout"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: cookieStore.get("refreshToken")?.value,
    }),
  });

  console.log("Logout response status: " + (await response.text()));

  if (cookieStore.has("accessToken")) {
    cookieStore.delete("accessToken");
  }

  if (cookieStore.has("refreshToken")) {
    cookieStore.delete("refreshToken");
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
