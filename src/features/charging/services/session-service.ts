import {
  CurrentSessionWithTokenResponseSchema,
  type CurrentSessionData,
} from "@/features/charging/schemas/current-session.schema";
import { API_BASE_URL } from "@/lib/api-config";

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Fetch the current charging session with Ably token
 * @param token - User authentication token
 * @returns Parsed session data with Ably token or null if no active session or if an error occurs
 */
export async function getCurrentSessionWithToken(
  token: string,
): Promise<CurrentSessionData | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/charging-sessions/me/current-with-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const rawJson = await response.json().catch(() => null);
    if (!rawJson) {
      if (isDevelopment) {
        console.error(
          `Failed to parse current session response (${response.status})`,
        );
      }
      return null;
    }

    const parsedResult =
      CurrentSessionWithTokenResponseSchema.safeParse(rawJson);
    if (!parsedResult.success) {
      if (isDevelopment) {
        console.error("Schema validation failed:", parsedResult.error);
      }
      return null;
    }

    const parsed = parsedResult.data;

    // Handle no current session case
    if (!parsed.ok && parsed.error === "no_current_session") {
      return null;
    }

    // Handle other error responses
    if (!parsed.ok) {
      if (isDevelopment) {
        const errorMessage = parsed.message || parsed.error;
        console.error(
          `Session fetch failed: ${errorMessage || `Status ${response.status}`}`,
        );
      }
      return null;
    }

    // Validate response status
    if (!response.ok) {
      if (isDevelopment) {
        console.error(`Unexpected response status (${response.status})`);
      }
      return null;
    }

    const payload = parsed.data;

    // Development-only channel validation
    if (isDevelopment) {
      validateChannelId(payload.session.id, payload.session.channelId);
    }

    return payload;
  } catch (error) {
    if (isDevelopment) {
      console.error("Error fetching current session:", error);
    }
    return null;
  }
}

/**
 * Validate channel ID format in development mode
 * @param sessionId - Session ID
 * @param channelId - Channel ID from response
 */
function validateChannelId(sessionId: number, channelId: string): void {
  const expectedChannel = `ge:session:${sessionId}`;

  console.log("Session channel validation:", {
    sessionId,
    channelId,
    expectedChannel,
    isValid: channelId === expectedChannel,
  });

  if (channelId !== expectedChannel) {
    console.warn(
      `⚠️ Channel ID mismatch!\nReceived: ${channelId}\nExpected: ${expectedChannel}`,
    );
  }
}
