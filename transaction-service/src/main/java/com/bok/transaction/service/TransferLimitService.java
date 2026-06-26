package com.bok.transaction.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.transaction.entity.TransferLimit;
import com.bok.transaction.exception.TransferLimitNotFoundException;
import com.bok.transaction.repository.TransferLimitRepository;

@Service
public class TransferLimitService {

    private final TransferLimitRepository transferLimitRepository;

    public TransferLimitService(TransferLimitRepository transferLimitRepository) {
        this.transferLimitRepository = transferLimitRepository;
    }

    
    public TransferLimit createTransferLimit(  TransferLimit transferLimit) {
        return transferLimitRepository.save(transferLimit);
    }

    
    public List<TransferLimit> listTransferLimits() {
        return transferLimitRepository.findAll();
    }

    
    public TransferLimit getTransferLimitById(  UUID id) {
        return transferLimitRepository.findById(id).orElseThrow(() -> new TransferLimitNotFoundException());
    }
}
