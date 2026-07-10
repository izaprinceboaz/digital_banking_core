package com.bok.transaction.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static Map<String, String> msg(String message) {
        return Map.of("message", message);
    }

    @ExceptionHandler(TransactionNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTransactionNotFound(TransactionNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(TransferLimitNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTransferLimitNotFound(TransferLimitNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(TransferLimitExceededException.class)
    public ResponseEntity<Map<String, String>> handleTransferLimitExceeded(TransferLimitExceededException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(SameAmountTransferException.class)
    public ResponseEntity<Map<String, String>> handleSameAmountTransfer(SameAmountTransferException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(AccountServiceUnavailableException.class)
    public ResponseEntity<Map<String, String>> handleAccountServiceUnavailable(AccountServiceUnavailableException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(DownstreamException.class)
    public ResponseEntity<Map<String, String>> handleDownstream(DownstreamException ex) {
        HttpStatus status = HttpStatus.resolve(ex.getStatus());
        if (status == null || status.is5xxServerError()) {
            status = HttpStatus.BAD_GATEWAY;
        }
        return ResponseEntity.status(status).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String combined = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg(combined));
    }
}
