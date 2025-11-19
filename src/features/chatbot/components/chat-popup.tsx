"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId, UIMessage } from "ai";
import { Bot, MessageSquare, Plus, X, History, Trash2 } from "lucide-react";
import { useState, useEffect, type MouseEvent } from "react";
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
import type { Chat } from "@/lib/chat-store";

interface ChatPopupProps {
  chatId: string;
}

export function ChatPopup({ chatId }: ChatPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: currentChatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    experimental_throttle: 60,
  });

  // Debug: Log messages whenever they change
  useEffect(() => {
    console.log(`[ChatPopup] Messages updated - Count: ${messages.length}`);
    if (messages.length > 0) {
      console.log(
        "[ChatPopup] Messages in state:",
        messages.map((m) => ({
          role: m.role,
          id: m.id,
          parts: m.parts.length,
        })),
      );
    }
  }, [messages]);

  // Sync messages when chat ID changes
  useEffect(() => {
    console.log(
      `[ChatPopup] Chat ID changed to: ${currentChatId}, initialMessages: ${initialMessages.length}`,
    );
    if (initialMessages.length > 0) {
      console.log(
        `[ChatPopup] Setting messages for chat ID: ${currentChatId}`,
        initialMessages.length,
      );
      setMessages(initialMessages);
    }
  }, [currentChatId, initialMessages, setMessages]);

  // Load chat history when dialog opens
  useEffect(() => {
    if (isOpen && !showHistory) {
      loadChatHistory();
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/chats");
      if (!response.ok) {
        throw new Error("Failed to load chats");
      }
      const chats = await response.json();
      setChatHistory(chats);
    } catch (error) {
      console.error("[ChatPopup] Failed to load chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadExistingChat = async (chat: Chat) => {
    try {
      console.log(
        `[ChatPopup] Loading chat ${chat.id} with ${chat.messages.length} messages`,
      );

      let fullChat = chat;
      if (!chat.messages || chat.messages.length === 0) {
        console.log(
          `[ChatPopup] Chat ${chat.id} has no messages, fetching from API`,
        );
        const response = await fetch(`/api/chats/${chat.id}`);
        if (!response.ok) {
          throw new Error("Failed to load chat details");
        }
        fullChat = await response.json();
      }

      setCurrentChatId(fullChat.id);
      setInitialMessages(fullChat.messages);
      setMessages(fullChat.messages);

      setShowHistory(false);
      setInput("");

      console.log("[ChatPopup] Chat loaded successfully");
    } catch (error) {
      console.error("[ChatPopup] Failed to load chat:", error);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      setChatHistory((prev) => prev.filter((c) => c.id !== chatId));

      // If deleted chat is current, start a new chat
      if (chatId === currentChatId) {
        handleNewChat();
      }
    } catch (error) {
      console.error("[ChatPopup] Failed to delete chat:", error);
    }
  };

  const handleSubmit = (message: PromptInputMessage) => {
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

      // Ensure we're not in history view
      setShowHistory(false);

      // Clear initial messages for new chat
      setInitialMessages([]);

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
              onClick={() => {
                setShowHistory(!showHistory);
                if (!showHistory) {
                  loadChatHistory();
                }
              }}
              className="hover:bg-muted size-8"
              title="Lịch sử trò chuyện"
            >
              <History className="size-4 sm:size-5" />
            </Button>
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
          {showHistory ? (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="border-b px-4 py-3">
                <h3 className="text-sm font-semibold">Lịch sử trò chuyện</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center p-8">
                    <p className="text-muted-foreground text-sm">Đang tải...</p>
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <p className="text-muted-foreground text-sm">
                      Chưa có lịch sử trò chuyện
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => loadExistingChat(chat)}
                        className={`group hover:bg-muted relative cursor-pointer rounded-lg border p-3 transition-colors ${
                          chat.id === currentChatId
                            ? "border-primary bg-muted"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {chat.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {new Date(chat.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                              className="hover:bg-destructive/10 hover:text-destructive size-8"
                              title="Xóa"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
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
                      {console.log(
                        `[ChatPopup] Rendering ${messages.length} messages`,
                      )}
                      {messages.map((message, msgIndex) => {
                        console.log(
                          `[ChatPopup] Rendering message ${msgIndex}: role=${message.role}, id=${message.id}, parts=${message.parts.length}`,
                        );
                        return (
                          <Message from={message.role} key={msgIndex}>
                            <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-assistant]:bg-muted group-[.is-assistant]:text-foreground rounded-2xl px-3 py-2 text-sm sm:px-4 sm:py-3">
                              {message.parts.map((part, i) => {
                                switch (part.type) {
                                  case "text":
                                    return (
                                      <MessageResponse
                                        key={`${msgIndex}-part-${i}`}
                                      >
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
                      })}
                    </>
                  )}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>

              <div className="border-t p-3 sm:p-4">
                <PromptInput
                  onSubmit={handleSubmit}
                  className="relative mx-auto mt-4 w-full max-w-2xl"
                >
                  <PromptInputTextarea
                    value={input}
                    placeholder="Hãy hỏi tôi bất cứ điều gì..."
                    onChange={(e) => setInput(e.currentTarget.value)}
                    className="pr-12"
                  />
                  <PromptInputSubmit
                    status={status === "streaming" ? "streaming" : "ready"}
                    disabled={!input.trim()}
                    className="absolute right-1 bottom-1"
                  />
                </PromptInput>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
