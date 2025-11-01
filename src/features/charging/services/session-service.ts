import { CurrentSessionWithTokenResponseSchema } from "@/features/charging/schemas/current-session.schema";

const API_BASE_URL = "https://api.go-electrify.com/api/v1";

/**
 * Fetch the current charging session with Ably token
 * @param token - User authentication token
 * @returns Parsed session data with Ably token or null if not found
 * @throws Error if the API request fails or response is invalid
 */
export async function getCurrentSessionWithToken(token: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/charging-sessions/me/current-with-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch current session (${response.status})`,
      );
    }

    const data = await response.json();
    console.log("Fetched current session with token:", data);
    const parsed = CurrentSessionWithTokenResponseSchema.parse(data);

    // Debug: Log session and channel info
    console.log("Session ID:", parsed.data.session.id);
    console.log("Channel ID from session:", parsed.data.session.channelId);
    const expectedChannel = `ge:session:${parsed.data.session.id}`;
    console.log("Expected channel format:", expectedChannel);

    if (parsed.data.session.channelId !== expectedChannel) {
      console.warn(
        "⚠️ Channel ID mismatch! Session channel:",
        parsed.data.session.channelId,
        "Expected:",
        expectedChannel,
      );
    }

    return parsed.data;
  } catch (error) {
    console.error("Failed to fetch current session with token:", error);
    throw error;
  }
}
