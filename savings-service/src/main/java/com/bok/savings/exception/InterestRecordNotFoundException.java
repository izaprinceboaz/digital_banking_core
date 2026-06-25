package com.bok.savings.exception;

public class InterestRecordNotFoundException extends RuntimeException {
    public InterestRecordNotFoundException() {
        super("Interest record not found");
    }
    
}
