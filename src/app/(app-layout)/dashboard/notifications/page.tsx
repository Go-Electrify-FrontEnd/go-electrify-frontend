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
      return [];
    }

    const data = await response.json();
    return data || [];
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
