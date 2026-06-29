package com.bok.account.controller;

import com.bok.account.entity.Account;
import com.bok.account.exception.AccountNotFoundException;
import com.bok.account.exception.InsufficientFundsException;
import com.bok.account.service.AccountService;
import com.bok.account.dto.AccountResponse;
import com.bok.account.dto.CurrencyCheckRequest;
import com.bok.account.entity.Currency;

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
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController( AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/create")
    public AccountResponse createAccount(@RequestBody Account account) {
        Account createdAccount = accountService.createAccount(account);
        return AccountResponse.from(createdAccount);
    }

    @GetMapping
    public List<AccountResponse> listAccounts() {
        return accountService.listAccounts().stream()
                .map(AccountResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public AccountResponse getAccountById(@PathVariable UUID id) {
        Account account = accountService.getAccountById(id);
        return AccountResponse.from(account);
    }

    @PostMapping("/{id}/update-balance")
    public AccountResponse updateBalance(@PathVariable UUID id, @RequestBody BigDecimal newBalance) {
        Account account = accountService.updateBalance(id, newBalance);
        return AccountResponse.from(account);
    }

    @PostMapping("/{id}/debit")
    public AccountResponse debitAccount(@PathVariable UUID id, @RequestBody BigDecimal amount) {
        Account account = accountService.debit(id, amount);
        return AccountResponse.from(account);
    }

    @PostMapping("/{id}/credit")
    public AccountResponse creditAccount(@PathVariable UUID id, @RequestBody BigDecimal amount) {
        Account account = accountService.credit(id, amount);
        return AccountResponse.from(account);
    }

    @DeleteMapping("/{id}")
    public void deleteAccount(@PathVariable UUID id) {
        accountService.deleteAccount(id);
    }

    @PostMapping("/currency")
    public BigDecimal checkCurrency(@Valid @RequestBody CurrencyCheckRequest request) {
        BigDecimal convertedAmount = accountService.checkCurrency(request.getSenderAccountId(), request.getReceiverAccountId(), request.getAmount());
        return convertedAmount;
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<String> handleNotFound(AccountNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<String> handleInsufficientFunds(InsufficientFundsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

}