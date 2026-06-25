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

    public BigDecimal debit(UUID accountId, BigDecimal amount) {
        return restClient.post()
                .uri("/api/accounts/{id}/debit", accountId)
                .body(amount)
                .retrieve()
                .body(AccountResponse.class)
                .balance();
    }

    public BigDecimal credit(UUID accountId, BigDecimal amount) {
        return restClient.post()
                .uri("/api/accounts/{id}/credit", accountId)
                .body(amount)
                .retrieve()
                .body(AccountResponse.class)
                .balance();
    }


    public void createStatement(UUID accountId, String transactionRef, String description,
                                 BigDecimal amount, BigDecimal balanceAfter, String entryType) {
        Map<String, Object> statement = Map.of(
                "account", Map.of("id", accountId),
                "transactionRef", transactionRef,
                "description", description,
                "amount", amount,
                "balanceAfter", balanceAfter,
                "entryType", entryType
        );

        restClient.post()
                .uri("/api/statements")
                .body(statement)
                .retrieve()
                .toBodilessEntity();
    }
}

