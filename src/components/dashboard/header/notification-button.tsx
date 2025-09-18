"use client";

import * as React from "react";
import { Bell, Check, MessageSquare, UserPlus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "reservation",
    title: "Đặt chỗ mới",
    description: "Có một đặt chỗ mới tại Trạm Vincom",
    time: "5 phút trước",
    isRead: false,
    icon: Zap,
  },
  {
    id: 2,
    type: "message",
    title: "Tin nhắn mới",
    description: "Bạn có tin nhắn mới từ khách hàng",
    time: "15 phút trước",
    isRead: false,
    icon: MessageSquare,
  },
  {
    id: 3,
    type: "user",
    title: "Người dùng mới",
    description: "Có người dùng mới đăng ký",
    time: "1 giờ trước",
    isRead: true,
    icon: UserPlus,
  },
  {
    id: 4,
    type: "reservation",
    title: "Hoàn thành sạc",
    description: "Quá trình sạc tại Trạm Landmark81 đã hoàn thành",
    time: "2 giờ trước",
    isRead: true,
    icon: Zap,
  },
];

export function NotificationButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    // In a real app, this would make an API call
    console.log("Marking all notifications as read");
  };

  const handleNotificationClick = (notificationId: number) => {
    // In a real app, this would mark the specific notification as read
    console.log("Notification clicked:", notificationId);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs"
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="text-muted-foreground p-4 text-center text-sm">
            Không có thông báo nào
          </div>
        ) : (
          <div className="max-h-96 overflow-x-hidden overflow-y-auto">
            {notifications.map((notification, index) => {
              const IconComponent = notification.icon;
              return (
                <React.Fragment key={notification.id}>
                  <DropdownMenuItem
                    className="cursor-pointer p-0 focus:bg-transparent"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="hover:bg-accent w-full rounded-md p-3 transition-colors">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div
                            className={`rounded-full p-2 ${
                              notification.type === "reservation"
                                ? "bg-blue-100 text-blue-600"
                                : notification.type === "message"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="truncate text-sm leading-none font-medium">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-xs">
                            {notification.description}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  {index < notifications.length - 1 && (
                    <DropdownMenuSeparator className="my-1" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center text-sm">
          Xem tất cả thông báo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
