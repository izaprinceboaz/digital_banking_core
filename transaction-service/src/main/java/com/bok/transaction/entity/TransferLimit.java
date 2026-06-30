package com.bok.transaction.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transfer_limits")
public class TransferLimit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;

    @Column(name = "daily_limit", nullable = false, precision = 15, scale = 2)
    private BigDecimal dailyLimit = new BigDecimal("1000000.00");

    @Column(name = "per_txn_limit", nullable = false, precision = 15, scale = 2)
    private BigDecimal perTxnLimit = new BigDecimal("500000.00");

    @Column(name = "daily_used", nullable = false, precision = 15, scale = 2)
    private BigDecimal dailyUsed = BigDecimal.ZERO;

    @Column(name = "last_reset_date")
    private LocalDate lastResetDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        lastResetDate = LocalDate.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

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

    public BigDecimal getDailyUsed() {
        return dailyUsed;
    }

    public void setDailyUsed(BigDecimal dailyUsed) {
        this.dailyUsed = dailyUsed;
    }

    public LocalDate getLastResetDate() {
        return lastResetDate;
    }

    public void setLastResetDate(LocalDate lastResetDate) {
        this.lastResetDate = lastResetDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
