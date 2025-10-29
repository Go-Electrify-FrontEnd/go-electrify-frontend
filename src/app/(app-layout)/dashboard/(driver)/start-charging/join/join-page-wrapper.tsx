"use client";

import * as Ably from "ably";
import { notFound, useSearchParams } from "next/navigation";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useState, useMemo } from "react";
import { BookingBinding } from "./booking-binding";

type ChargingStep = "binding" | "charging";

export default function JoinPage() {
  const params = useSearchParams();

  const ablyToken = params.get("ablyToken");
  const channelId = params.get("channelId");
  const sessionId = params.get("sessionId");
  const expiresAt = params.get("expiresAt");

  if (!ablyToken || !channelId || !sessionId || !expiresAt) {
    notFound();
  }

  const [currentStep, setCurrentStep] = useState<ChargingStep>("binding");

  const realtimeClient = useMemo(
    () =>
      new Ably.Realtime({
        token: ablyToken,
        autoConnect: true,
      }),
    [ablyToken],
  );

  const handleBindingSuccess = () => {
    setCurrentStep("charging");
  };

  return (
    <AblyProvider client={realtimeClient}>
      <ChannelProvider channelName={channelId}>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Phiên sạc
            </h1>
            <p className="text-muted-foreground">
              Mã phiên: <code className="text-sm">{sessionId}</code>
            </p>
            <p className="text-muted-foreground text-sm">
              Bước hiện tại: {currentStep === "binding" ? "Liên kết đặt chỗ" : "Đang sạc"}
            </p>
          </div>

          <BookingBinding
            sessionId={sessionId}
            channelName={channelId}
            onBindingSuccess={handleBindingSuccess}
          />
        </div>
      </ChannelProvider>
    </AblyProvider>
  );
}
