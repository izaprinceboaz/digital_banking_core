import api from "./api";
import type { NotificationResponse } from "../types/notification";

// notification-service — NotificationController (/api/notifications)

export async function getMyNotifications(): Promise<NotificationResponse[]> {
  const res = await api.get<NotificationResponse[]>(
    `/api/notifications/my-notifications`
  );
  return res.data;
}

export async function getNotificationById(id: string): Promise<NotificationResponse> {
  const res = await api.get<NotificationResponse>(`/api/notifications/${id}`);
  return res.data;
}

export async function deleteNotification(id: string): Promise<void> {
  await api.delete(`/api/notifications/${id}`);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await api.patch(`/api/notifications/${id}/mark-as-read`);
}
