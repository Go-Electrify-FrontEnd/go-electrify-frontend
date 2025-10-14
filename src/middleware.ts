import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { handleAuthRefresh } from "./lib/auth/auth-middleware";

const PUBLIC_PATHS = new Set(["/", "/login"]);

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // Always attempt token refresh so authenticated users keep fresh tokens even on public pages
  const response = await handleAuthRefresh(request);

  const refreshedAccessToken = response.cookies.get("accessToken")?.value;
  const existingAccessToken = request.cookies.get("accessToken")?.value;
  const hasAccessToken = Boolean(refreshedAccessToken ?? existingAccessToken);

  if (PUBLIC_PATHS.has(pathname)) {
    return response;
  }

  if (!hasAccessToken) {
    const loginUrl = new URL("/login", request.url);

    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.delete("accessToken");
    redirectResponse.cookies.delete("refreshToken");
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
