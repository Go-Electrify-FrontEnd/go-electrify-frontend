"use client";

import { Bell, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/features/dashboard/types/notification";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { NotificationPopoverWrapper } from "./notification-popover-wrapper";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { NotificationDialog } from "./notification-dialog";
import { useUser } from "@/features/users/contexts/user-context";
import { API_BASE_URL } from "@/lib/api-config";

function getNotificationIcon(type: string) {
  switch (type) {
    case "booking_confirmed":
    case "booking_deposit_succeeded":
    case "booking_canceled":
      return <Bookmark className="h-4 w-4 text-blue-500" />;
    case "user":
      return <User className="h-4 w-4 text-green-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
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

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  isUnread: boolean;
}

function NotificationItem({
  notification,
  onClick,
  isUnread,
}: NotificationItemProps) {
  return (
    <div
      className={`hover:bg-accent flex cursor-pointer gap-3 p-4 transition-colors ${
        isUnread ? "bg-blue-50/50" : ""
      }`}
      onClick={onClick}
    >
      <div className="mt-1">{getNotificationIcon(notification.Type)}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm leading-none ${isUnread ? "font-semibold" : "font-medium"}`}
          >
            {notification.Title}
          </p>
          {isUnread && (
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {notification.Message}
        </p>
        <p className="text-muted-foreground text-xs">
          {formatDate(notification.CreatedAt)}
        </p>
      </div>
    </div>
  );
}

export function NotificationButton({
  notifications: initialNotifications,
}: {
  notifications: Notification[];
}) {
  const router = useRouter();
  const { token } = useUser();
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  // Sync với server data khi initialNotifications thay đổi
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const recentNotifications = notifications.slice(0, 10);
  const unreadCount = notifications.filter((n) => n.IsUnread).length;

  // Mark single notification as read
  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      setSelectedNotification(notification);
      setIsPopoverOpen(false);

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
          console.error("Failed to mark notification as read");
          // Revert CHỈ notification này nếu lỗi
          setNotifications((prev) =>
            prev.map((n) =>
              n.Id === notification.Id ? { ...n, IsUnread: true } : n,
            ),
          );
        }

        // Thêm router.refresh() ở đây để đồng bộ với trang /notifications
        router.refresh();
      } catch (err) {
        console.error("Mark notification as read failed", err);
        // Revert CHỈ notification này nếu lỗi
        setNotifications((prev) =>
          prev.map((n) =>
            n.Id === notification.Id ? { ...n, IsUnread: true } : n,
          ),
        );
      }
    },
    [token, router],
  );

  // Mark all as read and navigate
  const handleViewAll = useCallback(async () => {
    setIsPopoverOpen(false);
    router.push("/dashboard/notifications");
    // if (unreadCount === 0) {
    //   router.push("/dashboard/notifications");
    //   return;
    // }

    setIsMarkingAllRead(true);

    // Optimistic update cho mượt
    // setNotifications((prev) => prev.map((n) => ({ ...n, IsUnread: false })));

    // try {
    //   const unreadIds = initialNotifications
    //     .filter((n) => n.IsUnread)
    //     .map((n) => n.Id);

    //   if (unreadIds.length === 0) {
    //     throw new Error("State bị lệch, không tìm thấy unread IDs.");
    //   }

    //   const readPromises = unreadIds.map((id) =>
    //     fetch(`https://api.go-electrify.com/api/v1/notifications/${id}/read`, {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }),
    //   );

    //   const results = await Promise.allSettled(readPromises);

    //   const failedRequests = results.filter((r) => r.status === "rejected");
    //   if (failedRequests.length > 0) {
    //     console.error("Một số request 'read' đã thất bại:", failedRequests);
    //     throw new Error("Một số request con thất bại.");
    //   }
    // } catch (err) {
    //   console.error("Lỗi khi gọi nhiều API 'read':", err);
    //   setNotifications(initialNotifications);
    // } finally {
    //   setIsMarkingAllRead(false);
    //   router.push("/dashboard/notifications");
    //   router.refresh();
    // }
  }, [router, unreadCount, token, initialNotifications]);

  const triggerButton = (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );

  const popoverContent = (
    <>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold">Thông báo</h3>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {unreadCount} mới
          </Badge>
        )}
      </div>
      <ScrollArea className="h-[400px]">
        {recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="text-muted-foreground/50 mb-2 h-12 w-12" />
            <p className="text-muted-foreground text-sm">
              Không có thông báo mới
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification.Id}
                notification={notification}
                isUnread={notification.IsUnread}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
      {recentNotifications.length > 0 && (
        <div className="border-t p-2">
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={handleViewAll}
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? "Đang xử lý..." : "Xem tất cả thông báo"}
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      <NotificationPopoverWrapper
        trigger={triggerButton}
        content={popoverContent}
        isOpen={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      />

      <NotificationDialog
        notification={selectedNotification}
        open={!!selectedNotification}
        onOpenChange={(open) => !open && setSelectedNotification(null)}
      />
    </>
  );
}
