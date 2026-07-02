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

    public BigDecimal getBalance(String accountNumber) {
        return restClient.get()
                .uri("/api/accounts/{accountNumber}", accountNumber)
                .retrieve()
                .body(AccountResponse.class)
                .balance();
    }

    public void debit(String accountNumber, BigDecimal amount) {
        restClient.post()
                .uri("/api/accounts/{accountNumber}/debit", accountNumber)
                .body(amount)
                .retrieve()
                .toBodilessEntity();
    }

    public void credit(String accountNumber, BigDecimal amount) {
        restClient.post()
                .uri("/api/accounts/{accountNumber}/credit", accountNumber)
                .body(amount)
                .retrieve()
                .toBodilessEntity();
    }

    public UUID getUserId(String accountNumber) {
        return restClient.get()
                .uri("/api/accounts/{accountNumber}", accountNumber)
                .retrieve()
                .body(AccountResponse.class)
                .userId();
    }
}