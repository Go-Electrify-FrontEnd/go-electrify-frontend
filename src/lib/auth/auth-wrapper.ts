// lib/auth/auth-wrapper.ts
// Wrapper để handle JWT errors gracefully
import { getUser as originalGetUser } from "@/lib/auth/auth-server";

export async function getUserSafe() {
  try {
    const result = await originalGetUser();
    return result;
  } catch (error) {
    // Handle JWT verification errors
    console.error("JWT verification error:", error);

    // Return null user instead of throwing
    return { user: null };
  }
}

// Hoặc nếu muốn retry logic
export async function getUserWithRetry(maxRetries = 1) {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await originalGetUser();
      return result;
    } catch (error) {
      console.error(`JWT verification attempt ${i + 1} failed:`, error);
      lastError = error;

      // Wait a bit before retry
      if (i < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  // All retries failed
  return { user: null };
}
