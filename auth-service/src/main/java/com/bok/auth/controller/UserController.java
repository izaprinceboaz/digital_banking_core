package com.bok.auth.controller;

import com.bok.auth.dto.UserResponse;
import com.bok.auth.service.AuthService;
import com.bok.auth.exception.UserNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController( AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public List<UserResponse> listUsers() {
        return authService.listUsers().stream().map(UserResponse::from).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable UUID id) {
        return UserResponse.from(authService.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        authService.deleteUser(id);
    }
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
