import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { handleAuthRefresh } from "./lib/auth/auth-middleware";
import { getUserFromToken } from "./lib/auth/auth-server";

const PUBLIC_PATHS = new Set(["/"]);

export async function middleware(request: NextRequest) {
  const response = await handleAuthRefresh(request);

  const finalAccessToken =
    response.cookies.get("accessToken")?.value ??
    request.cookies.get("accessToken")?.value;

  const { user } = await getUserFromToken(finalAccessToken ?? "");

  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return response;
  }

  if (pathname === "/login") {
    if (user) {
      // Some test environments provide a minimal mock for request.nextUrl
      // (e.g. { pathname }) which doesn't implement clone(). Be defensive
      // and fall back to constructing a new URL when clone isn't available.
      const nextUrlAny = request.nextUrl as unknown as { clone?: () => URL };
      const url =
        typeof nextUrlAny.clone === "function"
          ? nextUrlAny.clone()
          : new URL(request.url);
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
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
