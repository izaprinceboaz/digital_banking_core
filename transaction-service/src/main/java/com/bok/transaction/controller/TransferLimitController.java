package com.bok.transaction.controller;

import com.bok.transaction.entity.TransferLimit;
import com.bok.transaction.dto.SetTransferLimitRequest;
import com.bok.transaction.service.TransferLimitService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transfer-limits")
public class TransferLimitController {

    private final TransferLimitService transferLimitService;

    public TransferLimitController(TransferLimitService transferLimitService) {
        this.transferLimitService = transferLimitService;
    }

    @PostMapping
    public TransferLimit createTransferLimit(@RequestBody TransferLimit transferLimit) {
        return transferLimitService.createTransferLimit(transferLimit);
    }

    @GetMapping
    public List<TransferLimit> listTransferLimits() {
        return transferLimitService.listTransferLimits();
    }

    @GetMapping("/{id}")
    public TransferLimit getTransferLimitById(@PathVariable UUID id) {
        return transferLimitService.getTransferLimitById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteTransferLimit(@PathVariable UUID id) {
        transferLimitService.deleteTransferLimit(id);
    }

    @PutMapping("/{accountNumber}")
    public TransferLimit setTransferLimit(@PathVariable String accountNumber,
                                          @Valid @RequestBody SetTransferLimitRequest request) {
        return transferLimitService.setLimits(accountNumber, request.getDailyLimit(), request.getPerTxnLimit());
    }
}
