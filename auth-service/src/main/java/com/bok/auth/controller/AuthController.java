package com.bok.auth.controller;

import com.bok.auth.service.AuthService;
import com.bok.auth.dto.AuthResponse;
import com.bok.auth.dto.UpdatePasswordRequest;
import com.bok.auth.dto.LoginRequest;
import com.bok.auth.dto.RefreshTokenRequest;
import com.bok.auth.dto.RegisterRequest;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @PostMapping("/logout")
    public void logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
    }

    @PostMapping("/update-password")
    public void changePassword(@Valid @RequestBody UpdatePasswordRequest request,
                               @AuthenticationPrincipal String userId) {
        authService.updatePassword(UUID.fromString(userId), request.getCurrentPassword(), request.getNewPassword());
    }

}