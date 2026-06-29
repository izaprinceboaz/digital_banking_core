package com.bok.savings.client;

import java.math.BigDecimal;
import java.util.UUID;

public record AccountResponse(UUID id, BigDecimal balance) {
}
