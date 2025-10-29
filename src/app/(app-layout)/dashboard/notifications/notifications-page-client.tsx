// app/(app-layout)/dashboard/notifications/notifications-page-client.tsx
"use client";

import { useState } from "react";
import { Notification } from "@/types/notification";
import { Bell, Bookmark, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { NotificationDialog } from "@/features/dashboard/components/header/notification-dialog";
import { useRouter } from "next/navigation";

function getNotificationIcon(type: string) {
  switch (type) {
    case "booking":
      return <Bookmark className="h-5 w-5 text-blue-500" />;
    case "user":
      return <User className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
}

function getNotificationTypeName(type: string) {
  switch (type) {
    case "user":
      return "Người dùng";
    default:
      return "Thông báo";
  }
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  } catch (error) {
    return dateString;
  }
}

// Format date đầy đủ cho tooltip
function formatFullDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

export function NotificationsPageClient({
  notifications,
}: {
  notifications: Notification[];
}) {
  const router = useRouter();
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tất cả thông báo</h1>
            <p className="text-muted-foreground mt-1">
              {notifications.length > 0
                ? `${notifications.length} thông báo`
                : "Không có thông báo nào"}
            </p>
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Bell className="text-muted-foreground/50 mb-4 h-16 w-16" />
            <h3 className="mb-2 text-xl font-semibold">Không có thông báo</h3>
            <p className="text-muted-foreground">
              Bạn sẽ nhận được thông báo khi có hoạt động mới
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <Card
              key={index}
              className="hover:bg-accent cursor-pointer p-4 transition-colors"
              onClick={() => setSelectedNotification(notification)}
            >
              <div className="flex gap-4">
                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  {getNotificationIcon(notification.Type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="leading-tight font-semibold">
                      {notification.Title}
                    </h3>
                    <span
                      className="text-muted-foreground text-xs whitespace-nowrap"
                      title={formatFullDate(notification.CreatedAt)}
                    >
                      {formatDate(notification.CreatedAt)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {notification.Message}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {getNotificationTypeName(notification.Type)}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <NotificationDialog
        notification={selectedNotification}
        open={!!selectedNotification}
        onOpenChange={(open) => !open && setSelectedNotification(null)}
      />
    </div>
  );
}
