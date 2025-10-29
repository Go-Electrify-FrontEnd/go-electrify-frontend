"use client";

import { AblyProvider, ChannelProvider } from "ably/react";
import { notFound, useSearchParams } from "next/navigation";
import { createContext, useContext, useMemo, useState } from "react";
import * as Ably from "ably";

interface BindingContextValue {
  ablyToken: string;
  channelId: string;
  sessionId: string;
  expiresAt: string;

  // Booking
  booking: {
    Id: any;
    BookingId: any;
    vehicleModelId: any;
    SocStart: any;
    TargetSoc: any;
  };

  setBooking: (booking: {
    Id: any;
    BookingId: any;
    vehicleModelId: any;
    SocStart: any;
    TargetSoc: any;
  }) => void;

  currentStep: "binding" | "bound" | "charging";
  setCurrentStep: (step: "binding" | "charging") => void;
}

const BindingContext = createContext<BindingContextValue | undefined>(
  undefined,
);

export function BindingProvider({ children }: React.PropsWithChildren) {
  const params = useSearchParams();

  const ablyToken = params.get("ablyToken");
  const channelId = params.get("channelId");
  const sessionId = params.get("sessionId");
  const expiresAt = params.get("expiresAt");

  if (!ablyToken || !channelId || !sessionId || !expiresAt) {
    notFound();
  }

  const realtimeClient = useMemo(
    () =>
      new Ably.Realtime({
        token: ablyToken,
        autoConnect: true,
      }),
    [ablyToken],
  );

  const [booking, setBooking] = useState({
    Id: null,
    BookingId: null,
    vehicleModelId: null,
    SocStart: null,
    TargetSoc: null,
  });

  const [currentStep, setCurrentStep] = useState<"binding" | "charging">(
    "binding",
  );

  return (
    <BindingContext.Provider
      value={{
        ablyToken,
        channelId,
        sessionId,
        expiresAt,
        booking,
        setBooking,
        currentStep,
        setCurrentStep,
      }}
    >
      <AblyProvider client={realtimeClient}>
        <ChannelProvider channelName={channelId}>{children}</ChannelProvider>
      </AblyProvider>
    </BindingContext.Provider>
  );
}

export function useBindingContext() {
  const context = useContext(BindingContext);
  if (!context) {
    throw new Error("useBindingContext must be used within BindingProvider");
  }
  return context;
}
