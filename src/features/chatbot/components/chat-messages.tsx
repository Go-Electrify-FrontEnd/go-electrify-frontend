"use client";

import { MessageSquare } from "lucide-react";
import type { UIMessage } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";

interface ChatMessagesProps {
  messages: UIMessage[];
  status: "streaming" | "ready";
}

export function ChatMessages({ messages, status }: ChatMessagesProps) {
  return (
    <Conversation>
      <ConversationContent>
        {messages.length === 0 ? (
          <ConversationEmptyState
            icon={
              <MessageSquare className="text-muted-foreground size-10 sm:size-12" />
            }
            title="Xin chào! Tôi là trợ lý Go-Electrify"
            description="Hỏi tôi bất cứ điều gì về trạm sạc, giá cả, đặt chỗ và quản lý tài khoản."
          />
        ) : (
          <>
            {messages.map((message, msgIndex) => (
              <Message from={message.role} key={msgIndex}>
                <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-assistant]:bg-muted group-[.is-assistant]:text-foreground rounded-2xl px-3 py-2 text-sm sm:px-4 sm:py-3">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <MessageResponse key={`${msgIndex}-part-${i}`}>
                            {part.text}
                          </MessageResponse>
                        );
                      case "reasoning":
                        return (
                          <Reasoning
                            defaultOpen={true}
                            key={`${message.id}-${i}`}
                            className="w-full"
                            isStreaming={
                              status === "streaming" &&
                              i === message.parts.length - 1 &&
                              message.id === messages.at(-1)?.id
                            }
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </>
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
