"use client";

import { Reservation } from "@/lib/zod/reservation/reservation.schema";
import { BindingProvider, useBindingContext } from "../contexts/binding-context";
import { BookingBinding } from "./booking-binding";
import { BindingActivePanel } from "./binding-active-panel";

function InnerJoinPageWrapper({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const binding = useBindingContext();

  const { sessionId, channelId } = binding;

  if (binding.currentStep === "binding") {
    return (
      <BookingBinding
        sessionId={sessionId}
        channelName={channelId}
        reservations={reservations}
      />
    );
  }

  if (binding.currentStep === "charging") {
    return <BindingActivePanel />;
  }

  return <div>Unknown Step</div>;
}

export default function JoinPageWrapper({
  reservations,
}: {
  reservations: Reservation[];
}) {
  return (
    <BindingProvider>
      <InnerJoinPageWrapper reservations={reservations} />
    </BindingProvider>
  );
}
