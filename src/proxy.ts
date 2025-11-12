import type { NextRequest } from "next/server";
import { handleAuthRefresh } from "./lib/auth/auth-middleware";

export async function proxy(request: NextRequest) {
  return await handleAuthRefresh(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
