import {
  CurrentSessionWithTokenResponseSchema,
  type CurrentSessionData,
} from "@/features/charging/schemas/current-session.schema";

const API_BASE_URL = "https://api.go-electrify.com/api/v1";
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Fetch the current charging session with Ably token
 * @param token - User authentication token
 * @returns Parsed session data with Ably token or null if no active session
 * @throws Error if the API request fails or response is invalid
 */
export async function getCurrentSessionWithToken(
  token: string,
): Promise<CurrentSessionData | null> {
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
    throw new Error(
      `Failed to parse current session response (${response.status})`,
    );
  }

  const parsedResult = CurrentSessionWithTokenResponseSchema.safeParse(rawJson);
  if (!parsedResult.success) {
    if (isDevelopment) {
      console.error("Schema validation failed:", parsedResult.error);
    }
    throw new Error("Invalid response from current session endpoint");
  }

  const parsed = parsedResult.data;

  // Handle no current session case
  if (!parsed.ok && parsed.error === "no_current_session") {
    return null;
  }

  // Handle other error responses
  if (!parsed.ok) {
    const errorMessage = parsed.message || parsed.error;
    throw new Error(
      errorMessage || `Failed to fetch current session (${response.status})`,
    );
  }

  // Validate response status
  if (!response.ok) {
    throw new Error(`Unexpected response status (${response.status})`);
  }

  const payload = parsed.data;

  // Development-only channel validation
  if (isDevelopment) {
    validateChannelId(payload.session.id, payload.session.channelId);
  }

  return payload;
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
