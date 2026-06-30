package com.bok.savings.dto;

import com.bok.savings.entity.CompoundingFrequency;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateSavingsPlanRequest {

    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @NotBlank(message = "Plan name is required")
    private String planName;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.0000", message = "Interest rate cannot be negative")
    private BigDecimal interestRate;

    @NotNull(message = "Compounding frequency is required")
    private CompoundingFrequency compounding;

    @NotNull(message = "Principal amount is required")
    @DecimalMin(value = "0.00", message = "Principal amount cannot be negative")
    private BigDecimal principalAmount;

    private LocalDate startDate;
    private LocalDate maturityDate;

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public CompoundingFrequency getCompounding() {
        return compounding;
    }

    public void setCompounding(CompoundingFrequency compounding) {
        this.compounding = compounding;
    }

    public BigDecimal getPrincipalAmount() {
        return principalAmount;
    }

    public void setPrincipalAmount(BigDecimal principalAmount) {
        this.principalAmount = principalAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(LocalDate maturityDate) {
        this.maturityDate = maturityDate;
    }
}
