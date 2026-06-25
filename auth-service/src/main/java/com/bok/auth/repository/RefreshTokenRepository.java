package com.bok.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bok.auth.entity.RefreshToken;

import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    
}
