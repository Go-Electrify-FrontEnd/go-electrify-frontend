import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/api-auth-helper";
import { loadChat, deleteChat } from "@/lib/chat-store";

/**
 * GET /api/chats/[id]
 * Load a specific chat by ID
 */
export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/chats/[id]">,
) {
  const { id } = await ctx.params;
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chat = await loadChat(id, user.email);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/chats/${id}] Error loading chat:`, error);
    return NextResponse.json({ error: "Failed to load chat" }, { status: 500 });
  }
}

/**
 * DELETE /api/chats/[id]
 * Delete a specific chat by ID
 */
export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/chats/[id]">,
) {
  const { id } = await ctx.params;
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteChat(id, user.email);

    return NextResponse.json(
      { success: true, message: "Chat deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`[DELETE /api/chats/${id}] Error deleting chat:`, error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 },
    );
  }
}
