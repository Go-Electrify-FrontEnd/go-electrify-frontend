"use server";

import { updateUserRole } from "@/features/users/api/users-api";

/**
 * Server Action đổi vai trò người dùng.
 * Dùng trong client component (user-actions.tsx)
 */
export async function changeUserRoleAction(
  userId: number,
  newRole: string,
  forceSignOut = true,
) {
  return updateUserRole(userId, newRole, forceSignOut);
}
