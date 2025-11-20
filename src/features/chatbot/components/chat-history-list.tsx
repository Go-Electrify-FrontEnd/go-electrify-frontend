"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Chat } from "@/lib/chat-store";
import { formatDate } from "@/lib/formatters";

interface ChatHistoryListProps {
  chatHistory: Chat[];
  currentChatId: string;
  isLoadingHistory: boolean;
  onLoadChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatHistoryList({
  chatHistory,
  currentChatId,
  isLoadingHistory,
  onLoadChat,
  onDeleteChat,
}: ChatHistoryListProps) {
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  const handleDelete = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingChatId(chatId);
    try {
      await onDeleteChat(chatId);
    } finally {
      setDeletingChatId(null);
    }
  };

  return (
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
                onClick={() => onLoadChat(chat)}
                className={`group hover:bg-muted relative cursor-pointer rounded-lg border p-3 transition-colors ${
                  chat.id === currentChatId ? "border-primary bg-muted" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{chat.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(new Date(chat.createdAt))}
                    </p>
                  </div>
                  <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(chat.id, e)}
                      disabled={deletingChatId === chat.id}
                      className="hover:bg-destructive/10 hover:text-destructive size-8"
                      title="Xóa"
                    >
                      {deletingChatId === chat.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
