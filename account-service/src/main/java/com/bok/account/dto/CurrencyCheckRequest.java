package com.bok.account.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public class CurrencyCheckRequest {

    @NotNull(message = "Sender account id is required")
    private String senderAccountNumber;

    @NotNull(message = "Receiver account id is required")
    private String receiverAccountNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    public String getSenderAccountNumber() { 
        return senderAccountNumber; 
    }

    public void setSenderAccountNumber(String senderAccountNumber) { 
        this.senderAccountNumber = senderAccountNumber; 
    }

    public String getReceiverAccountNumber() { 
        return receiverAccountNumber; 
    }

    public void setReceiverAccountNumber(String receiverAccountNumber) { 
        this.receiverAccountNumber = receiverAccountNumber; 
    }

    public BigDecimal getAmount() { 
        return amount; 
    }

    public void setAmount(BigDecimal amount) { 
        this.amount = amount; 
    }
}
