/**
 * Centralized API configuration
 */
export const API_BASE_URL = "https://api.go-electrify.com/api/v1";

/**
 * Helper function to create authenticated fetch headers
 * @param token - User authentication token
 * @param additionalHeaders - Additional headers to merge
 * @returns Headers object with Authorization and other headers
 */
export function createAuthHeaders(
  token: string,
  additionalHeaders?: Record<string, string>,
): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    ...additionalHeaders,
  };
}

/**
 * Helper function to create JSON request headers with authentication
 * @param token - User authentication token
 * @returns Headers object with Authorization and Content-Type
 */
export function createJsonAuthHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
