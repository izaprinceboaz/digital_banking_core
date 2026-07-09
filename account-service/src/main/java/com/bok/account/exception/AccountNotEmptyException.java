package com.bok.account.exception;

public class AccountNotEmptyException extends RuntimeException {
    public AccountNotEmptyException() {
        super("Account Not Empty");
    }
    
}
