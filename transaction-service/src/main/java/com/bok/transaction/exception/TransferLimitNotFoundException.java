package com.bok.transaction.exception;

public class TransferLimitNotFoundException extends RuntimeException {
    public TransferLimitNotFoundException() {
        super("Transfer limit not found");
    }
    
}
