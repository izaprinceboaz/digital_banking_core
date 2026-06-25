package com.bok.transaction.exception;

public class AccountServiceUnavailableException extends RuntimeException {
    public AccountServiceUnavailableException() {
        super("Account service is currently unavailable. Please try again later.");
    }
    
}
