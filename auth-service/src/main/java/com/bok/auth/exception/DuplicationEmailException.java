package com.bok.auth.exception;

public class DuplicationEmailException extends RuntimeException {
    public DuplicationEmailException(String email) {
        super("Email already exists: " + email);
    }
    
}
