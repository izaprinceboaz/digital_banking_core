package com.bok.savings.service;

import com.bok.savings.entity.SavingsStatus;
import com.bok.savings.repository.SavingsPlanRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class InterestScheduler {

    private final SavingsPlanRepository savingsPlanRepository;
    private final SavingsPlanService savingsPlanService;

    public InterestScheduler(SavingsPlanRepository savingsPlanRepository,
                             SavingsPlanService savingsPlanService) {
        this.savingsPlanRepository = savingsPlanRepository;
        this.savingsPlanService = savingsPlanService;
    }

    // Runs on the 1st of every month at midnight
    @Scheduled(cron = "0 0 0 1 * *")
    public void applyMonthlyInterest() {
        savingsPlanRepository.findAll().stream()
                .filter(p -> p.getStatus() == SavingsStatus.ACTIVE)
                .forEach(p -> {
                    try {
                        savingsPlanService.applyInterest(p.getId(), null);
                    } catch (Exception e) {
                        System.err.println("Failed to apply interest for plan " + p.getId() + ": " + e.getMessage());
                    }
                });
    }
}
