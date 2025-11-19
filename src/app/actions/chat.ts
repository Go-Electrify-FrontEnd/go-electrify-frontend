"use server";

import { getAuthenticatedUser } from "@/lib/auth/api-auth-helper";
import { getChats, loadChat, deleteChat, Chat } from "@/lib/chat-store";

export async function getChatsAction(): Promise<Chat[]> {
  const user = await getAuthenticatedUser();
  if (!user) return [];
  return getChats(user.email);
}

export async function loadChatAction(id: string): Promise<Chat | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;
  return loadChat(id, user.email);
}

export async function deleteChatAction(id: string): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) return;
  await deleteChat(id, user.email);
}
