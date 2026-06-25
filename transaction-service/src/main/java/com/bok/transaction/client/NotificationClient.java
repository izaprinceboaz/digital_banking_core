package com.bok.transaction.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

@Component
public class NotificationClient {

    private final RestClient restClient;

    public NotificationClient(@Value("${services.notification.base-url}") String notificationServiceUrl) {
        this.restClient = RestClient.builder().baseUrl(notificationServiceUrl).build();
    }


    public void createNotification(UUID userId, String channel, String title,
                                 String message, boolean isRead, String eventType) {
        Map<String, Object> notification = Map.of(
                "account", Map.of("id", userId),
                "channel", channel,
                "title", title,
                "message", message,
                "isRead", isRead,
                "eventType", eventType
        );

        restClient.post()
                .uri("/api/notifications")
                .body(notification)
                .retrieve()
                .toBodilessEntity();
    }
}

