package com.bok.savings.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AccountResponse(UUID id, UUID userId, BigDecimal balance) {}