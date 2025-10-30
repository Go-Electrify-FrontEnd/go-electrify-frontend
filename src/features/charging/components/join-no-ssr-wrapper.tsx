"use client";

import { Reservation } from "@/features/reservations/schemas/reservation.schema";
import dynamic from "next/dynamic";

const ComponentNoSSR = dynamic(() => import("./join-page-wrapper"), {
  ssr: false,
});

interface JoinPageWrapperProps {
  reservations: Reservation[];
}

export default function JoinPageWrapperNoSSR({
  reservations,
}: JoinPageWrapperProps) {
  return <ComponentNoSSR reservations={reservations} />;
}
