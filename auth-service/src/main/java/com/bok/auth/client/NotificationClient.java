package com.bok.auth.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class NotificationClient {

    private final RestClient restClient;

    public NotificationClient(@Value("${services.notification.base-url}") String notificationServiceUrl) {
        this.restClient = RestClient.builder().baseUrl(notificationServiceUrl).build();
    }


    public void sendLoginNotification(UUID userId, String message) {
        createNotification(userId, "EMAIL", "Account Activity", message, false, "LOGIN_SUCCESS");
    }

    public void sendRegisterNotification(UUID userId, String message) {
        createNotification(userId, "EMAIL", "Account Activity", message, false, "REGISTER_SUCCESS");
    }

    private void createNotification(UUID userId, String channel, String title,
                                 String message, boolean isRead, String eventType) {
        if (userId == null) {
            return;
        }

        Map<String, Object> notification = new HashMap<>();
        notification.put("userId", userId);
        notification.put("channel", channel);
        notification.put("title", title);
        notification.put("message", message);
        notification.put("eventType", eventType);

        restClient.post()
                .uri("/api/notifications")
                .body(notification)
                .retrieve()
                .toBodilessEntity();
    }
}

