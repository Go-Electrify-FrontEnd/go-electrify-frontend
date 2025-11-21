import type { User, UserApi } from "@/features/users/schemas/user.types";

/**
 * Type that represents any object with a role property
 */
type RoleHolder = { role: string };

/**
 * Check if a user has a specific role
 *
 * @param user - User object (can be null/undefined)
 * @param role - Role to check (case-insensitive)
 * @returns true if user has the specified role, false otherwise
 *
 * @example
 * ```typescript
 * const { user } = await getUser();
 * if (hasRole(user, "admin")) {
 *   // User is admin
 * }
 * ```
 */
export function hasRole(
  user: User | UserApi | RoleHolder | null | undefined,
  role: string,
): boolean {
  if (!user) {
    return false;
  }

  const normalizedUserRole = user.role.toLowerCase();
  const normalizedRole = role.toLowerCase();

  return normalizedUserRole === normalizedRole;
}

/**
 * Check if a user has any of the specified roles
 *
 * @param user - User object (can be null/undefined)
 * @param roles - Array of roles to check (case-insensitive)
 * @returns true if user has any of the specified roles, false otherwise
 *
 * @example
 * ```typescript
 * const { user } = await getUser();
 * if (hasRoles(user, ["admin", "staff"])) {
 *   // User is either admin or staff
 * }
 * ```
 */
export function hasRoles(
  user: User | UserApi | RoleHolder | null | undefined,
  roles: string[],
): boolean {
  if (!user) {
    return false;
  }

  const normalizedUserRole = user.role.toLowerCase();
  const normalizedRoles = roles.map((role) => role.toLowerCase());

  return normalizedRoles.includes(normalizedUserRole);
}
