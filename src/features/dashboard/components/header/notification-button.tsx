"use client";

import { Bell, Bookmark, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/features/users/contexts/user-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
      return <Bookmark className="h-4 w-4 text-blue-500" />;
    case "user":
      return <User className="h-4 w-4 text-green-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
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

  // Sync với server data
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const recentNotifications = notifications.slice(0, 10);
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

        // 204 No Content = Success
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

  // Handle notification click
  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      setSelectedNotification(notification);
      setIsPopoverOpen(false);

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

  // Mark all as read and navigate
  const handleViewAll = useCallback(async () => {
    setIsPopoverOpen(false);
    router.push("/dashboard/notifications");

    if (unreadCount === 0) return;

    // Optimistic update
    const previousNotifications = notifications;
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

      const success = response.status === 204 || response.status === 200;

      if (success) {
        setTimeout(() => router.refresh(), 100);
      } else {
        setNotifications(previousNotifications);
      }
    } catch (err) {
      console.error("[Mark All Read Error]", err);
      setNotifications(previousNotifications);
    }
  }, [unreadCount, notifications, token, router]);

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-10 w-10" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 flex h-3 w-3 justify-center rounded-full p-0"
              ></Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
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
                className="w-full justify-between text-sm"
                onClick={handleViewAll}
              >
                Xem tất cả thông báo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <NotificationDialog
        notification={selectedNotification}
        open={!!selectedNotification}
        onOpenChange={(open) => !open && setSelectedNotification(null)}
      />
    </>
  );
}
