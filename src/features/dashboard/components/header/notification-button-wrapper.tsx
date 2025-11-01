// components/dashboard/header/notification-button-wrapper.tsx
// Server Component - fetch notifications và pass vào NotificationButton

import { getUser } from "@/lib/auth/auth-server";
import { Notification } from "@/types/notification";
import { NotificationButton } from "./notification-button";

async function getRecentNotifications(token: string): Promise<Notification[]> {
  try {
    const url = "https://api.go-electrify.com/api/v1/notifications/dashboard";
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
      console.error("Failed to fetch notifications:", response.status);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data.items)) {
      console.error("API response is not an array");
      return [];
    }

    // Map và lấy 10 notifications gần nhất
    const notifications: Notification[] = data.items
      .map((item: any) => ({
        Id: item.Id || item.id || "",
        Title: item.Title || "",
        Message: item.Message || "",
        Type: item.Type || "booking",
        Severity: item.Severity || "LOW",
        CreatedAt: item.CreatedAt || new Date().toISOString(),
        IsNew: item.IsNew !== undefined ? item.IsNew : false,
      }))
      .slice(0, 10); // Chỉ lấy 10 cái gần nhất cho header

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function NotificationButtonWrapper() {
  const { user, token } = await getUser();

  if (!user) {
    return null;
  }

  const notifications = await getRecentNotifications(token);

  return <NotificationButton notifications={notifications} />;
}

// Sử dụng trong layout hoặc header:
// <Suspense fallback={<NotificationButtonSkeleton />}>
//   <NotificationButtonWrapper />
// </Suspense>
