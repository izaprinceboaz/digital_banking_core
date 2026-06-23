package com.bok.transaction.repository;

import com.bok.transaction.entity.TransferLimit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransferLimitRepository extends JpaRepository<TransferLimit, UUID> {
}
