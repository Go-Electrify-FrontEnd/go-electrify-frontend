import { getUser } from "@/lib/auth/auth-server";
import { notFound, permanentRedirect } from "next/navigation";
import { ChargingProgressWrapper } from "@/features/charging/components/charging-progress-wrapper";
import { getCurrentSessionWithToken } from "@/features/charging/services/session-service";

export default async function ChargingProgressPage() {
  const { token } = await getUser();
  if (!token) {
    notFound();
  }

  const data = await getCurrentSessionWithToken(token);
  if (!data) {
    permanentRedirect("/dashboard/charging");
  }

  if (!data.session.bookingId) {
    return (
      <ChargingProgressWrapper
        sessionId={data.session.id}
        ablyToken=""
        channelId=""
        expiresAt=""
        sessionData={data.session}
        errorMessage="Phiên sạc chưa được liên kết với đặt chỗ. Vui lòng quay lại trang liên kết."
      />
    );
  }

  return (
    <ChargingProgressWrapper
      sessionId={data.session.id}
      ablyToken={data.ablyToken}
      channelId={data.session.channelId}
      expiresAt={data.expiresAt}
      sessionData={data.session}
      errorMessage={null}
    />
  );
}
