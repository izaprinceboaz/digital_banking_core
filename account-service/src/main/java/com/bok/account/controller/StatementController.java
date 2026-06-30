package com.bok.account.controller;

import com.bok.account.dto.CreateStatementRequest;
import com.bok.account.dto.StatementResponse;
import com.bok.account.entity.Account;
import com.bok.account.entity.Statement;
import com.bok.account.service.StatementService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statements")
public class StatementController {

    private final StatementService statementService;

    public StatementController(StatementService statementService) {
        this.statementService = statementService;
    }

    @PostMapping
    public StatementResponse createStatement(@Valid @RequestBody CreateStatementRequest request) {
        Account account = new Account();
        account.setAccountNumber(request.getAccountNumber());

        Statement statement = new Statement();
        statement.setAccount(account);
        statement.setTransactionRef(request.getTransactionRef());
        statement.setDescription(request.getDescription());
        statement.setAmount(request.getAmount());
        statement.setBalanceAfter(request.getBalanceAfter());
        statement.setEntryType(request.getEntryType());

        return StatementResponse.from(statementService.createStatement(statement));
    }

    @GetMapping
    public List<StatementResponse> listStatements() {
        return statementService.listStatements().stream()
                .map(StatementResponse::from)
                .collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public StatementResponse getStatementById(@PathVariable UUID id) {
        Statement statement = statementService.getStatementById(id);
        return StatementResponse.from(statement);
    }

    @DeleteMapping
    public void deleteStatement() {
        statementService.deleteAllStatement();
    }
}
