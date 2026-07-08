package com.bok.transaction.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Component
public class AccountClient {

    private final RestClient restClient;

    public AccountClient(@Value("${services.account.base-url}") String accountServiceUrl) {
        this.restClient = RestClient.builder().baseUrl(accountServiceUrl).build();
    }

    public void debit(String accountNumber, BigDecimal amount, String authHeader) {
        restClient.post()
                .uri("/api/accounts/{accountNumber}/debit", accountNumber)
                .header("Authorization", authHeader)
                .body(amount)
                .retrieve()
                .toBodilessEntity();
    }

    public void credit(String accountNumber, BigDecimal amount, String authHeader) {
        restClient.post()
                .uri("/api/accounts/{accountNumber}/credit", accountNumber)
                .header("Authorization", authHeader)
                .body(amount)
                .retrieve()
                .toBodilessEntity();
    }

    public UUID getUserId(String accountNumber, String authHeader) {
        return restClient.get()
                .uri("/api/accounts/{accountNumber}", accountNumber)
                .header("Authorization", authHeader)
                .retrieve()
                .body(AccountResponse.class)
                .userId();
    }

    public BigDecimal checkCurrency(String senderAccountNumber, String receiverAccountNumber, BigDecimal amount, String authHeader) {
        Map<String, Object> request = Map.of(
                "senderAccountNumber", senderAccountNumber,
                "receiverAccountNumber", receiverAccountNumber,
                "amount", amount
        );

        return restClient.post()
                .uri("/api/accounts/currency")
                .header("Authorization", authHeader)
                .body(request)
                .retrieve()
                .body(BigDecimal.class);
    }



}

