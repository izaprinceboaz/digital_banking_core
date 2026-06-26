package com.bok.auth.controller;

import com.bok.auth.entity.User;
import com.bok.auth.service.AuthService;
import com.bok.auth.exception.UserNotFoundException;
import com.bok.auth.dto.LoginRequest;
import com.bok.auth.dto.RegisterRequest;
import com.bok.auth.dto.UserResponse;

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
    public UserResponse createUser(@RequestBody RegisterRequest user) {
        return UserResponse.from(authService.register(user));
    }

    @GetMapping("/login")
    public UserResponse login(@RequestBody LoginRequest loginRequest) {
        return UserResponse.from(authService.login(loginRequest));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}