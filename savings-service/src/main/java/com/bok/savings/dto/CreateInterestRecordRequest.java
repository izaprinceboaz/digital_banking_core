package com.bok.savings.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class CreateInterestRecordRequest {

    @NotNull(message = "Savings plan id is required")
    private UUID savingsPlanId;

    @NotNull(message = "Calculation date is required")
    private LocalDate calculationDate;

    @NotNull(message = "Opening balance is required")
    @DecimalMin(value = "0.00", message = "Opening balance cannot be negative")
    private BigDecimal openingBalance;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.0000", message = "Interest rate cannot be negative")
    private BigDecimal interestRate;

    @NotNull(message = "Interest earned is required")
    @DecimalMin(value = "0.00", message = "Interest earned cannot be negative")
    private BigDecimal interestEarned;

    @NotNull(message = "Closing balance is required")
    @DecimalMin(value = "0.00", message = "Closing balance cannot be negative")
    private BigDecimal closingBalance;

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
