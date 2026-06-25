package com.bok.transaction.exception;

public class SameAmountTransferException extends RuntimeException {
    public SameAmountTransferException() {
        super("Transfer amount cannot be the same as the current balance.");
    }
    
}
