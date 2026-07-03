package com.bok.savings.repository;

import com.bok.savings.entity.SavingsPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SavingsPlanRepository extends JpaRepository<SavingsPlan, UUID> {
    List<SavingsPlan> findSavingsPlansByAccountNumber(String accountNumber);
}
