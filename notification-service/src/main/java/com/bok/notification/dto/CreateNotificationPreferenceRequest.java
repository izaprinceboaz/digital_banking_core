package com.bok.notification.dto;

import java.util.UUID;

public class CreateNotificationPreferenceRequest {

    private UUID userId;

    private boolean emailEnabled = true;
    private boolean smsEnabled = false;
    private boolean inAppEnabled = true;
    private boolean transactionAlerts = true;
    private boolean loginAlerts = true;
    private boolean interestAlerts = true;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public boolean isEmailEnabled() {
        return emailEnabled;
    }

    public void setEmailEnabled(boolean emailEnabled) {
        this.emailEnabled = emailEnabled;
    }

    public boolean isSmsEnabled() {
        return smsEnabled;
    }

    public void setSmsEnabled(boolean smsEnabled) {
        this.smsEnabled = smsEnabled;
    }

    public boolean isInAppEnabled() {
        return inAppEnabled;
    }

    public void setInAppEnabled(boolean inAppEnabled) {
        this.inAppEnabled = inAppEnabled;
    }

    public boolean isTransactionAlerts() {
        return transactionAlerts;
    }

    public void setTransactionAlerts(boolean transactionAlerts) {
        this.transactionAlerts = transactionAlerts;
    }

    public boolean isLoginAlerts() {
        return loginAlerts;
    }

    public void setLoginAlerts(boolean loginAlerts) {
        this.loginAlerts = loginAlerts;
    }

    public boolean isInterestAlerts() {
        return interestAlerts;
    }

    public void setInterestAlerts(boolean interestAlerts) {
        this.interestAlerts = interestAlerts;
    }
}
