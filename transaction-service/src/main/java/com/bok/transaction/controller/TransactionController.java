package com.bok.transaction.controller;

import com.bok.transaction.entity.Transaction;
import com.bok.transaction.service.TransactionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionService.createTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> listTransactions() {
        return transactionService.listTransactions();
    }

    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable UUID id) {
        return transactionService.getTransactionById(id);
    }

    @PostMapping("/transfer")
    public Transaction transfer(@RequestBody Transaction transaction) {
        return transactionService.transfer(transaction);
    }
}
