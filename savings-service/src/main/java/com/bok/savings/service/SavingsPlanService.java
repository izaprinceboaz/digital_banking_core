package com.bok.savings.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.savings.entity.SavingsPlan;
import com.bok.savings.repository.SavingsPlanRepository;

@Service
public class SavingsPlanService {

    private final SavingsPlanRepository savingsPlanRepository;

    public SavingsPlanService(SavingsPlanRepository savingsPlanRepository) {
        this.savingsPlanRepository = savingsPlanRepository;
    }

    public SavingsPlan createSavingsPlan(  SavingsPlan savingsPlan) {
        return savingsPlanRepository.save(savingsPlan);
    }

    public List<SavingsPlan> listSavingsPlans() {
        return savingsPlanRepository.findAll();
    }

    public SavingsPlan getSavingsPlanById(  UUID id) {
        return savingsPlanRepository.findById(id).orElse(null);
    }
}
