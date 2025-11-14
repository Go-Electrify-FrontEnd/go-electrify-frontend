"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId } from "ai";
import { Bot, MessageSquare, Plus, X } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";

interface ChatPopupProps {
  chatId: string;
}

export function ChatPopup({ chatId }: ChatPopupProps) {
  const MAX_MESSAGES = 15;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(chatId);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: currentChatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    experimental_throttle: 60,
  });

  const hasReachedMessageLimit = messages.length >= MAX_MESSAGES;

  const handleSubmit = (message: PromptInputMessage) => {
    if (hasReachedMessageLimit) {
      return;
    }

    if (message.text.trim()) {
      sendMessage({ text: message.text });
      setInput("");
    }
  };

  const handleNewChat = () => {
    setIsCreatingNewChat(true);
    try {
      // Generate a new chat ID
      const newChatId = generateId();

      // Update the chat ID to create a new session
      setCurrentChatId(newChatId);

      // Clear current messages to start fresh
      setMessages([]);
      setInput("");

      console.log(`[ChatPopup] Started new chat session with ID: ${newChatId}`);
    } catch (error) {
      console.error("[ChatPopup] Failed to create new chat:", error);
    } finally {
      setIsCreatingNewChat(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Mở trợ lý GoElectrify"
          className="relative"
        >
          <Bot className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="bg-background no-scrollbar flex h-[600px] w-full max-w-[calc(100%-2rem)] flex-col p-0 sm:h-[680px] sm:max-w-[540px] lg:h-[720px] lg:max-w-[640px]"
      >
        <DialogTitle className="sr-only">Trợ lý GoElectrify</DialogTitle>
        <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-9 sm:size-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                  <Bot className="size-5 sm:size-6" />
                </AvatarFallback>
              </Avatar>
              <div className="border-background absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-green-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground text-sm leading-tight font-bold">
                Trợ lý GoElectrify
              </span>
              <span className="text-muted-foreground text-sm leading-tight font-medium">
                {status === "streaming" ? "Đang trả lời..." : "Sẵn sàng hỗ trợ"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              disabled={isCreatingNewChat || status === "streaming"}
              className="hover:bg-muted size-8"
              title="Cuộc trò chuyện mới"
            >
              <Plus className="size-4 sm:size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-muted size-8"
            >
              <X className="size-4 sm:size-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
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
                messages.map((message, msgIndex) => {
                  return (
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
                                  <ReasoningContent>
                                    {part.text}
                                  </ReasoningContent>
                                </Reasoning>
                              );
                          }
                        })}
                      </MessageContent>
                    </Message>
                  );
                })
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t p-3 sm:p-4">
            {hasReachedMessageLimit && (
              <div className="mb-3 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                <p>
                  Bạn đã đạt giới hạn {MAX_MESSAGES} tin nhắn cho cuộc trò
                  chuyện này. Hãy tạo cuộc trò chuyện mới để tiếp tục.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="self-start"
                  onClick={handleNewChat}
                  disabled={isCreatingNewChat || status === "streaming"}
                >
                  Bắt đầu cuộc trò chuyện mới
                </Button>
              </div>
            )}
            <PromptInput
              onSubmit={handleSubmit}
              className="relative mx-auto mt-4 w-full max-w-2xl"
            >
              <PromptInputTextarea
                value={input}
                placeholder="Hãy hỏi tôi bất cứ điều gì..."
                onChange={(e) => setInput(e.currentTarget.value)}
                className="pr-12"
                disabled={hasReachedMessageLimit}
              />
              <PromptInputSubmit
                status={status === "streaming" ? "streaming" : "ready"}
                disabled={hasReachedMessageLimit || !input.trim()}
                className="absolute right-1 bottom-1"
              />
            </PromptInput>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
