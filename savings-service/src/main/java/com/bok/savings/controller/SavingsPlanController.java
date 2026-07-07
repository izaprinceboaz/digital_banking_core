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
    public SavingsPlan createSavingsPlan(@Valid @RequestBody CreateSavingsPlanRequest request,
                                         @RequestHeader("Authorization") String authHeader) {
        SavingsPlan savingsPlan = new SavingsPlan();
        savingsPlan.setAccountNumber(request.getAccountNumber());
        savingsPlan.setPlanName(request.getPlanName());
        savingsPlan.setCompounding(request.getCompounding());
        savingsPlan.setPrincipalAmount(request.getPrincipalAmount());
        savingsPlan.setCurrentBalance(request.getPrincipalAmount());
        savingsPlan.setStartDate(request.getStartDate());
        savingsPlan.setMaturityDate(request.getMaturityDate());

        return savingsPlanService.createSavingsPlan(savingsPlan, authHeader);
    }

    @PostMapping("/{id}/apply-interest")
    public InterestRecordResponse applyInterest(@PathVariable UUID id,
                                                @RequestHeader("Authorization") String authHeader) {
        return InterestRecordResponse.from(savingsPlanService.applyInterest(id, authHeader));
    }

    @PostMapping("/deposit")
    public SavingsPlan deposit(@Valid @RequestBody DepositRequest request,
                               @RequestHeader("Authorization") String authHeader) {
        return savingsPlanService.deposit(request, authHeader);
    }

    @PostMapping("/withdraw")
    public SavingsPlan withdraw(@Valid @RequestBody WithdrawRequest request,
                                @RequestHeader("Authorization") String authHeader) {
        return savingsPlanService.withdraw(request, authHeader);
    }

    @GetMapping
    public List<SavingsPlan> listSavingsPlans() {
        return savingsPlanService.listSavingsPlans();
    }

    @GetMapping("/{id}")
    public SavingsPlan getSavingsPlanById(@PathVariable UUID id) {
        return savingsPlanService.getSavingsPlanById(id);
    }

    @GetMapping("/my-savings-plans/{accountNumber}")
    public List<SavingsPlan> findSavingsPlansByAccountNumber(@PathVariable String accountNumber) {
        return savingsPlanService.findSavingsPlansByAccountNumber(accountNumber);
    }

    @DeleteMapping("/{id}")
    public void deleteSavingsPlan(@PathVariable UUID id) {
        savingsPlanService.deleteSavingsPlan(id);
    }
}
