import { getUser } from "@/lib/auth/auth-server";
import { notFound } from "next/navigation";
import { ChargingProgressWrapper } from "@/features/charging/components/charging-progress-wrapper";
import { getCurrentSessionWithToken } from "@/features/charging/services/session-service";
import type { CurrentChargingSession } from "@/features/charging/schemas/current-session.schema";

export default async function ChargingProgressPage() {
  // Get authenticated user
  const { token } = await getUser();
  if (!token) {
    notFound();
  }

  let sessionData: CurrentChargingSession | null = null;
  let ablyToken = "";
  let channelId = "";
  let expiresAt = "";
  let errorMessage: string | null = null;

  try {
    // Fetch current session with token using the new endpoint
    const data = await getCurrentSessionWithToken(token);

    if (!data) {
      errorMessage = "Không tìm thấy phiên sạc đang hoạt động.";
    } else {
      // Check if session has a booking bound to it
      if (!data.session.bookingId) {
        console.error("Session found but no booking bound:", data.session);
        errorMessage =
          "Phiên sạc chưa được liên kết với đặt chỗ. Vui lòng quay lại trang liên kết.";
      } else {
        sessionData = data.session;
        ablyToken = data.ablyToken;
        // Use the channelId from the session data (this should match the token's capability)
        channelId = data.session.channelId;
        expiresAt = data.expiresAt;
      }
    }
  } catch (error) {
    console.error("Failed to fetch current session:", error);
    errorMessage =
      error instanceof Error
        ? error.message
        : "Lỗi kết nối khi tải thông tin phiên sạc. Vui lòng kiểm tra kết nối mạng.";
  }

  // If we don't have the required data, show error
  if (!sessionData || !ablyToken || !channelId || !expiresAt) {
    return (
      <ChargingProgressWrapper
        sessionId={0}
        ablyToken=""
        channelId=""
        expiresAt=""
        sessionData={null}
        errorMessage={
          errorMessage || "Không tìm thấy phiên sạc đang hoạt động."
        }
      />
    );
  }

  return (
    <ChargingProgressWrapper
      sessionId={sessionData.id}
      ablyToken={ablyToken}
      channelId={channelId}
      expiresAt={expiresAt}
      sessionData={sessionData}
      errorMessage={errorMessage}
    />
  );
}
