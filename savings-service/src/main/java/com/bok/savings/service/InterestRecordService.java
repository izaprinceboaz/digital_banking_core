package com.bok.savings.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.savings.entity.InterestRecord;
import com.bok.savings.exception.InterestRecordNotFoundException;
import com.bok.savings.repository.InterestRecordRepository;

@Service
public class InterestRecordService {

    private final InterestRecordRepository interestRecordRepository;

    public InterestRecordService(InterestRecordRepository interestRecordRepository) {
        this.interestRecordRepository = interestRecordRepository;
    }

    public InterestRecord createInterestRecord(  InterestRecord interestRecord) {
        return interestRecordRepository.save(interestRecord);
    }

    public List<InterestRecord> listInterestRecords() {
        return interestRecordRepository.findAll();
    }

    public InterestRecord getInterestRecordById(  UUID id) {
        return interestRecordRepository.findById(id).orElseThrow(() -> new InterestRecordNotFoundException());
    }

    public void deleteInterestRecord(  UUID id) {
        interestRecordRepository.deleteById(id);
    }
}
