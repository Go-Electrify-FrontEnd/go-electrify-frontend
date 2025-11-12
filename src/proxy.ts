import { NextResponse, type NextRequest } from "next/server";
import { handleAuthRefresh } from "./lib/auth/auth-middleware";

/**
 * Next.js 16 Proxy Function
 * Replaces the deprecated middleware pattern
 * Handles authentication token refresh for all routes
 */
export async function proxy(request: NextRequest) {
  return await handleAuthRefresh(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static files (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
