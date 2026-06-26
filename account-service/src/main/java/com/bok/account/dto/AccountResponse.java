package com.bok.account.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.bok.account.entity.Account;
import com.bok.account.entity.AccountStatus;
import com.bok.account.entity.Currency;

public class AccountResponse {

    private UUID id;
    private String accountNumber;
    private BigDecimal balance;    
    private Currency currency;
    private AccountStatus status;

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }

    public static AccountResponse from(Account account) {
        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setAccountNumber(account.getAccountNumber());
        response.setBalance(account.getBalance());
        response.setCurrency(account.getCurrency());
        response.setStatus(account.getStatus());
        return response;
    }
    
}
