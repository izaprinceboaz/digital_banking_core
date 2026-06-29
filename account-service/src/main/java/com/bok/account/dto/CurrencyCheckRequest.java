package com.bok.account.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class CurrencyCheckRequest {
    private UUID senderAccountId;
    private UUID receiverAccountId;
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
