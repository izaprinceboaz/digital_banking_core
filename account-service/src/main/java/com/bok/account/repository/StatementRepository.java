package com.bok.account.repository;

import com.bok.account.entity.Statement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StatementRepository extends JpaRepository<Statement, UUID> {
    List<Statement> findStatementsByAccount_AccountNumber(String accountNumber);
}
