// lib/api/notifications.ts
// SECURE VERSION - Internal server-to-server call
import { Notification } from "@/types/notification";
import { headers } from "next/headers";

export async function getNotifications(): Promise<Notification[]> {
  try {
    // Get the host from headers to build absolute URL
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    // Build internal API URL
    const apiUrl = `${protocol}://${host}/api/notifications`;

    console.log("🔔 Fetching notifications from internal API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        // Forward necessary headers for auth
        ...Object.fromEntries(
          Array.from(headersList.entries()).filter(
            ([key]) => key === "cookie" || key === "authorization",
          ),
        ),
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    console.log("📡 Internal API response:", response.status);

    if (!response.ok) {
      if (response.status === 401) {
        console.error("❌ Unauthorized - user not logged in");
      } else {
        console.error("❌ API error:", response.status);
      }
      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();
    console.log(
      "✅ Notifications received:",
      Array.isArray(data) ? data.length : 0,
    );

    return data || [];
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    // Return empty array instead of throwing - better UX
    return [];
  }
}
