package com.bok.account.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public class CurrencyCheckRequest {

    @NotNull(message = "Sender account id is required")
    private UUID senderAccountId;

    @NotNull(message = "Receiver account id is required")
    private UUID receiverAccountId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    public UUID getSenderAccountId() { 
        return senderAccountId; 
    }

    public void setSenderAccountId(UUID senderAccountId) { 
        this.senderAccountId = senderAccountId; 
    }

    public UUID getReceiverAccountId() { 
        return receiverAccountId; 
    }

    public void setReceiverAccountId(UUID receiverAccountId) { 
        this.receiverAccountId = receiverAccountId; 
    }

    public BigDecimal getAmount() { 
        return amount; 
    }

    public void setAmount(BigDecimal amount) { 
        this.amount = amount; 
    }
}
