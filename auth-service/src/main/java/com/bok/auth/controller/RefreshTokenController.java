package com.bok.auth.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bok.auth.entity.RefreshToken;
import com.bok.auth.service.RefreshTokenService;

import java.util.UUID;

@RestController
@RequestMapping("/tokens")
public class RefreshTokenController {
    
    private final RefreshTokenService refreshTokenService;

    public RefreshTokenController(RefreshTokenService refreshTokenService) {
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/")
    public RefreshToken createRefreshToken(RefreshToken refreshToken) {
        return refreshTokenService.createRefreshToken(refreshToken);
    }

    @GetMapping("/{id}")
    public RefreshToken getRefreshTokenById(@PathVariable UUID id) {
        return refreshTokenService.getRefreshTokenById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteRefreshToken(@PathVariable UUID id) {
        refreshTokenService.deleteRefreshToken(id);
    }

}
