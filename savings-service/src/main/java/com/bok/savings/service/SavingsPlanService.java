package com.bok.savings.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

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

    public SavingsPlanService(SavingsPlanRepository savingsPlanRepository,
                               InterestRecordRepository interestRecordRepository,
                               AccountClient accountClient) {
        this.savingsPlanRepository = savingsPlanRepository;
        this.interestRecordRepository = interestRecordRepository;
        this.accountClient = accountClient;
    }

    public SavingsPlan createSavingsPlan(SavingsPlan savingsPlan) {
        return savingsPlanRepository.save(savingsPlan);
    }

    public List<SavingsPlan> listSavingsPlans() {
        return savingsPlanRepository.findAll();
    }

    public SavingsPlan getSavingsPlanById(UUID id) {
        return savingsPlanRepository.findById(id).orElseThrow(() -> new SavingsPlanNotFoundException());
    }

    public void deleteSavingsPlan(UUID id) {
        savingsPlanRepository.deleteById(id);
    }

    public InterestRecord applyInterest(UUID id) {
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
        savingsPlanRepository.save(plan);

        InterestRecord record = new InterestRecord();
        record.setSavingsPlan(plan);
        record.setCalculationDate(LocalDate.now());
        record.setOpeningBalance(openingBalance);
        record.setInterestRate(plan.getInterestRate());
        record.setInterestEarned(interestEarned);
        record.setClosingBalance(closingBalance);

        return interestRecordRepository.save(record);
    }

    public SavingsPlan deposit(DepositRequest request) {
        SavingsPlan plan = savingsPlanRepository.findById(request.getSavingsPlanId())
                .orElseThrow(SavingsPlanNotFoundException::new);

        if (plan.getStatus() != SavingsStatus.ACTIVE) {
            throw new InvalidSavingsStatusException();
        }

        accountClient.debit(request.getAccountNumber(), request.getAmount());

        plan.setCurrentBalance(plan.getCurrentBalance().add(request.getAmount()));
        return savingsPlanRepository.save(plan);
    }

    public SavingsPlan withdraw(WithdrawRequest request) {
        SavingsPlan plan = savingsPlanRepository.findById(request.getSavingsPlanId())
                .orElseThrow(SavingsPlanNotFoundException::new);

        if (plan.getStatus() != SavingsStatus.ACTIVE) {
            throw new InvalidSavingsStatusException();
        }
        if (plan.getCurrentBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientSavingsBalanceException();
        }

        plan.setCurrentBalance(plan.getCurrentBalance().subtract(request.getAmount()));
        savingsPlanRepository.save(plan);

        accountClient.credit(request.getAccountNumber(), request.getAmount());
        return plan;
    }
}
