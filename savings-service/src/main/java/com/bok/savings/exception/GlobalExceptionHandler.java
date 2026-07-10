package com.bok.savings.exception;

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

    @ExceptionHandler(SavingsPlanNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleSavingsPlanNotFound(SavingsPlanNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(InterestRecordNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleInterestRecordNotFound(InterestRecordNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(InvalidSavingsStatusException.class)
    public ResponseEntity<Map<String, String>> handleInvalidStatus(InvalidSavingsStatusException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(InsufficientSavingsBalanceException.class)
    public ResponseEntity<Map<String, String>> handleInsufficientBalance(InsufficientSavingsBalanceException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(msg(ex.getMessage()));
    }

    @ExceptionHandler(InvalidAccountTypeException.class)
    public ResponseEntity<Map<String, String>> handleInvalidAccountType(InvalidAccountTypeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg(ex.getMessage()));
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
