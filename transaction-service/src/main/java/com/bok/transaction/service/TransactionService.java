package com.bok.transaction.service;

import com.bok.transaction.entity.Transaction;
import com.bok.transaction.entity.TransactionStatus;
import com.bok.transaction.entity.TransactionType;
import com.bok.transaction.repository.TransactionRepository;
import com.bok.transaction.client.AccountClient;
import com.bok.transaction.client.NotificationClient;
import com.bok.transaction.dto.TransferRequest;
import com.bok.transaction.exception.TransactionNotFoundException;
import com.bok.transaction.exception.TransferLimitExceededException;
import com.bok.transaction.repository.TransferLimitRepository;
import com.bok.transaction.entity.TransferLimit;


import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;


@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountClient accountClient;
    private final NotificationClient notificationClient;
    private final TransferLimitRepository transferLimitRepository;

    public TransactionService(TransactionRepository transactionRepository, AccountClient accountClient, NotificationClient notificationClient, TransferLimitRepository transferLimitRepository) {
        this.transactionRepository = transactionRepository;
        this.accountClient = accountClient;
        this.notificationClient = notificationClient;
        this.transferLimitRepository = transferLimitRepository;
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction getTransactionById(UUID id) {
        return transactionRepository.findById(id).orElseThrow(() -> new TransactionNotFoundException());
    }

    public List<Transaction> listTransactions() {
        return transactionRepository.findAll();
    }

    public void deleteTransaction(UUID id) {
        transactionRepository.deleteById(id);
    }


    @Transactional
    public Transaction transfer(TransferRequest transferRequest) {
        Transaction transaction = new Transaction();
        transaction.setSenderAccountNumber(transferRequest.getSenderAccountNumber());
        transaction.setReceiverAccountNumber(transferRequest.getReceiverAccountNumber());
        transaction.setAmount(transferRequest.getAmount());
        transaction.setDescription(transferRequest.getDescription());
        transaction.setCurrency(transferRequest.getCurrency());

        transaction.setReferenceNumber("TXN-" + UUID.randomUUID());
        transaction.setType(TransactionType.TRANSFER);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction = transactionRepository.save(transaction);

        TransferLimit limit = transferLimitRepository.findByAccountNumber(
                transferRequest.getSenderAccountNumber())
            .orElseGet(() -> {
                TransferLimit newLimit = new TransferLimit();
                newLimit.setAccountNumber(transferRequest.getSenderAccountNumber());
                return transferLimitRepository.save(newLimit);
            });

        if (limit.getLastResetDate() == null || limit.getLastResetDate().isBefore(LocalDate.now())) {
            limit.setDailyUsed(BigDecimal.ZERO);
            limit.setLastResetDate(LocalDate.now());
        }

        if (transferRequest.getAmount().compareTo(limit.getPerTxnLimit()) > 0) {
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setFailureReason("Transfer amount exceeds per transaction limit.");
            transactionRepository.save(transaction);
            throw new TransferLimitExceededException();
        }

        if ( limit.getDailyUsed().add(transferRequest.getAmount()).compareTo(limit.getDailyLimit()) > 0) {
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setFailureReason("Exceeds daily limit of " + limit.getDailyLimit());
            transactionRepository.save(transaction);
            throw new TransferLimitExceededException();
        }


        BigDecimal convertedAmount = accountClient.checkCurrency(transferRequest.getSenderAccountNumber(), transferRequest.getReceiverAccountNumber(),transferRequest.getAmount());

        try {
            
            BigDecimal senderBalance = accountClient.debit(transaction.getSenderAccountNumber(), transaction.getAmount());

            accountClient.createStatement(transaction.getSenderAccountNumber(), transaction.getReferenceNumber(),
                                            transaction.getDescription(), transaction.getAmount(), senderBalance, "DEBIT");
            
            UUID senderUserId = accountClient.getUserId(transaction.getSenderAccountNumber());
            notificationClient.sendNotification(senderUserId, "Transfer of " + transaction.getAmount() + " " + transaction.getCurrency() + " to account " + transaction.getReceiverAccountNumber() + " is successful. Reference: " + transaction.getReferenceNumber());

        } catch (RuntimeException ex) {
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setFailureReason(ex.getMessage());
            return transactionRepository.save(transaction);
        }

        try {
            
            BigDecimal receiverBalance = accountClient.credit(transaction.getReceiverAccountNumber(), convertedAmount);

            accountClient.createStatement(transaction.getReceiverAccountNumber(), transaction.getReferenceNumber(),
                                            transaction.getDescription(), convertedAmount, receiverBalance, "CREDIT");

            UUID receiverUserId = accountClient.getUserId(transaction.getReceiverAccountNumber());
            notificationClient.sendNotification(receiverUserId, "You have received " + transaction.getAmount() + " " + transaction.getCurrency() + " from account " + transaction.getSenderAccountNumber() + ". Reference: " + transaction.getReferenceNumber());
            
        } catch (RuntimeException ex) {
            accountClient.credit(transaction.getSenderAccountNumber(), transaction.getAmount());
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setFailureReason("Credit failed, rolled back: " + ex.getMessage());
            return transactionRepository.save(transaction);
        }

        transaction.setStatus(TransactionStatus.COMPLETED);

        limit.setDailyUsed(limit.getDailyUsed().add(transferRequest.getAmount()));
        transferLimitRepository.save(limit);

        return transactionRepository.save(transaction);
    }
}