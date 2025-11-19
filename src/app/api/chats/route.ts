import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/api-auth-helper";
import { getChats } from "@/lib/chat-store";

/**
 * GET /api/chats
 * Load all chats for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await getChats(user.email);

    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("[GET /api/chats] Error loading chats:", error);
    return NextResponse.json(
      { error: "Failed to load chats" },
      { status: 500 },
    );
  }
}
