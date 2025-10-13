import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/utils";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export async function GET() {
  const cookieStore = await cookies();
  const locale = await getLocale();

  // Call the backend to invalidate the refresh token
  await fetch(getBackendUrl("auth/logout"), {
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

  redirect({ href: "/login", locale });
}
