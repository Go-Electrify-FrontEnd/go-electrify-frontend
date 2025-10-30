// app/(app-layout)/dashboard/notifications/page.tsx
import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { Notification } from "@/types/notification";
import { NotificationsPageClient } from "./notifications-page-client";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Không cache

async function getAllNotifications(token: string): Promise<Notification[]> {
  try {
    const url = "https://api.go-electrify.com/api/v1/notifications";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      next: { revalidate: 0 }, // Force fresh data
    });

    if (!response.ok) {
      console.error("Failed to fetch notifications:", response.statusText);
      return [];
    }

    const data = await response.json();

    // Debug: Log để kiểm tra data từ API
    console.log("API Response:", data);

    // Ensure we return an array and normalize the data
    const notifications = Array.isArray(data) ? data : [];

    return notifications.map((notification: any, index: number) => {
      // Debug: Log từng notification để xem IsNew value
      console.log(`Notification ${index}:`, {
        id: notification.id,
        IsNew: notification.IsNew,
        isNew: notification.isNew,
      });

      return {
        id: notification.id || notification.Id || "",
        Title: notification.Title || "",
        Message: notification.Message || "",
        Type: notification.Type || "booking",
        Severity: notification.Severity,
        CreatedAt: notification.CreatedAt || new Date().toISOString(),
        // Ưu tiên IsNew (uppercase), fallback về isNew (lowercase)
        IsNew:
          notification.IsNew !== undefined
            ? notification.IsNew
            : notification.isNew !== undefined
              ? notification.isNew
              : true,
      };
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export default async function NotificationsPage() {
  const { user, token } = await getUser();

  if (!user) {
    forbidden();
  }

  const notifications = await getAllNotifications(token);

  // Debug: Log final notifications
  console.log("Final notifications count:", notifications.length);
  console.log("Unread count:", notifications.filter((n) => n.IsNew).length);

  return <NotificationsPageClient notifications={notifications} />;
}
