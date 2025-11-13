"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage, generateId } from "ai";
import { Bot, MessageSquare, Plus, X } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  PromptInput as Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";

interface ChatPopupProps {
  chatId: string;
  initialMessages?: UIMessage[];
}

export function ChatPopup({ chatId, initialMessages = [] }: ChatPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(chatId);

  // Track if chat is initialized to prevent re-initialization
  const hasInitializedRef = useRef(false);

  // Memoize transport to prevent recreation on every render (prevents 429 errors)
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    [],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    id: currentChatId,
    transport,
  });

  // Initialize messages only once on mount
  useEffect(() => {
    if (
      !hasInitializedRef.current &&
      initialMessages.length > 0 &&
      currentChatId === chatId
    ) {
      setMessages(initialMessages);
      hasInitializedRef.current = true;
    }
  }, [chatId, currentChatId, initialMessages, setMessages]);

  const submitPrompt = () => {
    if (!input.trim() || status === "streaming") {
      return;
    }

    sendMessage({ text: input });
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitPrompt();
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
                  const isUser = message.role === "user";
                  const messageKey = message.id || `msg-${msgIndex}`;

                  return (
                    <Message from={message.role} key={messageKey}>
                      {!isUser && (
                        <Avatar className="size-7 shrink-0 sm:size-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            <Bot className="size-3.5 sm:size-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-assistant]:bg-muted group-[.is-assistant]:text-foreground rounded-2xl px-3 py-2 text-sm sm:px-4 sm:py-3">
                        {message.parts.map((part, index) => {
                          if (part.type !== "text") {
                            return null;
                          }

                          return (
                            <MessageResponse
                              key={`${messageKey}-part-${index}`}
                            >
                              {part.text}
                            </MessageResponse>
                          );
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
            <Input
              onSubmit={handleSubmit}
              className="flex w-full items-end gap-2 sm:gap-3"
            >
              <PromptInputTextarea
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                placeholder="Viết tin nhắn..."
                disabled={status === "streaming"}
                rows={1}
                className="max-h-[120px] min-h-[44px] resize-none text-sm"
              />
              <PromptInputSubmit
                status={status === "streaming" ? "streaming" : "ready"}
                disabled={!input.trim() || status === "streaming"}
                className="size-10 rounded-full sm:size-11"
              />
            </Input>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
