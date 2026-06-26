package com.bok.account.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.account.entity.Statement;
import com.bok.account.repository.StatementRepository;
import com.bok.account.exception.StatementNotFoundException;

@Service
public class StatementService {
    private final StatementRepository statementRepository;

    public StatementService(StatementRepository statementRepository) {
        this.statementRepository = statementRepository;
    }

    
    public Statement createStatement(  Statement statement) {
        return statementRepository.save(statement);
    }

    
    public List<Statement> listStatements() {
        return statementRepository.findAll();
    }

    
    public Statement getStatementById(  UUID id) {
        return statementRepository.findById(id).orElseThrow(() -> new StatementNotFoundException());
    }
}

