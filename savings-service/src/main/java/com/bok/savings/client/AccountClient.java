package com.bok.savings.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class AccountClient {


    private final RestClient restClient;

    public AccountClient(@Value("${services.account.base-url}") String accountServiceUrl) {
        this.restClient = RestClient.builder().baseUrl(accountServiceUrl).build();
    }

    public void debit(String accountNumber, BigDecimal amount, String authHeader) {
        var req = restClient.post()
                .uri("/api/accounts/{accountNumber}/debit", accountNumber);
        if (authHeader != null) req = req.header("Authorization", authHeader);
        req.body(amount).retrieve().toBodilessEntity();
    }

    public void credit(String accountNumber, BigDecimal amount, String authHeader) {
        var req = restClient.post()
                .uri("/api/accounts/{accountNumber}/credit", accountNumber);
        if (authHeader != null) req = req.header("Authorization", authHeader);
        req.body(amount).retrieve().toBodilessEntity();
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