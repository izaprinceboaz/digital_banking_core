package com.bok.savings.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.savings.dto.CreateInterestRecordRequest;
import com.bok.savings.dto.InterestRecordResponse;
import com.bok.savings.entity.InterestRecord;
import com.bok.savings.entity.SavingsPlan;
import com.bok.savings.exception.InterestRecordNotFoundException;
import com.bok.savings.exception.SavingsPlanNotFoundException;
import com.bok.savings.repository.InterestRecordRepository;
import com.bok.savings.repository.SavingsPlanRepository;

@Service
public class InterestRecordService {

    private final InterestRecordRepository interestRecordRepository;
    private final SavingsPlanRepository savingsPlanRepository;

    public InterestRecordService(InterestRecordRepository interestRecordRepository,
                                  SavingsPlanRepository savingsPlanRepository) {
        this.interestRecordRepository = interestRecordRepository;
        this.savingsPlanRepository = savingsPlanRepository;
    }

    public InterestRecord createInterestRecord(CreateInterestRecordRequest request) {
        SavingsPlan savingsPlan = savingsPlanRepository.findById(request.getSavingsPlanId())
                .orElseThrow(SavingsPlanNotFoundException::new);

        InterestRecord interestRecord = new InterestRecord();
        interestRecord.setSavingsPlan(savingsPlan);
        interestRecord.setCalculationDate(request.getCalculationDate());
        interestRecord.setOpeningBalance(request.getOpeningBalance());
        interestRecord.setInterestRate(request.getInterestRate());
        interestRecord.setInterestEarned(request.getInterestEarned());
        interestRecord.setClosingBalance(request.getClosingBalance());

        return interestRecordRepository.save(interestRecord);
    }

    public List<InterestRecordResponse> listInterestRecords() {
        return interestRecordRepository.findAll().stream()
                .map(InterestRecordResponse::from)
                .toList();
    }

    public InterestRecord getInterestRecordById(  UUID id) {
        return interestRecordRepository.findById(id).orElseThrow(() -> new InterestRecordNotFoundException());
    }

    public void deleteInterestRecord(  UUID id) {
        interestRecordRepository.deleteById(id);
    }
}
