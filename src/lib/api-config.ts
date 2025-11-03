/**
 * Centralized API configuration
 */
export const API_BASE_URL = process.env.BACKEND_URL || "https://api.go-electrify.com/api/v1";

/**
 * Base API URL without version (for special endpoints like auth/logout)
 */
const API_BASE = API_BASE_URL.replace('/api/v1', '/api');

/**
 * Auth logout URL (uses /api/auth instead of /api/v1)
 */
export const API_AUTH_LOGOUT_URL = `${API_BASE}/auth/logout`;

/**
 * Payment order URL base (uses /api/payment instead of /api/v1)
 */
export const API_PAYMENT_ORDER_URL = `${API_BASE}/payment/order`;

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
