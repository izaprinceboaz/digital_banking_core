package com.bok.account.service;

import com.bok.account.entity.AccountType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AccountNumberGenerator {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public String generate(AccountType accountType) {
        Long nextVal = (Long) entityManager
                .createNativeQuery("SELECT nextval('account_number_seq')")
                .getSingleResult();

        String prefix = switch (accountType) {
            case DEPOSIT    -> "ACC-1";
            case SAVINGS    -> "ACC-2";
            case WITHDRAWAL -> "ACC-3";
        };

        return prefix + String.format("%07d", nextVal);
    }
}
