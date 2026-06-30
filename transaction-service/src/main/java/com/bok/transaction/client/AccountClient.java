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

    public BigDecimal debit(String accountNumber, BigDecimal amount) {
        return restClient.post()
                .uri("/api/accounts/{accountNumber}/debit", accountNumber)
                .body(amount)
                .retrieve()
                .body(AccountResponse.class)
                .balance();
    }

    public BigDecimal credit(String accountNumber, BigDecimal amount) {
        return restClient.post()
                .uri("/api/accounts/{accountNumber}/credit", accountNumber)
                .body(amount)
                .retrieve()
                .body(AccountResponse.class)
                .balance();
    }

    public UUID getUserId(String accountNumber) {
        return restClient.get()
                .uri("/api/accounts/{accountNumber}", accountNumber)
                .retrieve()
                .body(AccountResponse.class)
                .userId();
    }

    public BigDecimal checkCurrency(String senderAccountNumber, String receiverAccountNumber, BigDecimal amount) {
        Map<String, Object> request = Map.of(
                "senderAccountNumber", senderAccountNumber,
                "receiverAccountNumber", receiverAccountNumber,
                "amount", amount
        );

        return restClient.post()
                .uri("/api/accounts/currency")
                .body(request)
                .retrieve()
                .body(BigDecimal.class);
    }



    public void createStatement(String accountNumber, String transactionRef, String description,
                                BigDecimal amount, BigDecimal balanceAfter, String entryType) {
        Map<String, Object> statement = Map.of(
                "account", Map.of("accountNumber", accountNumber),
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

