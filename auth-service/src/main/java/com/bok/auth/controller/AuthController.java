package com.bok.auth.controller;

import com.bok.auth.service.AuthService;
import com.bok.auth.exception.DuplicationEmailException;
import com.bok.auth.exception.InvalidCredentialsException;
import com.bok.auth.exception.InvalidRefreshTokenException;
import com.bok.auth.exception.UserNotFoundException;
import com.bok.auth.dto.AuthResponse;
import com.bok.auth.dto.LoginRequest;
import com.bok.auth.dto.RefreshTokenRequest;
import com.bok.auth.dto.RegisterRequest;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;


    public AuthController( AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse createUser(@Valid @RequestBody RegisterRequest user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refreshAccessToken(request.getRefreshToken());
    }

    // @PostMapping("/logout")
    // public AuthResponse logout(@RequestBody RefreshTokenRequest request) {
    //     return authService.logout(request.getRefreshToken());
    
    // }

    @ExceptionHandler(DuplicationEmailException.class)
    public ResponseEntity<String> handleDuplicateEmail(DuplicationEmailException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<String> handleInvalidRefreshToken(InvalidRefreshTokenException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }


    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

}