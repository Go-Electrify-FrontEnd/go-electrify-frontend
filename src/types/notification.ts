//types/notification.ts
export interface Notification {
  Title: string;
  Message: string;
  Type: "booking" | "user";
  CreatedAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
