package com.bok.account.controller;

import com.bok.account.entity.Account;
import com.bok.account.service.AccountService;
import com.bok.account.dto.AccountResponse;
import com.bok.account.dto.CreateAccountRequest;
import com.bok.account.dto.CurrencyCheckRequest;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public AccountResponse createAccount(@Valid @RequestBody CreateAccountRequest request) {
        Account account = new Account();
        account.setUserId(request.getUserId());
        account.setAccountNumber(request.getAccountNumber());
        account.setAccountType(request.getAccountType());
        account.setCurrency(request.getCurrency());
        account.setBalance(request.getBalance());

        Account createdAccount = accountService.createAccount(account);
        return AccountResponse.from(createdAccount);
    }

    @GetMapping
    public List<AccountResponse> listAccounts() {
        return accountService.listAccounts().stream()
                .map(AccountResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{accountNumber}")
    public AccountResponse getAccountByAccountNumber(@PathVariable String accountNumber) {
        Account account = accountService.getAccountByAccountNumber(accountNumber);
        return AccountResponse.from(account);
    }


    @PostMapping("/{accountNumber}/update-balance")
    public AccountResponse updateBalance(@PathVariable String accountNumber, @RequestBody BigDecimal newBalance) {
        Account account = accountService.updateBalance(accountNumber, newBalance);
        return AccountResponse.from(account);
    }

    @PostMapping("/{accountNumber}/debit")
    public AccountResponse debitAccount(@PathVariable String accountNumber, @RequestBody BigDecimal amount) {
        Account account = accountService.debit(accountNumber, amount);
        return AccountResponse.from(account);
    }

    @PostMapping("/{accountNumber}/credit")
    public AccountResponse creditAccount(@PathVariable String accountNumber, @RequestBody BigDecimal amount) {
        Account account = accountService.credit(accountNumber, amount);
        return AccountResponse.from(account);
    }

    @DeleteMapping("/{accountNumber}")
    public void deleteAccount(@PathVariable String accountNumber) {
        accountService.deleteAccount(accountNumber);
    }

    @PostMapping("/currency")
    public BigDecimal checkCurrency(@Valid @RequestBody CurrencyCheckRequest request) {
        BigDecimal convertedAmount = accountService.checkCurrency(request.getSenderAccountNumber(), request.getReceiverAccountNumber(), request.getAmount());
        return convertedAmount;
    }

}