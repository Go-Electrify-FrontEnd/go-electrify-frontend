"use client";

import * as Ably from "ably";

interface MessageViewProps {
  message: Ably.Message;
}

export function MessageView({ message }: MessageViewProps) {
  const dataText =
    typeof message.data === "string"
      ? message.data
      : JSON.stringify(message.data, null, 2);

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <div className="text-muted-foreground mb-1 text-xs">
          {message.name || "message"}
          {message.timestamp && (
            <span className="ml-2">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
        <pre className="bg-transparent font-mono text-sm whitespace-pre-wrap text-green-300">
          {dataText}
        </pre>
      </div>
    </div>
  );
}