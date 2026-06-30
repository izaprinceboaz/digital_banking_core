package com.bok.savings.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public class WithdrawRequest {

    @NotNull(message = "Account number is required")
    private String accountNumber;

    @NotNull(message = "Savings plan id is required")
    private UUID savingsPlanId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    public String getAccountNumber(){
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public UUID getSavingsPlanId(){
        return savingsPlanId;
    }
    
    public void setSavingsPlanId(UUID savingsPlanId) {
        this.savingsPlanId = savingsPlanId;
    }

    public BigDecimal getAmount(){
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
     
}