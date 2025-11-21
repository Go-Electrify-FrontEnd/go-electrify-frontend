import "server-only";

import { getUser, refreshAccessToken } from "./auth-server";
import { hasRoles } from "./role-check";
import type { User } from "@/features/users/schemas/user.types";

/**
 * Get authenticated user for API routes with automatic token refresh
 *
 * This helper is designed for API route handlers in Next.js 16.
 * Since the proxy function runs before route handlers but doesn't modify
 * the request cookies (only the response), API routes need to handle
 * token refresh internally.
 *
 * @returns User object if authenticated, null otherwise
 *
 * @example
 * ```typescript
 * export async function POST(req: Request) {
 *   const user = await getAuthenticatedUser();
 *   if (!user) {
 *     return new Response("Unauthorized", { status: 401 });
 *   }
 *   // ... rest of your API logic
 * }
 * ```
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  // Try to get user from current access token
  let { user } = await getUser();

  // If no user (expired/missing/invalid token), attempt refresh
  if (!user) {
    const refreshResult = await refreshAccessToken();

    if (refreshResult.success) {
      // Token refreshed successfully, get user again
      const result = await getUser();
      user = result.user;
    }
  }

  return user;
}

/**
 * Get authenticated user with role check for API routes
 *
 * @param allowedRoles - Array of allowed roles (e.g., ["admin", "staff"])
 * @returns User object if authenticated and authorized, null otherwise
 *
 * @example
 * ```typescript
 * export async function POST(req: Request) {
 *   const user = await getAuthenticatedUserWithRole(["admin"]);
 *   if (!user) {
 *     return new Response("Forbidden", { status: 403 });
 *   }
 *   // ... rest of your API logic
 * }
 * ```
 */
export async function getAuthenticatedUserWithRole(
  allowedRoles: string[],
): Promise<User | null> {
  const user = await getAuthenticatedUser();

  if (!hasRoles(user, allowedRoles)) {
    return null;
  }

  return user;
}
