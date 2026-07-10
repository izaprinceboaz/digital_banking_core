package com.bok.notification.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class AuthClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public AuthClient(@Value("${services.auth.base-url}") String authServiceUrl, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(authServiceUrl)
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
        return "Auth service request failed (" + response.getStatusCode().value() + ")";
    }

    public String getUserEmail(UUID userId) {
        UserResponse user = restClient.get()
                .uri("/api/users/{id}", userId)
                .retrieve()
                .body(UserResponse.class);
        return user.email();
    }
}
