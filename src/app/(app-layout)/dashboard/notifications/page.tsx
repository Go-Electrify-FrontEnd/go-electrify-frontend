// app/(app-layout)/dashboard/notifications/page.tsx
import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { Notification } from "@/types/notification";
import { NotificationsPageClient } from "./notifications-page-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAllNotifications(token: string): Promise<Notification[]> {
  try {
    const url = "https://api.go-electrify.com/api/v1/notifications";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch notifications:",
        response.status,
        response.statusText,
      );
      return [];
    }

    const data = await response.json();

    // API trả về array trực tiếp
    if (!Array.isArray(data)) {
      console.error("API response is not an array:", data);
      return [];
    }

    // Map data từ API sang Notification type
    const notifications: Notification[] = data.map((item: any) => ({
      Id: item.Id || item.id || "",
      Title: item.Title || "",
      Message: item.Message || "",
      Type: item.Type || "booking",
      Severity: item.Severity || "LOW",
      CreatedAt: item.CreatedAt || new Date().toISOString(),
      IsNew: item.IsNew !== undefined ? item.IsNew : false,
    }));

    return notifications;
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
