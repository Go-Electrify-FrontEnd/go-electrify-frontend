"use client";

import { UIMessage } from "ai";
import { generateId } from "ai";

const CHAT_STORAGE_PREFIX = "chat_";
const CHAT_LIST_KEY = "chat_list";

/**
 * Create a new chat and return its ID
 */
export function createChat(): string {
  const id = generateId();

  // Initialize empty chat messages
  saveChat(id, []);

  // Add to chat list
  const chatList = getChatList();
  chatList.push({
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(chatList));

  return id;
}

/**
 * Load chat messages from local storage
 */
export function loadChat(id: string): UIMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const chatData = localStorage.getItem(`${CHAT_STORAGE_PREFIX}${id}`);
    if (!chatData) return [];

    return JSON.parse(chatData) as UIMessage[];
  } catch (error) {
    console.error("Error loading chat:", error);
    return [];
  }
}

/**
 * Save chat messages to local storage
 */
export function saveChat(id: string, messages: UIMessage[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      `${CHAT_STORAGE_PREFIX}${id}`,
      JSON.stringify(messages)
    );

    // Update the updatedAt timestamp in chat list
    const chatList = getChatList();
    const chatIndex = chatList.findIndex((chat) => chat.id === id);
    if (chatIndex !== -1) {
      chatList[chatIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(chatList));
    }
  } catch (error) {
    console.error("Error saving chat:", error);
  }
}

/**
 * Delete a chat from local storage
 */
export function deleteChat(id: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(`${CHAT_STORAGE_PREFIX}${id}`);

    // Remove from chat list
    const chatList = getChatList();
    const updatedList = chatList.filter((chat) => chat.id !== id);
    localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
}

/**
 * Get list of all chats
 */
export function getChatList(): Array<{
  id: string;
  createdAt: string;
  updatedAt: string;
}> {
  if (typeof window === "undefined") return [];

  try {
    const chatListData = localStorage.getItem(CHAT_LIST_KEY);
    if (!chatListData) return [];

    return JSON.parse(chatListData);
  } catch (error) {
    console.error("Error getting chat list:", error);
    return [];
  }
}

/**
 * Clear all chats from local storage
 */
export function clearAllChats(): void {
  if (typeof window === "undefined") return;

  try {
    const chatList = getChatList();
    chatList.forEach((chat) => {
      localStorage.removeItem(`${CHAT_STORAGE_PREFIX}${chat.id}`);
    });
    localStorage.removeItem(CHAT_LIST_KEY);
  } catch (error) {
    console.error("Error clearing all chats:", error);
  }
}
