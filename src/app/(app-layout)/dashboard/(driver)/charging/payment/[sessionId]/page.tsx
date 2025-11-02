import { getUser } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import PaymentClient from "@/features/charging/components/payment-client";
import { getCurrentSessionWithToken } from "@/features/charging/services/session-service";

export default async function Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  if (!sessionId) {
    redirect("/dashboard/charging");
  }

  const currentSession = await getCurrentSessionWithToken(token);
  // Verify the session matches the requested sessionId and is unpaid
  if (
    !currentSession ||
    currentSession.session.id.toString() !== sessionId ||
    currentSession.session.status !== "UNPAID"
  ) {
    // Redirect if session not found, doesn't match, or isn't unpaid
    redirect("/dashboard/charging");
  }

  return (
    <PaymentClient sessionId={sessionId} sessionData={currentSession.session} />
  );
}
