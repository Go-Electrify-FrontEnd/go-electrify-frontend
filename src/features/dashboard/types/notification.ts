export interface Notification {
  Id: string;
  Title: string;
  Message: string;
  Type: string;
  Severity?: "LOW" | "HIGH";
  CreatedAt: string;
  IsNew: boolean;
  IsUnread: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface MarkAsReadResponse {
  message?: string;
  success?: boolean;
}
