package com.bok.savings.controller;

import com.bok.savings.entity.InterestRecord;
import com.bok.savings.service.InterestRecordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/interest-records")
public class InterestRecordController {

    private final InterestRecordService interestRecordService;

    public InterestRecordController(InterestRecordService interestRecordService) {
        this.interestRecordService = interestRecordService;
    }

    @PostMapping
    public InterestRecord createInterestRecord(@RequestBody InterestRecord interestRecord) {
        return interestRecordService.createInterestRecord(interestRecord);
    }

    @GetMapping
    public List<InterestRecord> listInterestRecords() {
        return interestRecordService.listInterestRecords();
    }

    @GetMapping("/{id}")
    public InterestRecord getInterestRecordById(@PathVariable UUID id) {
        return interestRecordService.getInterestRecordById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteInterestRecord(@PathVariable UUID id) {
        interestRecordService.deleteInterestRecord(id);
    }
}
