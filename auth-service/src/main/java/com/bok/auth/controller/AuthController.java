package com.bok.auth.controller;

import com.bok.auth.entity.User;
import com.bok.auth.service.AuthService;
import com.bok.auth.exception.UserNotFoundException;


import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;


    public AuthController( AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User createUser(@RequestBody User user) {
        return authService.register(user);
    }

    @GetMapping("/login")
    public Optional<User> login(@RequestParam String email, @RequestParam String passwordHash) {
        return authService.login(email, passwordHash);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}