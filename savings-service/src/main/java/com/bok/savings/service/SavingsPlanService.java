package com.bok.savings.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bok.savings.client.AccountClient;
import com.bok.savings.dto.DepositRequest;
import com.bok.savings.dto.WithdrawRequest;
import com.bok.savings.entity.CompoundingFrequency;
import com.bok.savings.entity.InterestRecord;
import com.bok.savings.entity.SavingsPlan;
import com.bok.savings.entity.SavingsStatus;
import com.bok.savings.exception.InsufficientSavingsBalanceException;
import com.bok.savings.exception.InvalidSavingsStatusException;
import com.bok.savings.exception.SavingsPlanNotFoundException;
import com.bok.savings.repository.InterestRecordRepository;
import com.bok.savings.repository.SavingsPlanRepository;
import com.bok.savings.client.NotificationClient;

@Service
public class SavingsPlanService {

    private static final Map<CompoundingFrequency, Integer> PERIODS_PER_YEAR = Map.of(
            CompoundingFrequency.DAILY, 365,
            CompoundingFrequency.MONTHLY, 12,
            CompoundingFrequency.ANNUALLY, 1
    );

    private final SavingsPlanRepository savingsPlanRepository;
    private final InterestRecordRepository interestRecordRepository;
    private final AccountClient accountClient;
    private final NotificationClient notificationClient;

    public SavingsPlanService(SavingsPlanRepository savingsPlanRepository,
                               InterestRecordRepository interestRecordRepository,
                               AccountClient accountClient,
                               NotificationClient notificationClient) {
        this.savingsPlanRepository = savingsPlanRepository;
        this.interestRecordRepository = interestRecordRepository;
        this.accountClient = accountClient;
        this.notificationClient = notificationClient;
    }

    public SavingsPlan createSavingsPlan(SavingsPlan savingsPlan, String authHeader) {
        accountClient.debit(savingsPlan.getAccountNumber(), savingsPlan.getPrincipalAmount(), "Savings plan opening", authHeader);
        SavingsPlan savedPlan = savingsPlanRepository.save(savingsPlan);

        try {
            UUID userId = accountClient.getUserId(savingsPlan.getAccountNumber(), authHeader);
            notificationClient.sendNotification(userId,
            "Your savings plan '" + savedPlan.getPlanName() + "' has been opened with " +
            savedPlan.getPrincipalAmount() + " at " + savedPlan.getInterestRate() + " interest rate.", authHeader);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
        return savedPlan;
    }

    public List<SavingsPlan> listSavingsPlans() {
        return savingsPlanRepository.findAll();
    }

    public SavingsPlan getSavingsPlanById(UUID id) {
        return savingsPlanRepository.findById(id).orElseThrow(() -> new SavingsPlanNotFoundException());
    }

    public List<SavingsPlan> findSavingsPlansByAccountNumber(String accountNumber) {
        return savingsPlanRepository.findSavingsPlansByAccountNumber(accountNumber);
    }

    @Transactional
    public SavingsPlan softDeleteSavingsPlan(UUID id, String authHeader) {
        SavingsPlan plan = savingsPlanRepository.findById(id)
                .orElseThrow(() -> new SavingsPlanNotFoundException());

        if (plan.getStatus() != SavingsStatus.ACTIVE) {
            throw new InvalidSavingsStatusException("Only an active plan can be closed.");
        }

        if (plan.getCurrentBalance().compareTo(BigDecimal.ZERO) > 0) {
            accountClient.credit(plan.getAccountNumber(), plan.getCurrentBalance(), "Savings plan closed", authHeader);
            plan.setCurrentBalance(BigDecimal.ZERO);
        }

        plan.setStatus(SavingsStatus.CANCELLED);
        return savingsPlanRepository.save(plan);
    }

    public InterestRecord applyInterest(UUID id, String authHeader) {
        SavingsPlan plan = savingsPlanRepository.findById(id)
                .orElseThrow(() -> new SavingsPlanNotFoundException());

        BigDecimal openingBalance = plan.getCurrentBalance();
        int periodsPerYear = PERIODS_PER_YEAR.get(plan.getCompounding());

        BigDecimal periodRate = plan.getInterestRate()
                .divide(BigDecimal.valueOf(periodsPerYear), 10, RoundingMode.HALF_UP);

        BigDecimal interestEarned = openingBalance.multiply(periodRate)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal closingBalance = openingBalance.add(interestEarned);

        plan.setCurrentBalance(closingBalance);

        boolean matured = plan.getMaturityDate() != null && !LocalDate.now().isBefore(plan.getMaturityDate());
        if (matured) {
            accountClient.credit(plan.getAccountNumber(), closingBalance, "Plan Matured", authHeader);
            plan.setCurrentBalance(BigDecimal.ZERO);
            plan.setStatus(SavingsStatus.MATURED);
        }

        savingsPlanRepository.save(plan);

        InterestRecord record = new InterestRecord();
        record.setSavingsPlan(plan);
        record.setCalculationDate(LocalDate.now());
        record.setOpeningBalance(openingBalance);
        record.setInterestRate(plan.getInterestRate());
        record.setInterestEarned(interestEarned);
        record.setClosingBalance(closingBalance);

        InterestRecord savedRecord = interestRecordRepository.save(record);

        try {
            UUID userId = accountClient.getUserId(plan.getAccountNumber(), authHeader);
            String message = matured
                ? "Your savings plan has matured! " + closingBalance + " has been credited to your account."
                : "Your savings plan has earned interest of " + interestEarned + ".";
            notificationClient.sendNotification(userId, message, authHeader);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
        return savedRecord;
    }

    public SavingsPlan deposit(DepositRequest request, String authHeader) {
        SavingsPlan plan = savingsPlanRepository.findById(request.getSavingsPlanId())
                .orElseThrow(SavingsPlanNotFoundException::new);

        if (plan.getStatus() != SavingsStatus.ACTIVE) {
            throw new InvalidSavingsStatusException();
        }

        accountClient.debit(request.getAccountNumber(), request.getAmount(), "Savings deposit", authHeader);

        plan.setCurrentBalance(plan.getCurrentBalance().add(request.getAmount()));

        SavingsPlan updatedPlan = savingsPlanRepository.save(plan);

        try {
            UUID userId = accountClient.getUserId(plan.getAccountNumber(), authHeader);
            notificationClient.sendNotification(userId, "You have deposited " + request.getAmount() + " into your savings plan. Your new balance is " + plan.getCurrentBalance() + ".", authHeader);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
        return updatedPlan;
    }

    public SavingsPlan withdraw(WithdrawRequest request, String authHeader) {
        SavingsPlan plan = savingsPlanRepository.findById(request.getSavingsPlanId())
                .orElseThrow(SavingsPlanNotFoundException::new);

        if (plan.getStatus() == SavingsStatus.MATURED) {
            throw new InvalidSavingsStatusException("Plan has matured and the balance was already credited to your account.");
        }
        if (plan.getStatus() != SavingsStatus.ACTIVE) {
            throw new InvalidSavingsStatusException();
        }
        if (plan.getMaturityDate() != null && LocalDate.now().isBefore(plan.getMaturityDate())) {
            throw new InvalidSavingsStatusException(
                "Plan has not matured yet. Earliest withdrawal date: " + plan.getMaturityDate());
        }
        if (plan.getCurrentBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientSavingsBalanceException();
        }

        plan.setCurrentBalance(plan.getCurrentBalance().subtract(request.getAmount()));
        SavingsPlan updatedPlan = savingsPlanRepository.save(plan);

        accountClient.credit(request.getAccountNumber(), request.getAmount(), "Savings withdrawal", authHeader);

        try {
            UUID userId = accountClient.getUserId(plan.getAccountNumber(), authHeader);
            notificationClient.sendNotification(userId, "You have withdrawn " + request.getAmount() + " from your savings plan. Your new balance is " + plan.getCurrentBalance() + ".", authHeader);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
        return updatedPlan;
    }
}
