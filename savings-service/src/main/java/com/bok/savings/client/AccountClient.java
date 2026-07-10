package com.bok.savings.client;

import com.bok.savings.exception.DownstreamException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

@Component
public class AccountClient {


    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public AccountClient(@Value("${services.account.base-url}") String accountServiceUrl, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(accountServiceUrl)
                .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {
                    throw new DownstreamException(response.getStatusCode().value(), extractMessage(response));
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
        return "Account service request failed (" + response.getStatusCode().value() + ")";
    }

    public void debit(String accountNumber, BigDecimal amount, String description, String authHeader) {
        var req = restClient.post()
                .uri("/api/accounts/{accountNumber}/debit", accountNumber);
        if (authHeader != null) req = req.header("Authorization", authHeader);
        req.body(Map.of("amount", amount, "description", description)).retrieve().toBodilessEntity();
    }

    public void credit(String accountNumber, BigDecimal amount, String description, String authHeader) {
        var req = restClient.post()
                .uri("/api/accounts/{accountNumber}/credit", accountNumber);
        if (authHeader != null) req = req.header("Authorization", authHeader);
        req.body(Map.of("amount", amount, "description", description)).retrieve().toBodilessEntity();
    }

    public UUID getUserId(String accountNumber, String authHeader) {
        var req = restClient.get().uri("/api/accounts/{accountNumber}", accountNumber);
        if (authHeader != null) req = req.header("Authorization", authHeader);
        return req.retrieve().body(AccountResponse.class).userId();
    }

    public AccountResponse getAccount(String accountNumber, String authHeader) {
        var req = restClient.get().uri("/api/accounts/{accountNumber}", accountNumber);
        if (authHeader != null) req = req.header("Authorization", authHeader);
        return req.retrieve().body(AccountResponse.class);
    }
}