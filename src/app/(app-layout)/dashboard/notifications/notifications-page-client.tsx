"use client";

import { useState, useEffect, useCallback } from "react";
import { Notification } from "@/features/dashboard/types/notification";
import { Bell, Bookmark, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { NotificationDialog } from "@/features/dashboard/components/header/notification-dialog";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/users/contexts/user-context";
import { API_BASE_URL } from "@/lib/api-config";
import { formatFullDate, formatRelativeTime } from "@/lib/formatters";

function getNotificationIcon(type: string) {
  switch (type) {
    case "booking_confirmed":
    case "booking_deposit_succeeded":
    case "booking_canceled":
      //   return <Bookmark className="text-primary h-5 w-5" />;
      // case "user":
      //   return <User className="text-foreground h-5 w-5" />;
      // default:
      return <Bell className="text-muted-foreground h-5 w-5" />;
  }
}

function getNotificationTypeName(type: string) {
  switch (type) {
    case "booking_confirmed":
      return "Đặt xác nhận";
    case "booking_deposit_succeeded":
      return "Đặt cọc thành công";
    case "booking_canceled":
      return "Hủy";
    case "user":
      return "Người dùng";
    default:
      return "Thông báo";
  }
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
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  // Sync với server data khi initialNotifications thay đổi
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const unreadCount = notifications.filter((n) => n.IsUnread).length;

  // Mark notification as read when clicked
  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      setSelectedNotification(notification);

      // Chỉ mark as read nếu notification này chưa đọc
      if (!notification.IsUnread) return;

      // Optimistic update - CHỈ update notification được click
      setNotifications((prev) =>
        prev.map((n) =>
          n.Id === notification.Id ? { ...n, IsUnread: false } : n,
        ),
      );

      try {
        const response = await fetch(
          `${API_BASE_URL}/notifications/${notification.Id}/read`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          console.error(
            "Failed to mark notification as read:",
            response.status,
          );
          // Revert CHỈ notification này nếu lỗi
          setNotifications((prev) =>
            prev.map((n) =>
              n.Id === notification.Id ? { ...n, IsUnread: true } : n,
            ),
          );
        } else {
          // Refresh từ server sau 500ms để đồng bộ data
          setTimeout(() => {
            router.refresh();
          }, 500);
        }
      } catch (err) {
        console.error("Mark notification as read failed:", err);
        // Revert CHỈ notification này nếu lỗi
        setNotifications((prev) =>
          prev.map((n) =>
            n.Id === notification.Id ? { ...n, IsUnread: true } : n,
          ),
        );
      }
    },
    [token],
  );

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    if (unreadCount === 0) return;

    setIsMarkingAllRead(true);

    // Lưu lại state ban đầu để revert nếu cần
    const previousNotifications = notifications;

    // Optimistic update - mark all as read
    setNotifications((prev) => prev.map((n) => ({ ...n, IsUnread: false })));

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to mark all as read:", response.status);
        // Revert về state ban đầu
        setNotifications(previousNotifications);
      } else {
        // Refresh từ server sau khi thành công
        setTimeout(() => {
          router.refresh();
        }, 500);
      }
    } catch (err) {
      console.error("Mark all as read failed:", err);
      // Revert về state ban đầu
      setNotifications(previousNotifications);
    } finally {
      setIsMarkingAllRead(false);
    }
  }, [unreadCount, notifications, token]);

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
              disabled={isMarkingAllRead}
            >
              {isMarkingAllRead ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
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
                notification.IsUnread
                  ? "border-l-primary bg-accent/50 border-l-4"
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
                          notification.IsUnread ? "font-bold" : "font-semibold"
                        }`}
                      >
                        {notification.Title}
                      </h3>
                      {notification.IsUnread && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <span
                      className="text-muted-foreground text-xs whitespace-nowrap"
                      title={formatFullDate(notification.CreatedAt)}
                    >
                      {formatRelativeTime(notification.CreatedAt)}
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
