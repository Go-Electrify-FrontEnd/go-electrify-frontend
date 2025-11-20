"use client";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

interface ChatInputProps {
  input: string;
  status: "streaming" | "ready";
  onInputChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
}

export function ChatInput({
  input,
  status,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <div className="border-t p-3 sm:p-4">
      <PromptInput
        onSubmit={onSubmit}
        className="relative mx-auto mt-4 w-full max-w-2xl"
      >
        <PromptInputTextarea
          value={input}
          placeholder="Hãy hỏi tôi bất cứ điều gì..."
          onChange={(e) => onInputChange(e.currentTarget.value)}
          className="pr-12"
        />
        <PromptInputSubmit
          status={status === "streaming" ? "streaming" : "ready"}
          disabled={!input.trim()}
          className="absolute right-1 bottom-1"
        />
      </PromptInput>
    </div>
  );
}
