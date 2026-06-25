package com.bok.account.controller;

import com.bok.account.entity.Statement;
import com.bok.account.service.StatementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/statements")
public class StatementController {

    private final StatementService statementService;

    public StatementController(StatementService statementService) {
        this.statementService = statementService;
    }

    @PostMapping
    public Statement createStatement(@RequestBody Statement statement) {
        return statementService.createStatement(statement);
    }

    @GetMapping
    public List<Statement> listStatements() {
        return statementService.listStatements();
    }

    @GetMapping("/{id}")
    public Statement getStatementById(@PathVariable UUID id) {
        return statementService.getStatementById(id);
    }
}
