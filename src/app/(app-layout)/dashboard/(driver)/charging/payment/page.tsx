import { getUser } from "@/lib/auth/auth-server";
import { permanentRedirect } from "next/navigation";
import PaymentClient from "@/features/charging/components/payment-client";
import { getCurrentSessionWithToken } from "@/features/charging/services/session-service";

export default async function Page() {
  const { token } = await getUser();

  const currentSession = await getCurrentSessionWithToken(token!);
  if (!currentSession || currentSession.session.status !== "UNPAID") {
    permanentRedirect("/dashboard/charging");
  }

  return (
    <PaymentClient
      sessionId={currentSession.session.id.toString()}
      sessionData={currentSession.session}
    />
  );
}
