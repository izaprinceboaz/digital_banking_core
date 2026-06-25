package com.bok.account.controller;

import com.bok.account.entity.Account;
import com.bok.account.exception.AccountNotFoundException;
import com.bok.account.exception.InsufficientFundsException;
import com.bok.account.service.AccountService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController( AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/create")
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    @GetMapping
    public List<Account> listAccounts() {
        return accountService.listAccounts();
    }

    @GetMapping("/{id}")
    public Account getAccountById(@PathVariable UUID id) {
        return accountService.getAccountById(id);
    }

    @PostMapping("/{id}/balance")
    public Account updateBalance(@PathVariable UUID id, @RequestBody BigDecimal newBalance) {
        return accountService.updateBalance(id, newBalance);
    }

    @PostMapping("/{id}/debit")
    public Account debitAccount(@PathVariable UUID id, @RequestBody BigDecimal amount) {
        return accountService.debit(id, amount);
    }

    @PostMapping("/{id}/credit")
    public Account creditAccount(@PathVariable UUID id, @RequestBody BigDecimal amount) {
        return accountService.credit(id, amount);
    }

    @DeleteMapping("/{id}")
    public void deleteAccount(@PathVariable UUID id) {
        accountService.deleteAccount(id);
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<String> handleNotFound(AccountNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<String> handleInsufficientFunds(InsufficientFundsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

}