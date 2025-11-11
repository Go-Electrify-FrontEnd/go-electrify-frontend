"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { createChat, loadChat, saveChat } from "@/lib/chat-store";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);

  // Initialize chat ID and load previous messages
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Try to get existing chat ID from session storage or create new one
      let id = sessionStorage.getItem("current_chat_id");
      if (!id) {
        id = createChat();
        sessionStorage.setItem("current_chat_id", id);
      }
      setChatId(id);
    }
  }, []);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: chatId || undefined,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: async () => {
        return {
          "x-chat-id": chatId || "",
        };
      },
    }),
    onFinish: ({ messages: updatedMessages }) => {
      // Save messages to local storage after each response
      if (chatId) {
        saveChat(chatId, updatedMessages);
      }
    },
  });

  // Load initial messages from local storage
  useEffect(() => {
    if (chatId && messages.length === 0) {
      const savedMessages = loadChat(chatId);
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      }
    }
  }, [chatId, messages.length, setMessages]);

  // Save messages to local storage whenever they change
  const prevMessagesRef = useRef(messages);
  useEffect(() => {
    if (chatId && messages.length > 0 && messages !== prevMessagesRef.current) {
      saveChat(chatId, messages);
      prevMessagesRef.current = messages;
    }
  }, [messages, chatId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="size-14 rounded-full shadow-lg hover:shadow-xl sm:size-16"
              aria-label="Nhắn tin"
            >
              <Bot className="size-6 sm:size-7" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 bottom-4 z-50 max-h-[90vh] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] md:w-[480px]"
          >
            <div className="bg-background flex flex-col overflow-hidden rounded-xl border shadow-2xl">
              <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="size-9 sm:size-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        <Bot className="size-5 sm:size-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="border-background absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-green-500"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground text-xs leading-tight font-bold">
                      Trợ lý GoElectrify
                    </span>
                    <span className="text-muted-foreground text-[10px] leading-tight font-medium">
                      {status === "streaming"
                        ? "Đang trả lời..."
                        : "Sẵn sàng hỗ trợ"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-muted size-7 sm:size-8"
                  >
                    <X className="size-4 sm:size-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="bg-background h-[450px] sm:h-[520px] md:h-[580px]">
                <div className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-5">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-12 text-center sm:gap-4 sm:py-16">
                      <Avatar className="size-16 sm:size-20">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="size-8 sm:size-10" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 sm:space-y-2">
                        <p className="text-foreground text-xs font-semibold">
                          Xin chào! Tôi là trợ lý Go-Electrify
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          Hỏi tôi bất cứ điều gì về trạm sạc, giá cả, đặt chỗ và
                          quản lý tài khoản.
                        </p>
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2",
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row",
                      )}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="size-7 shrink-0 sm:size-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                            <Bot className="size-3.5 sm:size-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3 py-2 text-xs sm:max-w-[80%] sm:px-4 sm:py-2.5",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground",
                        )}
                      >
                        {message.parts.map((part, i) => {
                          if (part.type === "text") {
                            // Use memoized markdown for assistant messages
                            if (message.role === "assistant") {
                              return (
                                <MemoizedMarkdown
                                  key={`${message.id}-${i}`}
                                  id={`${message.id}-${i}`}
                                  content={part.text}
                                />
                              );
                            }
                            // Plain text for user messages
                            return (
                              <p
                                key={`${message.id}-${i}`}
                                className="leading-relaxed break-words whitespace-pre-wrap"
                              >
                                {part.text}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Footer with input */}
              <div className="bg-background border-t p-3 sm:p-4">
                <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                    placeholder="Viết tin nhắn..."
                    disabled={status === "streaming"}
                    className="max-h-[100px] min-h-[40px] resize-none text-xs sm:max-h-[120px] sm:min-h-[44px]"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || status === "streaming"}
                    className="size-10 shrink-0 rounded-full sm:size-11"
                  >
                    <Send className="size-4 sm:size-5" />
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
