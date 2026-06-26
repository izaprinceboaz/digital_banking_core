package com.bok.account.exception;


public class StatementNotFoundException extends RuntimeException {
    public StatementNotFoundException() {
        super("Statement not found");
    }
}
