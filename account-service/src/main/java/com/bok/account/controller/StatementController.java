package com.bok.account.controller;

import com.bok.account.entity.Statement;
import com.bok.account.repository.StatementRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/statements")
public class StatementController {

    private final StatementRepository statementRepository;

    public StatementController(StatementRepository statementRepository) {
        this.statementRepository = statementRepository;
    }

    @PostMapping
    public Statement createStatement(@RequestBody Statement statement) {
        return statementRepository.save(statement);
    }

    @GetMapping
    public List<Statement> listStatements() {
        return statementRepository.findAll();
    }

    @GetMapping("/{id}")
    public Statement getStatementById(@PathVariable UUID id) {
        return statementRepository.findById(id).orElse(null);
    }
}
