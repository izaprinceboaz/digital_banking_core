package com.bok.savings.exception;

public class SavingsPlanNotFoundException extends RuntimeException {
    public SavingsPlanNotFoundException() {
        super("Savings plan not found");
    }
    
}
