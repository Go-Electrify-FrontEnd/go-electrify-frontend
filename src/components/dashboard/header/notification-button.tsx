// components/dashboard/header/notification-button.tsx
import { Bell, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { NotificationPopoverWrapper } from "./notification-popover-wrapper";

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

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div className="hover:bg-accent flex gap-3 p-4 transition-colors">
      <div className="mt-1">{getNotificationIcon(notification.Type)}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm leading-none font-medium">{notification.Title}</p>
        <p className="text-muted-foreground text-sm">{notification.Message}</p>
        <p className="text-muted-foreground text-xs">
          {formatDate(notification.CreatedAt)}
        </p>
      </div>
    </div>
  );
}

// Server Component nhận data qua props
export function NotificationButton({
  notifications,
}: {
  notifications: Notification[];
}) {
  const unreadCount = notifications.length;

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
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="text-muted-foreground/50 mb-2 h-12 w-12" />
            <p className="text-muted-foreground text-sm">
              Không có thông báo mới
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))}
          </div>
        )}
      </ScrollArea>
      {notifications.length > 0 && (
        <div className="border-t p-2">
          <Button variant="ghost" className="w-full text-sm">
            Xem tất cả thông báo
          </Button>
        </div>
      )}
    </>
  );

  return (
    <NotificationPopoverWrapper
      trigger={triggerButton}
      content={popoverContent}
    />
  );
}
