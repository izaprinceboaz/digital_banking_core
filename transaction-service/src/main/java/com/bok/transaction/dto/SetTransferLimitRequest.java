package com.bok.transaction.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class SetTransferLimitRequest {

    @NotNull(message = "Daily limit is required")
    @Positive(message = "Daily limit must be greater than zero")
    private BigDecimal dailyLimit;

    @NotNull(message = "Per-transaction limit is required")
    @Positive(message = "Per-transaction limit must be greater than zero")
    private BigDecimal perTxnLimit;

    public BigDecimal getDailyLimit() {
        return dailyLimit;
    }

    public void setDailyLimit(BigDecimal dailyLimit) {
        this.dailyLimit = dailyLimit;
    }

    public BigDecimal getPerTxnLimit() {
        return perTxnLimit;
    }

    public void setPerTxnLimit(BigDecimal perTxnLimit) {
        this.perTxnLimit = perTxnLimit;
    }
}
