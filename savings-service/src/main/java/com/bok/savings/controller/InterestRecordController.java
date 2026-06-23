package com.bok.savings.controller;

import com.bok.savings.entity.InterestRecord;
import com.bok.savings.repository.InterestRecordRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/interest-records")
public class InterestRecordController {

    private final InterestRecordRepository interestRecordRepository;

    public InterestRecordController(InterestRecordRepository interestRecordRepository) {
        this.interestRecordRepository = interestRecordRepository;
    }

    @PostMapping
    public InterestRecord createInterestRecord(@RequestBody InterestRecord interestRecord) {
        return interestRecordRepository.save(interestRecord);
    }

    @GetMapping
    public List<InterestRecord> listInterestRecords() {
        return interestRecordRepository.findAll();
    }

    @GetMapping("/{id}")
    public InterestRecord getInterestRecordById(@PathVariable UUID id) {
        return interestRecordRepository.findById(id).orElse(null);
    }
}
