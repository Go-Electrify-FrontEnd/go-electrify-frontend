"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId, UIMessage } from "ai";
import { Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import type { Chat } from "@/lib/chat-store";
import { ChatHeader } from "./chat-header";
import { ChatHistoryList } from "./chat-history-list";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

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

  useEffect(() => {
    if (isOpen && !showHistory) {
      loadChatHistory();
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/chats");
      if (response.ok) {
        const chats = await response.json();
        setChatHistory(chats);
      }
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
        const response = await fetch(`/api/chats/${chat.id}`);
        if (response.ok) {
          fullChat = await response.json();

          setCurrentChatId(fullChat.id);
          setInitialMessages(fullChat.messages);
          setMessages(fullChat.messages);

          setShowHistory(false);
          setInput("");
          console.log("[ChatPopup] Chat loaded successfully");
        }
      }
    } catch (error) {
      console.error("[ChatPopup] Failed to load chat:", error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      setChatHistory((prev) => prev.filter((c) => c.id !== chatId));

      if (chatId === currentChatId) {
        handleNewChat();
      }
    } catch (error) {
      console.error("[ChatPopup] Failed to delete chat:", error);
      throw error;
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
        <ChatHeader
          status={status === "streaming" ? "streaming" : "ready"}
          isCreatingNewChat={isCreatingNewChat}
          showHistory={showHistory}
          onToggleHistory={() => {
            setShowHistory(!showHistory);
            if (!showHistory) {
              loadChatHistory();
            }
          }}
          onNewChat={handleNewChat}
          onClose={() => setIsOpen(false)}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          {showHistory ? (
            <ChatHistoryList
              chatHistory={chatHistory}
              currentChatId={currentChatId}
              isLoadingHistory={isLoadingHistory}
              onLoadChat={loadExistingChat}
              onDeleteChat={handleDeleteChat}
            />
          ) : (
            <>
              <ChatMessages
                messages={messages}
                status={status === "streaming" ? "streaming" : "ready"}
              />
              <ChatInput
                input={input}
                status={status === "streaming" ? "streaming" : "ready"}
                onInputChange={setInput}
                onSubmit={handleSubmit}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
