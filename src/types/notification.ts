// types/notification.ts
export interface Notification {
  Id: string; // Đổi từ "id" thành "Id" để khớp với API
  Title: string;
  Message: string;
  Type: string; // "booking_confirmed" | "booking_deposit_succeeded" | "booking_canceled" | etc.
  Severity?: "LOW" | "HIGH";
  CreatedAt: string; // ISO 8601 datetime string
  IsNew: boolean; // true = chưa đọc, false = đã đọc
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface MarkAsReadResponse {
  message?: string;
  success?: boolean;
}
