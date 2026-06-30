package com.bok.account.service;

import com.bok.account.entity.Account;
import com.bok.account.exception.AccountNotFoundException;
import com.bok.account.exception.InsufficientFundsException;
import com.bok.account.repository.AccountRepository;
import com.bok.account.entity.Currency;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Transactional
    public Account debit(String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(account.getBalance());
        }

        account.setBalance(account.getBalance().subtract(amount));
        return accountRepository.save(account);
    }

    @Transactional
    public Account credit(String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));

        account.setBalance(account.getBalance().add(amount));
        return accountRepository.save(account);
    }

    public BigDecimal checkCurrency(String senderAccountNumber, String receiverAccountNumber, BigDecimal amount) {
        Account sender = accountRepository.findByAccountNumber(senderAccountNumber)
                .orElseThrow(() -> new AccountNotFoundException(senderAccountNumber));

        Account receiver = accountRepository.findByAccountNumber(receiverAccountNumber)
                        .orElseThrow(() -> new AccountNotFoundException(receiverAccountNumber));

        BigDecimal result = amount;


        if (!sender.getCurrency().equals(receiver.getCurrency())) {

            Currency senderCurrency = sender.getCurrency();
            Currency receiverCurrency = receiver.getCurrency();

            if (senderCurrency.equals(Currency.RWF) && receiverCurrency.equals(Currency.USD)) {
                result = convertRWFToUSD(amount);
            } else if (senderCurrency.equals(Currency.USD) && receiverCurrency.equals(Currency.RWF)) {
                result = convertUSDToRWF(amount);
            } else if (senderCurrency.equals(Currency.RWF) && receiverCurrency.equals(Currency.EUR)) {
                result = convertRWFToEUR(amount);
            } else if (senderCurrency.equals(Currency.EUR) && receiverCurrency.equals(Currency.RWF)) {
                result = convertEURToRWF(amount);
            } else if (senderCurrency.equals(Currency.USD) && receiverCurrency.equals(Currency.EUR)) {
                result = convertUSDToEUR(amount);
            } else if (senderCurrency.equals(Currency.EUR) && receiverCurrency.equals(Currency.USD)) {
                result = convertEURToUSD(amount);
            }
        }


        
        return result;
    }

    @Transactional
    public void deleteAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));
        accountRepository.delete(account);
    }


    @Transactional
    public Account updateBalance(String accountNumber, BigDecimal newBalance) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));

        account.setBalance(newBalance);
        return accountRepository.save(account);
    }

    public Account getAccountByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));
    }


    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    public List<Account> listAccounts() {
        return accountRepository.findAll();
    }

    public BigDecimal convertRWFToUSD(BigDecimal amount) {
        BigDecimal exchangeRate = new BigDecimal("0.00068");
        return amount.multiply(exchangeRate);
    }

    public BigDecimal convertUSDToRWF(BigDecimal amount) {
        BigDecimal exchangeRate = new BigDecimal("1466.64");
        return amount.multiply(exchangeRate);
    }

    public BigDecimal convertRWFToEUR(BigDecimal amount) {
        BigDecimal exchangeRate = new BigDecimal("0.00060");
        return amount.multiply(exchangeRate);
    }

    public BigDecimal convertEURToRWF(BigDecimal amount) {
        BigDecimal exchangeRate = new BigDecimal("1670.20");
        return amount.multiply(exchangeRate);
    }

    public BigDecimal convertUSDToEUR(BigDecimal amount) {
        BigDecimal exchangeRate = new BigDecimal("0.8772");
        return amount.multiply(exchangeRate);
    }

    public BigDecimal convertEURToUSD(BigDecimal amount) {
        BigDecimal exchangeRate =  new BigDecimal("1.1399");
        return amount.multiply(exchangeRate);
    }

}
