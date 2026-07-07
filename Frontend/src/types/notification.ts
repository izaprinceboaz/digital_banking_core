export interface NotificationResponse {
  id: string;
  userId: string;
  eventType: string;
  channel: string;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string | null;
  createdAt: string;
}
