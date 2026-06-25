package com.bok.auth.service;

import com.bok.auth.entity.RefreshToken;
import com.bok.auth.repository.RefreshTokenRepository;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public RefreshToken createRefreshToken(RefreshToken refreshToken) {
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken getRefreshTokenById(UUID id) {
        return refreshTokenRepository.findById(id).orElse(null);
    }
}