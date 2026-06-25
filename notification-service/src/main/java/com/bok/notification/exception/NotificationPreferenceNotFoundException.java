package com.bok.notification.exception;

public class NotificationPreferenceNotFoundException extends RuntimeException {
    public NotificationPreferenceNotFoundException() {
        super("Notification preference not found");
    }
    
}
