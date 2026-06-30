package com.bok.savings.controller;

import com.bok.savings.dto.CreateSavingsPlanRequest;
import com.bok.savings.dto.DepositRequest;
import com.bok.savings.dto.InterestRecordResponse;
import com.bok.savings.dto.WithdrawRequest;
import com.bok.savings.entity.SavingsPlan;
import com.bok.savings.service.SavingsPlanService;
import jakarta.validation.Valid;
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
    public SavingsPlan createSavingsPlan(@Valid @RequestBody CreateSavingsPlanRequest request) {
        SavingsPlan savingsPlan = new SavingsPlan();
        savingsPlan.setAccountNumber(request.getAccountNumber());
        savingsPlan.setPlanName(request.getPlanName());
        savingsPlan.setInterestRate(request.getInterestRate());
        savingsPlan.setCompounding(request.getCompounding());
        savingsPlan.setPrincipalAmount(request.getPrincipalAmount());
        savingsPlan.setCurrentBalance(request.getPrincipalAmount());
        savingsPlan.setStartDate(request.getStartDate());
        savingsPlan.setMaturityDate(request.getMaturityDate());

        return savingsPlanService.createSavingsPlan(savingsPlan);
    }
    
    @PostMapping("/{id}/apply-interest")
    public InterestRecordResponse applyInterest(@PathVariable UUID id) {
        return InterestRecordResponse.from(savingsPlanService.applyInterest(id));
    }

    @PostMapping("/deposit")
    public SavingsPlan deposit(@Valid @RequestBody DepositRequest request) {
        return savingsPlanService.deposit(request);
    }

    @PostMapping("/withdraw")
    public SavingsPlan withdraw(@Valid @RequestBody WithdrawRequest request) {
        return savingsPlanService.withdraw(request);
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
