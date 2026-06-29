package com.bok.transaction.controller;

import com.bok.transaction.dto.TransferRequest;
import com.bok.transaction.dto.TransferResponse;
import com.bok.transaction.entity.Transaction;
import com.bok.transaction.service.TransactionService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public TransferResponse createTransaction(@RequestBody Transaction transaction) {
        return TransferResponse.from(transactionService.createTransaction(transaction));
    }

    @GetMapping
    public List<TransferResponse> listTransactions() {
        return transactionService.listTransactions().stream()
                .map(TransferResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public TransferResponse getTransactionById(@PathVariable UUID id) {
        return TransferResponse.from(transactionService.getTransactionById(id));
    }

    @PostMapping("/transfer")
    public TransferResponse transfer(@Valid @RequestBody TransferRequest transferRequest) {
        return TransferResponse.from(transactionService.transfer(transferRequest));
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable UUID id) {
        transactionService.deleteTransaction(id);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
