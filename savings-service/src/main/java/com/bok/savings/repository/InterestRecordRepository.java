package com.bok.savings.repository;

import com.bok.savings.entity.InterestRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InterestRecordRepository extends JpaRepository<InterestRecord, UUID> {
}
