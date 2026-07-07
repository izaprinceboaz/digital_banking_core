package com.bok.transaction.controller;

import com.bok.transaction.dto.CreateTransactionRequest;
import com.bok.transaction.dto.TransferRequest;
import com.bok.transaction.dto.TransferResponse;
import com.bok.transaction.entity.Transaction;
import com.bok.transaction.service.TransactionService;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/create")
    public TransferResponse createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setReferenceNumber(request.getReferenceNumber());
        transaction.setSenderAccountNumber(request.getSenderAccountNumber());
        transaction.setReceiverAccountNumber(request.getReceiverAccountNumber());
        transaction.setAmount(request.getAmount());
        transaction.setCurrency(request.getCurrency());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());

        return TransferResponse.from(transactionService.createTransaction(transaction));
    }

    @GetMapping
    public List<TransferResponse> listTransactions() {
        return transactionService.listTransactions().stream()
                .map(TransferResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/my-transactions/{accountNumber}")
    public List<TransferResponse> findTransactionsByAccountNumber(@PathVariable String accountNumber) {
        return transactionService.findTransactionsByAccountNumber(accountNumber).stream()
                .map(TransferResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public TransferResponse getTransactionById(@PathVariable UUID id) {
        return TransferResponse.from(transactionService.getTransactionById(id));
    }
    @PostMapping("/transfer")
    public TransferResponse transfer(@Valid @RequestBody TransferRequest transferRequest,
                                     @RequestHeader("Authorization") String authHeader) {
        return TransferResponse.from(transactionService.transfer(transferRequest, authHeader));
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable UUID id) {
        transactionService.deleteTransaction(id);
    }
}
