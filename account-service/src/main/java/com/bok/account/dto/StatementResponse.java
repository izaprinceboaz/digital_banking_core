package com.bok.account.dto;

import java.math.BigDecimal;

import com.bok.account.entity.EntryType;
import com.bok.account.entity.Statement;

public class StatementResponse {

    private String transactionRef;
    private String description;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private EntryType entryType;

    public String getTransactionRef() {
        return transactionRef;
    }

    public void setTransactionRef(String transactionRef) {
        this.transactionRef = transactionRef;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getBalanceAfter() {
        return balanceAfter;
    }

    public void setBalanceAfter(BigDecimal balanceAfter) {
        this.balanceAfter = balanceAfter;
    }

    public EntryType getEntryType() {
        return entryType;
    }

    public void setEntryType(EntryType entryType) {
        this.entryType = entryType;
    }

    public static StatementResponse from(Statement statement) {
        StatementResponse response = new StatementResponse();
        response.setTransactionRef(statement.getTransactionRef());
        response.setDescription(statement.getDescription());
        response.setAmount(statement.getAmount());
        response.setBalanceAfter(statement.getBalanceAfter());
        response.setEntryType(statement.getEntryType());
        return response;
    }

    
}
