"use client";

import { useState, useEffect, useCallback } from "react";
import { Notification } from "@/types/notification";
import { Bell, Bookmark, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/users/contexts/user-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function getNotificationIcon(type: string) {
  switch (type) {
    case "booking_confirmed":
    case "booking_deposit_succeeded":
    case "booking_canceled":
      return <Bookmark className="h-5 w-5 text-blue-500" />;
    case "user":
      return <User className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

function getNotificationTypeName(type: string) {
  switch (type) {
    case "booking_confirmed":
      return "Đặt phòng xác nhận";
    case "booking_deposit_succeeded":
      return "Đặt cọc thành công";
    case "booking_canceled":
      return "Hủy đặt phòng";
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
  } catch {
    return dateString;
  }
}

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
  } catch {
    return dateString;
  }
}

function NotificationDialog({
  notification,
  open,
  onOpenChange,
}: {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              {getNotificationIcon(notification.Type)}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">
                {notification.Title}
              </DialogTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {getNotificationTypeName(notification.Type)}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {formatDate(notification.CreatedAt)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogDescription className="pt-4 text-left whitespace-pre-wrap">
          {notification.Message}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export function NotificationsPageClient({
  notifications: initialNotifications,
}: {
  notifications: Notification[];
}) {
  const router = useRouter();
  const { token } = useUser();

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync với server data
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const unreadCount = notifications.filter((n) => n.IsNew).length;

  // Mark single notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `https://api.go-electrify.com/api/v1/notifications/${notificationId}/read`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const success = response.status === 204 || response.status === 200;

        if (!success) {
          console.error(`[Mark Read Failed] Status: ${response.status}`);
        }

        return success;
      } catch (err) {
        console.error("[Mark Read Error]", err);
        return false;
      }
    },
    [token],
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.go-electrify.com/api/v1/notifications/read-all",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const success = response.status === 204 || response.status === 200;

      if (!success) {
        console.error(`[Mark All Failed] Status: ${response.status}`);
      }

      return success;
    } catch (err) {
      console.error("[Mark All Error]", err);
      return false;
    }
  }, [token]);

  // Handle notification click
  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      setSelectedNotification(notification);

      if (!notification.IsNew) return;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.Id === notification.Id ? { ...n, IsNew: false } : n,
        ),
      );

      const success = await markAsRead(notification.Id);

      if (success) {
        setTimeout(() => router.refresh(), 100);
      } else {
        // Revert nếu thất bại
        setNotifications((prev) =>
          prev.map((n) =>
            n.Id === notification.Id ? { ...n, IsNew: true } : n,
          ),
        );
      }
    },
    [markAsRead, router],
  );

  // Handle mark all as read
  const handleMarkAllAsRead = useCallback(async () => {
    if (unreadCount === 0 || isProcessing) return;

    setIsProcessing(true);

    // Lưu state ban đầu
    const previousNotifications = notifications;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, IsNew: false })));

    const success = await markAllAsRead();

    if (success) {
      setTimeout(() => router.refresh(), 100);
    } else {
      // Revert nếu thất bại
      setNotifications(previousNotifications);
    }

    setIsProcessing(false);
  }, [unreadCount, isProcessing, notifications, markAllAsRead, router]);

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
              {notifications.length > 0 ? (
                <>
                  {notifications.length} thông báo
                  {unreadCount > 0 && ` • ${unreadCount} chưa đọc`}
                </>
              ) : (
                "Không có thông báo nào"
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
            </Button>
          )}
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
          {notifications.map((notification) => (
            <Card
              key={notification.Id}
              className={`hover:bg-accent cursor-pointer p-4 transition-colors ${
                notification.IsNew
                  ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                  : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex gap-4">
                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  {getNotificationIcon(notification.Type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`leading-tight ${
                          notification.IsNew ? "font-bold" : "font-semibold"
                        }`}
                      >
                        {notification.Title}
                      </h3>
                      {notification.IsNew && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
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
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getNotificationTypeName(notification.Type)}
                    </Badge>
                    {notification.Severity && (
                      <Badge
                        variant={
                          notification.Severity === "HIGH"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {notification.Severity}
                      </Badge>
                    )}
                  </div>
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
