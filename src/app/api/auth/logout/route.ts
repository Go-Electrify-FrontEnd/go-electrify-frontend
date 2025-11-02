import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_AUTH_LOGOUT_URL } from "@/lib/api-config";

export async function GET() {
  const cookieStore = await cookies();

  // Call the backend to invalidate the refresh token
  await fetch(API_AUTH_LOGOUT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: cookieStore.get("refreshToken")?.value,
    }),
  });

  if (cookieStore.has("accessToken")) {
    cookieStore.delete("accessToken");
  }

  if (cookieStore.has("refreshToken")) {
    cookieStore.delete("refreshToken");
  }

  redirect("/");
}
