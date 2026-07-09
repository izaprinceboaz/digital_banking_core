package com.bok.account.service;

import com.bok.account.entity.Account;
import com.bok.account.entity.AccountStatus;
import com.bok.account.entity.EntryType;
import com.bok.account.entity.Statement;
import com.bok.account.exception.AccountNotActiveException;
import com.bok.account.exception.AccountNotEmptyException;
import com.bok.account.exception.AccountNotFoundException;
import com.bok.account.exception.InsufficientFundsException;
import com.bok.account.repository.AccountRepository;
import com.bok.account.repository.StatementRepository;
import com.bok.account.entity.Currency;
import com.bok.account.client.NotificationClient;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final StatementRepository statementRepository;
    private final NotificationClient notificationClient;
    private final AccountNumberGenerator accountNumberGenerator;

    public AccountService(AccountRepository accountRepository, StatementRepository statementRepository,
                          NotificationClient notificationClient, AccountNumberGenerator accountNumberGenerator) {
        this.accountRepository = accountRepository;
        this.statementRepository = statementRepository;
        this.notificationClient = notificationClient;
        this.accountNumberGenerator = accountNumberGenerator;
    }

    @Transactional
    public Account debit(String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountNotActiveException();
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(account.getBalance());
        }

        account.setBalance(account.getBalance().subtract(amount));
        Account updatedAccount = accountRepository.save(account);

        Statement statement = new Statement();
        statement.setAccount(updatedAccount);
        statement.setTransactionRef("DBT-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase());
        statement.setDescription("Account debit");
        statement.setAmount(amount);
        statement.setBalanceAfter(updatedAccount.getBalance());
        statement.setEntryType(EntryType.DEBIT);
        statementRepository.save(statement);

        try {
            notificationClient.sendDebitNotification(account.getUserId(), "Your account has been debited with " + amount + " " + account.getCurrency() + ". New balance: " + account.getBalance() + " " + account.getCurrency());
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
        return updatedAccount;
    }

    @Transactional
    public Account credit(String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountNotActiveException();
        }

        account.setBalance(account.getBalance().add(amount));

        Account updatedAccount = accountRepository.save(account);

        Statement statement = new Statement();
        statement.setAccount(updatedAccount);
        statement.setTransactionRef("CRT-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase());
        statement.setDescription("Account credit");
        statement.setAmount(amount);
        statement.setBalanceAfter(updatedAccount.getBalance());
        statement.setEntryType(EntryType.CREDIT);
        statementRepository.save(statement);

        try {
            notificationClient.sendCreditNotification(account.getUserId(), "Your account has been credited with " + amount + " " + account.getCurrency() + ". New balance: " + account.getBalance() + " " + account.getCurrency());
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
        return updatedAccount;
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

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountNotActiveException();
        }

        BigDecimal oldBalance = account.getBalance();

        account.setBalance(newBalance);

        Account updatedAccount = accountRepository.save(account);

        Statement statement = new Statement();
        statement.setAccount(updatedAccount);
        statement.setTransactionRef("DBT-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase());
        statement.setDescription("Updated account balance");
        statement.setAmount(newBalance.subtract(oldBalance).abs());
        statement.setBalanceAfter(updatedAccount.getBalance());
        statement.setEntryType(EntryType.DEBIT);
        statementRepository.save(statement);

        try {
            notificationClient.sendUpdateBalanceNotification(account.getUserId(), "Your account balance has been updated to " + newBalance + " " + account.getCurrency());
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
        return updatedAccount;
    }

    public Account updateAccountStatus(String accountNumber, String newStatus, String userId) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));

        if (!account.getUserId().toString().equals(userId)) {
            throw new AccountNotFoundException(accountNumber);
        }

        // customer self-service may only freeze/unfreeze
        if (!newStatus.equals("ACTIVE") && !newStatus.equals("SUSPENDED")) {
            throw new AccountNotActiveException();
        }
        // a bank hold (FROZEN) or a closed account can't be changed by the customer
        if (account.getStatus() == AccountStatus.FROZEN || account.getStatus() == AccountStatus.CLOSED) {
            throw new AccountNotActiveException();
        }

        account.setStatus(AccountStatus.valueOf(newStatus));
        return accountRepository.save(account);
    }


    public Account getAccountByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));
    }

    public List<Account> findAccountsByUserId(UUID userId) {
        return accountRepository.findAccountsByUserId(userId);
    }


    public Account createAccount(Account account) {
        String accountNumber = accountNumberGenerator.generate(account.getAccountType());
        account.setAccountNumber(accountNumber);
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

    @Transactional
    public Account closeAccount(String accountNumber, String userId) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));

        if (!account.getUserId().toString().equals(userId)) {
            throw new AccountNotFoundException(accountNumber);
        }
        if (account.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new AccountNotEmptyException();
        }

        account.setStatus(AccountStatus.CLOSED);
        return accountRepository.save(account);
    }


}
