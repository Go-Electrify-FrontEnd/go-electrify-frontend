"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Send, Square } from "lucide-react";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

export type PromptInputProps = ComponentProps<"form">;

export const PromptInput = forwardRef<HTMLFormElement, PromptInputProps>(
  ({ className, ...props }, ref) => (
    <form
      ref={ref}
      className={cn("relative flex items-end gap-2", className)}
      {...props}
    />
  )
);

PromptInput.displayName = "PromptInput";

export type PromptInputTextareaProps = ComponentProps<typeof Textarea>;

export const PromptInputTextarea = forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(({ className, ...props }, ref) => (
  <Textarea
    ref={ref}
    className={cn("min-h-[60px] resize-none", className)}
    {...props}
  />
));

PromptInputTextarea.displayName = "PromptInputTextarea";

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: "ready" | "streaming" | "submitted";
};

export const PromptInputSubmit = forwardRef<
  HTMLButtonElement,
  PromptInputSubmitProps
>(({ className, status = "ready", children, ...props }, ref) => {
  const isStreaming = status === "streaming";

  return (
    <Button
      ref={ref}
      type="submit"
      size="icon"
      className={cn("shrink-0", className)}
      {...props}
    >
      {isStreaming ? (
        <>
          <Square className="size-4" />
          <span className="sr-only">Stop generating</span>
        </>
      ) : (
        <>
          {children ?? <Send className="size-4" />}
          <span className="sr-only">Send message</span>
        </>
      )}
    </Button>
  );
});

PromptInputSubmit.displayName = "PromptInputSubmit";
