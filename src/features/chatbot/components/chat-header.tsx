"use client";

import { Bot, History, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatHeaderProps {
  status: "streaming" | "ready";
  isCreatingNewChat: boolean;
  showHistory: boolean;
  onToggleHistory: () => void;
  onNewChat: () => void;
  onClose: () => void;
}

export function ChatHeader({
  status,
  isCreatingNewChat,
  showHistory,
  onToggleHistory,
  onNewChat,
  onClose,
}: ChatHeaderProps) {
  return (
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
          onClick={onToggleHistory}
          className="hover:bg-muted size-8"
          title="Lịch sử trò chuyện"
        >
          <History className="size-4 sm:size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          disabled={isCreatingNewChat || status === "streaming"}
          className="hover:bg-muted size-8"
          title="Cuộc trò chuyện mới"
        >
          <Plus className="size-4 sm:size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-muted size-8"
        >
          <X className="size-4 sm:size-5" />
        </Button>
      </div>
    </div>
  );
}
