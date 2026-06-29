package com.bok.transaction.service;

import com.bok.transaction.entity.Transaction;
import com.bok.transaction.entity.TransactionStatus;
import com.bok.transaction.entity.TransactionType;
import com.bok.transaction.repository.TransactionRepository;
import com.bok.transaction.client.AccountClient;
import com.bok.transaction.client.NotificationClient;
import com.bok.transaction.dto.TransferRequest;
import com.bok.transaction.exception.TransactionNotFoundException;

import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;


@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountClient accountClient;
    private final NotificationClient notificationClient;

    public TransactionService(TransactionRepository transactionRepository, AccountClient accountClient, NotificationClient notificationClient) {
        this.transactionRepository = transactionRepository;
        this.accountClient = accountClient;
        this.notificationClient = notificationClient;
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
        transaction.setSenderAccountId(transferRequest.getSenderAccountId());
        transaction.setReceiverAccountId(transferRequest.getReceiverAccountId());
        transaction.setAmount(transferRequest.getAmount());
        transaction.setDescription(transferRequest.getDescription());
        transaction.setCurrency(transferRequest.getCurrency());

        transaction.setReferenceNumber("TXN-" + UUID.randomUUID());
        transaction.setType(TransactionType.TRANSFER);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction = transactionRepository.save(transaction);

        BigDecimal convertedAmount = accountClient.checkCurrency(transferRequest.getSenderAccountId(), transferRequest.getReceiverAccountId(),transferRequest.getAmount());

        try {
            
            BigDecimal senderBalance = accountClient.debit(transaction.getSenderAccountId(), transaction.getAmount());

            accountClient.createStatement(transaction.getSenderAccountId(), transaction.getReferenceNumber(),
                                            transaction.getDescription(), transaction.getAmount(), senderBalance, "DEBIT");
            
            notificationClient.sendNotification(transaction.getSenderAccountId(), "Transfer of " + transaction.getAmount() + " " + transaction.getCurrency() + " to account " + transaction.getReceiverAccountId() + " is successful. Reference: " + transaction.getReferenceNumber());

        } catch (RuntimeException ex) {
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setFailureReason(ex.getMessage());
            return transactionRepository.save(transaction);
        }

        try {
            
            BigDecimal receiverBalance = accountClient.credit(transaction.getReceiverAccountId(), convertedAmount);

            accountClient.createStatement(transaction.getReceiverAccountId(), transaction.getReferenceNumber(),
                                            transaction.getDescription(), convertedAmount, receiverBalance, "CREDIT");

            notificationClient.sendNotification(transaction.getReceiverAccountId(), "You have received " + transaction.getAmount() + " " + transaction.getCurrency() + " from account " + transaction.getSenderAccountId() + ". Reference: " + transaction.getReferenceNumber());
            
        } catch (RuntimeException ex) {
            accountClient.credit(transaction.getSenderAccountId(), transaction.getAmount());
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setFailureReason("Credit failed, rolled back: " + ex.getMessage());
            return transactionRepository.save(transaction);
        }

        transaction.setStatus(TransactionStatus.COMPLETED);
        return transactionRepository.save(transaction);
    }
    
    
}
