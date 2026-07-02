package com.bok.savings.exception;

public class InvalidAccountTypeException extends RuntimeException {
    public InvalidAccountTypeException(String accountNumber) {
        super("Account " + accountNumber + " is not a valid savings account.");
    }
    
}
