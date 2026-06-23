package com.bok.transaction.controller;

import com.bok.transaction.entity.TransferLimit;
import com.bok.transaction.repository.TransferLimitRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transfer-limits")
public class TransferLimitController {

    private final TransferLimitRepository transferLimitRepository;

    public TransferLimitController(TransferLimitRepository transferLimitRepository) {
        this.transferLimitRepository = transferLimitRepository;
    }

    @PostMapping
    public TransferLimit createTransferLimit(@RequestBody TransferLimit transferLimit) {
        return transferLimitRepository.save(transferLimit);
    }

    @GetMapping
    public List<TransferLimit> listTransferLimits() {
        return transferLimitRepository.findAll();
    }

    @GetMapping("/{id}")
    public TransferLimit getTransferLimitById(@PathVariable UUID id) {
        return transferLimitRepository.findById(id).orElse(null);
    }
}
