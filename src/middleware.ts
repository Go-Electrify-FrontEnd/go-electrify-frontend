import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { handleAuthRefresh } from "./lib/auth/auth-middleware";
import { getUserFromToken } from "./lib/auth/auth-server";

const PUBLIC_PATHS = new Set(["/"]);

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  const response = await handleAuthRefresh(request);

  const finalAccessToken =
    response.cookies.get("accessToken")?.value ??
    request.cookies.get("accessToken")?.value;

  const { user } = await getUserFromToken(finalAccessToken ?? "");

  if (pathname === "/login") {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return response;
  }

  if (!user) {
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
