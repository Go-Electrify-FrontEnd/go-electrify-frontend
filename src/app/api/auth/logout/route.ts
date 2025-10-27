import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();

  // Call the backend to invalidate the refresh token
  await fetch("https://api.go-electrify.com/api/auth/logout", {
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
