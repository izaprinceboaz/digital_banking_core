package com.bok.account.exception;


public class StatementNotFound extends RuntimeException {
    public StatementNotFound() {
        super("Statement not found");
    }
}
