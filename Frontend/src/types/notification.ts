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

export interface NotificationPreferenceResponse {
  id: string;
  emailEnabled : boolean;
  smsEnabled : boolean;
  inAppEnabled : boolean;
  transactionAlerts : boolean;
  loginAlerts : boolean;
  interestAlerts : boolean;
}

export interface NotificationPreferenceRequest {
  id: string;
  emailEnabled : boolean;
  smsEnabled : boolean;
  inAppEnabled : boolean;
  transactionAlerts : boolean;
  loginAlerts : boolean;
  interestAlerts : boolean;
}