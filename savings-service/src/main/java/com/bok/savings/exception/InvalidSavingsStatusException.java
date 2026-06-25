package com.bok.savings.exception;

public class InvalidSavingsStatusException extends RuntimeException {
    public InvalidSavingsStatusException() {
        super("Invalid savings status");
    }
    
}
