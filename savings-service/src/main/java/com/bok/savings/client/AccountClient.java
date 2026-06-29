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

    public BigDecimal getBalance(UUID accountId) {
        return restClient.get()
                .uri("/api/accounts/{id}", accountId)
                .retrieve()
                .body(AccountResponse.class)
                .balance();
    }

    public void debit(UUID accountId, BigDecimal amount) {
        restClient.post()
                .uri("/api/accounts/{id}/debit", accountId)
                .body(amount)
                .retrieve()
                .toBodilessEntity();
    }

    public void credit(UUID accountId, BigDecimal amount) {
        restClient.post()
                .uri("/api/accounts/{id}/credit", accountId)
                .body(amount)
                .retrieve()
                .toBodilessEntity();
    }
}