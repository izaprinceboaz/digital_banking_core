package com.bok.savings.controller;

import com.bok.savings.entity.SavingsPlan;
import com.bok.savings.repository.SavingsPlanRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/savings-plans")
public class SavingsPlanController {

    private final SavingsPlanRepository savingsPlanRepository;

    public SavingsPlanController(SavingsPlanRepository savingsPlanRepository) {
        this.savingsPlanRepository = savingsPlanRepository;
    }

    @PostMapping
    public SavingsPlan createSavingsPlan(@RequestBody SavingsPlan savingsPlan) {
        return savingsPlanRepository.save(savingsPlan);
    }

    @GetMapping
    public List<SavingsPlan> listSavingsPlans() {
        return savingsPlanRepository.findAll();
    }

    @GetMapping("/{id}")
    public SavingsPlan getSavingsPlanById(@PathVariable UUID id) {
        return savingsPlanRepository.findById(id).orElse(null);
    }
}
