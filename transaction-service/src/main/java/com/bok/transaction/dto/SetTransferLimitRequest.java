package com.bok.transaction.dto;

import java.math.BigDecimal;

public class SetTransferLimitRequest {

    private BigDecimal dailyLimit;
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
