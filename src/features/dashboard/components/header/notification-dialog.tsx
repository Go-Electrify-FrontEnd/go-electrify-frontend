// components/dashboard/header/notification-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Notification } from "@/features/dashboard/types/notification";
import { Bell, Bookmark, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/formatters";

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
    case "booking":
      return "Đặt phòng";
    case "user":
      return "Người dùng";
    default:
      return "Thông báo";
  }
}

export function NotificationDialog({
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
                  {formatRelativeTime(notification.CreatedAt)}
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
