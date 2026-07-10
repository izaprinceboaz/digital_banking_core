package com.bok.savings.exception;

// Raised when a downstream service (e.g. account-service) rejects a call,
// carrying its status + message so the real reason reaches the caller.
public class DownstreamException extends RuntimeException {

    private final int status;

    public DownstreamException(int status, String message) {
        super(message);
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}
