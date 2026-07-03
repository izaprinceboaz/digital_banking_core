package com.bok.account.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.account.entity.Account;
import com.bok.account.entity.Statement;
import com.bok.account.repository.StatementRepository;
import com.bok.account.repository.AccountRepository;
import com.bok.account.exception.StatementNotFoundException;
import com.bok.account.exception.AccountNotFoundException;


@Service
public class StatementService {
    private final StatementRepository statementRepository;
    private final AccountRepository accountRepository;


    public StatementService(StatementRepository statementRepository, AccountRepository accountRepository) {
        this.statementRepository = statementRepository;
        this.accountRepository = accountRepository;
    }

    
    public Statement createStatement(Statement statement) {
        Account account = accountRepository.findByAccountNumber(statement.getAccount().getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException(statement.getAccount().getAccountNumber()));
        statement.setAccount(account);
        return statementRepository.save(statement);
    }


    
    public List<Statement> listStatements() {
        return statementRepository.findAll();
    }

    
    public Statement getStatementById(  UUID id) {
        return statementRepository.findById(id).orElseThrow(() -> new StatementNotFoundException());
    }

    public List<Statement> findStatementsByAccountNumber(String accountNumber) {
        return statementRepository.findStatementsByAccount_AccountNumber(accountNumber);
    }

    public void deleteAllStatement() {
        statementRepository.deleteAll();
    }
}

