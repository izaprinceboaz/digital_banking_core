package com.bok.savings.controller;

import com.bok.savings.dto.InterestRecordResponse;
import com.bok.savings.entity.SavingsPlan;
import com.bok.savings.service.SavingsPlanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/savings-plans")
public class SavingsPlanController {

    private final SavingsPlanService savingsPlanService;

    public SavingsPlanController(SavingsPlanService savingsPlanService) {
        this.savingsPlanService = savingsPlanService;
    }

    @PostMapping
    public SavingsPlan createSavingsPlan(@RequestBody SavingsPlan savingsPlan) {
        return savingsPlanService.createSavingsPlan(savingsPlan);
    }
    
    @PostMapping("/{id}/apply-interest")
    public InterestRecordResponse applyInterest(@PathVariable UUID id) {
        return InterestRecordResponse.from(savingsPlanService.applyInterest(id));
    }

    @GetMapping
    public List<SavingsPlan> listSavingsPlans() {
        return savingsPlanService.listSavingsPlans();
    }

    @GetMapping("/{id}")
    public SavingsPlan getSavingsPlanById(@PathVariable UUID id) {
        return savingsPlanService.getSavingsPlanById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteSavingsPlan(@PathVariable UUID id) {
        savingsPlanService.deleteSavingsPlan(id);
    }
}
