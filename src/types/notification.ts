//types/notification.ts
export interface Notification {
  id: string;
  Title: string;
  Message: string;
  Type: "booking" | "user";
  CreatedAt: string;
  isNew: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
