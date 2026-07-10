package com.bok.account.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class NotificationClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public NotificationClient(@Value("${services.notification.base-url}") String notificationServiceUrl, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(notificationServiceUrl)
                .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {
                    throw new RuntimeException(extractMessage(response));
                })
                .build();
    }

    // Pulls the {"message": ...} from the downstream error body so callers see the real reason.
    private String extractMessage(ClientHttpResponse response) throws IOException {
        String body = new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8);
        if (!body.isBlank()) {
            try {
                JsonNode node = objectMapper.readTree(body);
                if (node.hasNonNull("message")) return node.get("message").asText();
            } catch (Exception ignored) {
                // not JSON — fall through to the generic message
            }
        }
        return "Notification service request failed (" + response.getStatusCode().value() + ")";
    }


    public void sendCreditNotification(UUID userId, String message) {
        createNotification(userId, "EMAIL", "Transaction Update", message, false, "CREDIT_COMPLETED");
    }

    public void sendDebitNotification(UUID userId, String message) {
        createNotification(userId, "EMAIL", "Transaction Update", message, false, "DEBIT_COMPLETED");
    }

    public void sendStatusNotification(UUID userId, String message) {
        createNotification(userId, "EMAIL", "Account Status Update", message, false, "STATUS_UPDATED");
    }

    public void sendUpdateBalanceNotification(UUID userId, String message) {
        createNotification(userId, "EMAIL", "Account Balance Update", message, false, "BALANCE_UPDATED");
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

