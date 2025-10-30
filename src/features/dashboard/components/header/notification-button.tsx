"use client";

import { Bell, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { NotificationPopoverWrapper } from "./notification-popover-wrapper";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NotificationDialog } from "./notification-dialog";
import { useUser } from "@/features/users/contexts/user-context";

function getNotificationIcon(type: string) {
  switch (type) {
    case "booking":
    case "booking_confirmed":
    case "booking_deposit_succeeded":
    case "booking_canceled":
      return <Bookmark className="h-4 w-4 text-blue-500" />;
    case "user":
      return <User className="h-4 w-4 text-green-500" />;
    default:
      return <Bell className="h-4 w-4" />;
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

function NotificationItem({
  notification,
  onClick,
  isUnread,
}: {
  notification: Notification;
  onClick: () => void;
  isUnread: boolean;
}) {
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
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  // Sync với server data khi initialNotifications thay đổi
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const recentNotifications = notifications.slice(0, 10);
  const unreadCount = notifications.filter((n) => n.IsNew).length;

  // Mark single notification as read
  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    setIsPopoverOpen(false);

    // Only mark as read if it's unread
    if (notification.IsNew) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, IsNew: false } : n,
        ),
      );

      try {
        const response = await fetch(
          `https://api.go-electrify.com/api/v1/notifications/${notification.id}/read`,
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
          // Revert on error
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, IsNew: true } : n,
            ),
          );
        }
      } catch (err) {
        console.error("Mark notification as read failed", err);
        // Revert on error
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, IsNew: true } : n,
          ),
        );
      }
    }
  };

  // Mark all as read and navigate to notifications page
  const handleViewAll = async () => {
    setIsPopoverOpen(false);

    // Nếu có thông báo chưa đọc, gọi API mark all
    if (unreadCount > 0) {
      setIsMarkingAllRead(true);

      // Optimistic update - mark all as read locally
      setNotifications((prev) => prev.map((n) => ({ ...n, IsNew: false })));

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

        if (!response.ok) {
          console.error("Failed to mark all as read");
          // Revert on error - restore original IsNew states
          setNotifications(initialNotifications);
        }
      } catch (err) {
        console.error("Mark all as read failed", err);
        // Revert on error
        setNotifications(initialNotifications);
      } finally {
        setIsMarkingAllRead(false);
      }
    }

    // Navigate to notifications page
    router.push("/dashboard/notifications");
  };

  const triggerButton = (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
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
            {recentNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.id || index}
                notification={notification}
                isUnread={notification.IsNew}
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
