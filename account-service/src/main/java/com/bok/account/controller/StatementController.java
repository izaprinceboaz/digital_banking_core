package com.bok.account.controller;

import com.bok.account.dto.StatementResponse;
import com.bok.account.entity.Statement;
import com.bok.account.exception.StatementNotFoundException;
import com.bok.account.service.StatementService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public StatementResponse createStatement(@RequestBody Statement statement) {
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

    @ExceptionHandler(StatementNotFoundException.class)
    public ResponseEntity<String> handleNotFound(StatementNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
