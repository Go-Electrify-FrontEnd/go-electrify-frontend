import { type NextRequest } from "next/server";
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
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
