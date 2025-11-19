import { put, list, del } from "@vercel/blob";
import { UIMessage } from "ai";

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  messages: UIMessage[];
  userId: string;
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: UIMessage[];
  userId: string;
}): Promise<void> {
  // Try to load existing chat to preserve title and creation date
  const existingChat = await loadChat(id, userId);

  let title = existingChat?.title || "New Chat";
  const createdAt = existingChat?.createdAt || Date.now();

  // If it's a new chat or title is default, try to generate from content
  if (!existingChat || title === "New Chat") {
    const firstUserMessage = messages.find((m) => m.role === "user");
    if (firstUserMessage) {
      const fullText = firstUserMessage.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("")
        .trim();

      // Truncate to 60 characters and add ellipsis if needed
      if (fullText.length > 60) {
        title = fullText.substring(0, 60) + "...";
      } else if (fullText.length > 0) {
        title = fullText;
      }
    }
  }

  const chat: Chat = {
    id,
    title,
    createdAt,
    messages,
    userId,
  };

  await put(`chat-messages/${userId}/${id}.json`, JSON.stringify(chat), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true, // Allow overwriting existing chat files
  });
}

export async function loadChat(
  id: string,
  userId: string,
): Promise<Chat | null> {
  try {
    const { blobs } = await list({
      prefix: `chat-messages/${userId}/${id}.json`,
      limit: 1,
    });

    if (blobs.length === 0) {
      return null;
    }

    const response = await fetch(blobs[0].url);
    const chat = await response.json();
    return chat as Chat;
  } catch (error) {
    console.error("Error loading chat:", error);
    return null;
  }
}

export async function getChats(userId: string): Promise<Chat[]> {
  try {
    const { blobs } = await list({
      prefix: `chat-messages/${userId}/`,
    });

    const chats = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.url);
        return (await response.json()) as Chat;
      }),
    );

    return chats.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error getting chats:", error);
    return [];
  }
}

export async function updateChatTitle(
  id: string,
  userId: string,
  newTitle: string,
): Promise<void> {
  try {
    const chat = await loadChat(id, userId);
    if (!chat) return;
    const updatedChat = { ...chat, title: newTitle };
    await put(
      `chat-messages/${userId}/${id}.json`,
      JSON.stringify(updatedChat),
      {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true, // Allow overwriting existing chat files
      },
    );
  } catch (error) {
    console.error("Error updating chat title:", error);
  }
}

export async function deleteChat(id: string, userId: string): Promise<void> {
  try {
    const { blobs } = await list({
      prefix: `chat-messages/${userId}/${id}.json`,
      limit: 1,
    });
    if (blobs.length > 0) {
      await del(blobs[0].url);
    }
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
}
