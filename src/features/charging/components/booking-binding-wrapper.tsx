"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Reservation } from "@/features/reservations/schemas/reservation.schema";

const BookingBindingClient = dynamic(
  () =>
    import("@/features/charging/components/booking-binding-client").then(
      (mod) => mod.BookingBindingClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex h-[80vh] max-w-2xl flex-col items-center justify-center space-y-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    ),
  },
);

interface BookingBindingWrapperProps {
  sessionId: string;
  ablyToken: string;
  channelId: string;
  expiresAt: string;
  reservations: Reservation[];
}

export function BookingBindingWrapper({
  sessionId,
  ablyToken,
  channelId,
  expiresAt,
  reservations,
}: BookingBindingWrapperProps) {
  return (
    <BookingBindingClient
      sessionId={sessionId}
      ablyToken={ablyToken}
      channelId={channelId}
      expiresAt={expiresAt}
      reservations={reservations}
    />
  );
}
