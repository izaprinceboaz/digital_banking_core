package com.bok.account.exception;

import java.math.BigDecimal;

public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(BigDecimal balance) {
        super("Insufficient funds in account. Current balance: " + balance);
    }
}
