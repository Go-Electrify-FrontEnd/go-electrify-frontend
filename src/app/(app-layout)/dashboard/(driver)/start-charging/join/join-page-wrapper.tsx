"use client";

import * as Ably from "ably";
import { useSearchParams } from "next/navigation";
import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import { Input } from "@/components/ui/input";
import { handleBindBooking } from "../action";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";

export default function JoinPage() {
  const params = useSearchParams();
  console.log("Search Params:", params.toString());

  const ablyToken = params.get("ablyToken");
  const channelId = params.get("channelId");
  const sessionId = params.get("sessionId");
  const expiresAt = params.get("expiresAt");

  const realtimeClient = new Ably.Realtime({
    token: ablyToken!,
  });

  return (
    <AblyProvider client={realtimeClient}>
      <ChannelProvider channelName={channelId!}>
        <div>
          <h1>Join Charging Session</h1>
          <p>Ably Token: {ablyToken}</p>
          <p>Channel ID: {channelId}</p>
          <p>Session ID: {sessionId}</p>
          <p>Expires At: {expiresAt}</p>
        </div>

        <div>
          <BookingBinding sessionId={sessionId!} channelName={channelId!} />
        </div>
      </ChannelProvider>
    </AblyProvider>
  );
}

function BookingBinding({
  sessionId,
  channelName,
}: {
  sessionId: string;
  channelName: string;
}) {
  const [state, action, pending] = useActionState(handleBindBooking, {
    success: false,
    msg: "",
    data: null,
  });

  const [messages, setMessages] = useState<Ably.Message[]>([]);
  const { publish } = useChannel(channelName, (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  const handlePublish = () => {
    publish("start_session", { targetSOC: 80 });
  };

  function MessageView({ message }: { message: Ably.Message }) {
    return (
      <p className="border-b p-4 break-words last:border-0">{message.data}</p>
    );
  }

  if (state.success) {
    return (
      <div>
        Booking bound successfully!
        <Button
          onClick={() => {
            handlePublish();
          }}
        >
          Start Charging
        </Button>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {messages.map((msg: Ably.Message) => (
            <MessageView key={msg.id} message={msg} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" value={sessionId} />
      <Input placeholder="Booking Code" />
      <Input placeholder="InitialSOC" type="number" />
      <Input placeholder="TargetSOC" type="number" />
    </form>
  );
}
