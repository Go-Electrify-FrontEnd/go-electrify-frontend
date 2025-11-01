"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { CurrentChargingSession } from "@/features/charging/schemas/current-session.schema";

const ChargingProgressClient = dynamic(
  () =>
    import("@/features/charging/components/charging-progress-client").then(
      (mod) => mod.ChargingProgressClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex h-[80vh] max-w-2xl flex-col items-center justify-center space-y-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Đang tải tiến trình sạc...</p>
      </div>
    ),
  },
);

interface ChargingProgressWrapperProps {
  sessionId: number;
  ablyToken: string;
  channelId: string;
  expiresAt: string;
  sessionData: CurrentChargingSession | null;
  errorMessage?: string | null;
}

export function ChargingProgressWrapper({
  sessionId,
  ablyToken,
  channelId,
  expiresAt,
  sessionData,
  errorMessage,
}: ChargingProgressWrapperProps) {
  return (
    <ChargingProgressClient
      sessionId={sessionId}
      ablyToken={ablyToken}
      channelId={channelId}
      expiresAt={expiresAt}
      sessionData={sessionData}
      errorMessage={errorMessage}
    />
  );
}
