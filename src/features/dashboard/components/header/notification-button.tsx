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
import { useState } from "react";
import { NotificationDialog } from "./notification-dialog";
import { useUser } from "@/features/users/contexts/user-context";

function getNotificationIcon(type: string) {
  switch (type) {
    case "booking":
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
}: {
  notification: Notification;
  onClick: () => void;
}) {
  return (
    <div
      className="hover:bg-accent flex cursor-pointer gap-3 p-4 transition-colors"
      onClick={onClick}
    >
      <div className="mt-1">{getNotificationIcon(notification.Type)}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm leading-none font-medium">{notification.Title}</p>
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

  // ✅ Khi load lần đầu, gán mặc định isNew = true nếu API chưa có field này
  const [notifications, setNotifications] = useState(
    initialNotifications.map((n) => ({
      ...n,
      isNew: n.isNew ?? true,
    })),
  );

  // 🔹 Giữ tất cả thông báo (không mất khi mở)
  const recentNotifications = notifications.slice(0, 10);
  const unreadCount = notifications.filter((n) => n.isNew).length;

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    setIsPopoverOpen(false);

    // 🔹 Đánh dấu 1 thông báo là đã đọc (local)
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isNew: false } : n)),
    );

    // 🔹 Gọi API backend (nếu có)
    try {
      await fetch(
        `https://api.go-electrify.com/api/v1/notifications/${notification.id}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      console.error("Mark notification as read failed", err);
    }

    // 🔹 Làm mới nhẹ để đồng bộ backend
    setTimeout(() => {
      router.refresh();
    }, 500);
  };

  const handleViewAll = () => {
    setIsPopoverOpen(false);
    router.push("/dashboard/notifications");
  };

  const triggerButton = (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
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
          >
            Xem tất cả thông báo
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
