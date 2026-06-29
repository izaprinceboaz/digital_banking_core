package com.bok.savings.exception;

public class InsufficientSavingsBalanceException extends RuntimeException {
    public InsufficientSavingsBalanceException() {
        super("Insufficient savings plan balance");
    }
}
