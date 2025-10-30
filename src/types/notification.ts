// types/notification.ts
export interface Notification {
  id: string;
  Title: string;
  Message: string;
  Type:
    | "booking"
    | "user"
    | "booking_confirmed"
    | "booking_deposit_succeeded"
    | "booking_canceled";
  Severity?: "LOW" | "HIGH";
  CreatedAt: string;
  IsNew: boolean; // Changed from isNew to match API response
}
export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
export interface MarkAsReadResponse {
  message?: string;
  success?: boolean;
}
