package com.bok.savings.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class DepositRequest {

    private UUID accountId;
    private UUID savingsPlanId;
    private BigDecimal amount;

    public UUID getAccountId(){
        return accountId;
    }

    public void setAccountId(UUID accountId) {
        this.accountId = accountId;
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
