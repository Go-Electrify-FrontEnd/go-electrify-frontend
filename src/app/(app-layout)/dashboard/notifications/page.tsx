// app/(app-layout)/dashboard/notifications/page.tsx
import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { Notification } from "@/types/notification";
import { NotificationsPageClient } from "./notifications-page-client";

export const dynamic = "force-dynamic";

async function getAllNotifications(token: string): Promise<Notification[]> {
  try {
    const url = "https://api.go-electrify.com/api/v1/notifications";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch notifications:", response.statusText);
      return [];
    }

    const data = await response.json();

    // Ensure we return an array and normalize the data
    const notifications = Array.isArray(data) ? data : [];

    return notifications.map((notification: any) => ({
      id: notification.id || notification.Id || "",
      Title: notification.Title || "",
      Message: notification.Message || "",
      Type: notification.Type || "booking",
      Severity: notification.Severity,
      CreatedAt: notification.CreatedAt || new Date().toISOString(),
      IsNew: notification.IsNew ?? notification.isNew ?? true,
    }));
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

  return <NotificationsPageClient notifications={notifications} />;
}
