package com.bok.savings.dto;

import com.bok.savings.entity.InterestRecord;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class InterestRecordResponse {

    private UUID id;
    private UUID savingsPlanId;
    private LocalDate calculationDate;
    private BigDecimal openingBalance;
    private BigDecimal interestRate;
    private BigDecimal interestEarned;
    private BigDecimal closingBalance;

    public static InterestRecordResponse from(InterestRecord record) {
        InterestRecordResponse response = new InterestRecordResponse();
        response.id = record.getId();
        response.savingsPlanId = record.getSavingsPlan().getId();
        response.calculationDate = record.getCalculationDate();
        response.openingBalance = record.getOpeningBalance();
        response.interestRate = record.getInterestRate();
        response.interestEarned = record.getInterestEarned();
        response.closingBalance = record.getClosingBalance();
        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSavingsPlanId() {
        return savingsPlanId;
    }

    public void setSavingsPlanId(UUID savingsPlanId) {
        this.savingsPlanId = savingsPlanId;
    }

    public LocalDate getCalculationDate() {
        return calculationDate;
    }

    public void setCalculationDate(LocalDate calculationDate) {
        this.calculationDate = calculationDate;
    }

    public BigDecimal getOpeningBalance() {
        return openingBalance;
    }
    
    public void setOpeningBalance(BigDecimal openingBalance) {
        this.openingBalance = openingBalance;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public BigDecimal getInterestEarned() {
        return interestEarned;
    }

    public void setInterestEarned(BigDecimal interestEarned) {
        this.interestEarned = interestEarned;
    }

    public BigDecimal getClosingBalance() {
        return closingBalance;
    }

    public void setClosingBalance(BigDecimal closingBalance) {
        this.closingBalance = closingBalance;
    }
}
