import { generateId, UIMessage } from "ai";
import { redis } from "@/lib/redis";

const CHAT_KEY_PREFIX = "chat:";
const CHAT_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Create a new chat session and store it in Redis
 * @returns The unique chat ID
 */
export async function createChat(): Promise<string> {
  const id = generateId();
  return id;
}

/**
 * Load chat messages from Redis
 * @param id - The chat session ID
 * @returns Array of chat messages
 */
export async function loadChat(id: string): Promise<UIMessage[]> {
  const key = getChatKey(id);
  const data = await redis.get(key);

  if (!data) {
    // Chat doesn't exist or expired, return empty array
    return [];
  }

  try {
    // Handle both string and already-parsed array from Upstash Redis
    if (typeof data === "string") {
      return JSON.parse(data);
    } else if (Array.isArray(data)) {
      return data as UIMessage[];
    }
    // Invalid type, delete and return empty
    await redis.del(key);
    return [];
  } catch (error) {
    await redis.del(key);
    return [];
  }
}

// Load nearest chat or create new one
export async function loadNearestChat(
  userId: string,
): Promise<{ chatId: string; messages: UIMessage[] }> {
  const pattern = `${CHAT_KEY_PREFIX}${userId}:*`;
  const keys = await redis.keys(pattern);

  if (keys.length === 0) {
    console.log(
      `[loadNearestChat] No chats found for user: ${userId}, creating new chat ID`,
    );
    const newChatId = generateId();
    return { chatId: newChatId, messages: [] };
  }

  // Assuming the latest chat is the one with the highest lexicographical order
  keys.sort();
  const latestKey = keys[keys.length - 1];

  // Extract chat ID from key pattern: "chat:userId:chatId"
  const chatId = latestKey.split(":")[2];

  const data = await redis.get(latestKey);

  console.log(
    `[loadNearestChat] Loaded chat from key: ${latestKey}, chatId: ${chatId}`,
  );
  if (!data) {
    return { chatId, messages: [] };
  }

  console.log(
    `[loadNearestChat] Data type: ${typeof data}, isArray: ${Array.isArray(data)}`,
  );

  try {
    // Handle both string and already-parsed array from Upstash Redis
    if (typeof data === "string") {
      console.log(
        `[loadNearestChat] Parsing string data (length: ${data.length})`,
      );
      const messages: UIMessage[] = JSON.parse(data);
      return { chatId, messages };
    } else if (Array.isArray(data)) {
      console.log(
        `[loadNearestChat] Data already deserialized as array with ${data.length} messages`,
      );
      return { chatId, messages: data as UIMessage[] };
    } else {
      console.error(
        `[loadNearestChat] Invalid data type: ${typeof data}, deleting corrupted data`,
      );
      await redis.del(latestKey);
      return { chatId, messages: [] };
    }
  } catch (error) {
    console.log(
      `[loadNearestChat] Failed to process chat data for key: ${latestKey}`,
      error,
    );
    await redis.del(latestKey);
    return { chatId, messages: [] };
  }
}

/**
 * Load user-specific chat
 * @param userId - The user ID
 * @param chatId - The chat session ID
 * @returns Array of chat messages
 */
export async function loadUserChat(
  userId: string,
  chatId: string,
): Promise<UIMessage[]> {
  const key = getUserChatKey(userId, chatId);
  console.log(`[loadUserChat] Loading chat with key: ${key}`);

  // Upstash Redis automatically deserializes JSON, so we might get either:
  // - A string (if JSON parsing failed on their side)
  // - An already-parsed array (if JSON parsing succeeded)
  const data = await redis.get(key);

  if (!data) {
    console.log(`[loadUserChat] No data found for key: ${key}`);
    return [];
  }

  console.log(
    `[loadUserChat] Data type: ${typeof data}, isArray: ${Array.isArray(data)}`,
  );

  try {
    // Handle both string and already-parsed array from Upstash Redis
    if (typeof data === "string") {
      console.log(
        `[loadUserChat] Parsing string data (length: ${data.length})`,
      );
      return JSON.parse(data);
    } else if (Array.isArray(data)) {
      console.log(
        `[loadUserChat] Data already deserialized as array with ${data.length} messages`,
      );
      return data as UIMessage[];
    } else {
      console.error(
        `[loadUserChat] Invalid data type: ${typeof data}, deleting corrupted data`,
      );
      await redis.del(key);
      return [];
    }
  } catch (error) {
    console.error(
      `[loadUserChat] Error processing data for key ${key}:`,
      error instanceof Error ? error.message : error,
    );
    await redis.del(key);
    return [];
  }
}

/**
 * Save user-specific chat
 * @param userId - The user ID
 * @param chatId - The chat session ID
 * @param messages - Array of messages to save
 */
export async function saveUserChat(
  userId: string,
  chatId: string,
  messages: UIMessage[],
): Promise<void> {
  const key = getUserChatKey(userId, chatId);
  console.log(
    `[saveUserChat] Saving ${messages.length} messages to key: ${key}`,
  );

  await redis.setex(key, CHAT_TTL, JSON.stringify(messages));
  console.log(`[saveUserChat] Successfully saved messages to Redis`);
}

// Helper functions
function getChatKey(id: string): string {
  return `${CHAT_KEY_PREFIX}${id}`;
}

function getUserChatKey(userId: string, chatId: string): string {
  return `${CHAT_KEY_PREFIX}${userId}:${chatId}`;
}
