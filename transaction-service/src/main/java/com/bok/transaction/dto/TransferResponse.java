package com.bok.transaction.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.bok.transaction.entity.Transaction;
import com.bok.transaction.entity.TransactionStatus;
import com.bok.transaction.entity.TransactionType;

public class TransferResponse {
    
    private UUID id;
    private BigDecimal amount;
    private String description;
    private TransactionType type;
    private String failureReason;
    private TransactionStatus status;
    private String currency;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public static TransferResponse from(Transaction transaction) {
        TransferResponse response = new TransferResponse();
        response.id = transaction.getId();
        response.amount = transaction.getAmount();
        response.description = transaction.getDescription();
        response.type = transaction.getType();
        response.failureReason = transaction.getFailureReason();
        response.status = transaction.getStatus();
        response.currency = transaction.getCurrency();
        return response;
    }
}
