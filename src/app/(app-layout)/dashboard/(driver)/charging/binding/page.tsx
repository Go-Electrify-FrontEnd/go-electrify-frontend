import { getUser } from "@/lib/auth/auth-server";
import { getReservations } from "@/features/reservations/services/reservations-api";
import { notFound } from "next/navigation";
import { BookingBindingWrapper } from "@/features/charging/components/booking-binding-wrapper";

interface BindingPageProps {
  searchParams: Promise<{
    sessionId?: string;
    ablyToken?: string;
    channelId?: string;
    expiresAt?: string;
    pricePerKwh?: string;
  }>;
}

export default async function BindingPage({ searchParams }: BindingPageProps) {
  const params = await searchParams;
  const { sessionId, ablyToken, channelId, expiresAt, pricePerKwh } = params;

  // Validate required parameters
  if (!sessionId || !ablyToken || !channelId || !expiresAt || !pricePerKwh) {
    notFound();
  }

  const { token } = await getUser();
  const reservations = await getReservations(token!);

  return (
    <BookingBindingWrapper
      sessionId={sessionId}
      ablyToken={ablyToken}
      channelId={channelId}
      expiresAt={expiresAt}
      reservations={reservations}
      pricePerKwh={Number(pricePerKwh)}
    />
  );
}
