package com.bok.transaction.exception;

public class TransactionLimitNotFoundException extends RuntimeException {
    public TransactionLimitNotFoundException() {
        super("Transaction limit not found");
    }
    
}
