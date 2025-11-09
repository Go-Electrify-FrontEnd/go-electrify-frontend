"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, StopCircle } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ThinkingIndicator } from "./thinking-indicator";

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const placeholders = useMemo(
    () => [
      "Nhập câu hỏi của bạn...",
      "Ví dụ: trạm sạc gần nhất",
      "Ví dụ: phí sạc ban đêm",
    ],
    [],
  );

  const placeholder = useMemo(() => {
    const index = Math.floor(Date.now() / 10000) % placeholders.length;
    return placeholders[index];
  }, [placeholders]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && status === "ready") {
        sendMessage({ text: input });
        setInput("");
      }
    },
    [input, sendMessage, status],
  );

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed right-6 bottom-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="icon-lg"
              className="size-14 rounded-full shadow-lg hover:shadow-xl"
              aria-label="Mở trợ lý Go-Electrify"
            >
              <Bot className="size-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 bottom-6 z-50 w-[90vw] sm:w-[400px]"
          >
            <Card className="flex h-[600px] max-h-[85vh] flex-col shadow-2xl">
              {/* Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">
                      Trợ lý Go-Electrify
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setIsOpen(false)}
                    aria-label="Đóng cửa sổ trò chuyện"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages area */}
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea ref={scrollAreaRef} className="h-full">
                  <div className="space-y-4 p-4">
                    {messages.length === 0 && (
                      <div className="flex flex-col gap-4 py-12 text-center">
                        <div className="bg-muted flex size-16 items-center justify-center self-center rounded-full">
                          <Bot className="text-muted-foreground size-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-foreground font-semibold">
                            Xin chào! Tôi là trợ lý Go-Electrify
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Tôi có thể hỗ trợ bạn về trạm sạc, giá, đặt chỗ và
                            quản lý tài khoản.
                          </p>
                        </div>
                      </div>
                    )}

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground",
                          )}
                        >
                          {message.parts.map((part, index) => {
                            if (part.type === "text") {
                              return message.role === "user" ? (
                                <p
                                  key={index}
                                  className="leading-relaxed whitespace-pre-wrap"
                                >
                                  {part.text}
                                </p>
                              ) : (
                                <ReactMarkdown
                                  key={index}
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({ children }) => (
                                      <p className="mb-2 leading-relaxed last:mb-0">
                                        {children}
                                      </p>
                                    ),
                                    strong: ({ children }) => (
                                      <strong className="font-bold">
                                        {children}
                                      </strong>
                                    ),
                                    ul: ({ children }) => (
                                      <ul className="mb-2 list-disc space-y-1 pl-4">
                                        {children}
                                      </ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="mb-2 list-decimal space-y-1 pl-4">
                                        {children}
                                      </ol>
                                    ),
                                    li: ({ children }) => (
                                      <li className="leading-relaxed">
                                        {children}
                                      </li>
                                    ),
                                    a: ({ href, children }) => (
                                      <a
                                        href={href}
                                        className="text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {children}
                                      </a>
                                    ),
                                    code: ({ children, className }) => {
                                      const isInline = !className;
                                      return isInline ? (
                                        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                                          {children}
                                        </code>
                                      ) : (
                                        <code className="bg-muted block overflow-x-auto rounded p-2 font-mono text-xs">
                                          {children}
                                        </code>
                                      );
                                    },
                                  }}
                                >
                                  {part.text}
                                </ReactMarkdown>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Thinking indicator */}
                    {isLoading &&
                      messages.length > 0 &&
                      messages[messages.length - 1]?.role === "user" && (
                        <ThinkingIndicator variant="simple" />
                      )}

                    {error && (
                      <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-3">
                        <p className="text-destructive text-sm">
                          Không thể nhận phản hồi. Vui lòng thử lại.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Footer with input and actions */}
              <CardFooter className="flex-col gap-3 border-t">
                {isLoading && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => stop()}
                    className="w-full"
                  >
                    <StopCircle className="size-4" />
                    Dừng tạo câu trả lời
                  </Button>
                )}

                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    aria-label="Gửi tin nhắn"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>

                <div className="flex w-full flex-col gap-1">
                  <p className="text-muted-foreground text-center text-xs">
                    Phản hồi từ AI có thể chưa chính xác hoàn toàn.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
