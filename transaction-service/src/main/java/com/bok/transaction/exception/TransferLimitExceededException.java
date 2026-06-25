package com.bok.transaction.exception;

public class TransferLimitExceededException extends RuntimeException {
    public TransferLimitExceededException() {
        super("Transfer limit exceeded");
    }
    
}
