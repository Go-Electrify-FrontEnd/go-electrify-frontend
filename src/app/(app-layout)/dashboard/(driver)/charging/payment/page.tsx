import { getUser } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import PaymentClient from "@/features/charging/components/payment-client";
import { getCurrentSessionWithToken } from "@/features/charging/services/session-service";

export default async function Page() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  const currentSession = await getCurrentSessionWithToken(token);
  if (!currentSession || currentSession.session.status !== "UNPAID") {
    redirect("/dashboard/charging");
  }

  return (
    <PaymentClient
      sessionId={currentSession.session.id.toString()}
      sessionData={currentSession.session}
    />
  );
}
