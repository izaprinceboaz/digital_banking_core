package com.bok.notification.controller;

import com.bok.notification.dto.CreateNotificationPreferenceRequest;
import com.bok.notification.entity.NotificationPreference;
import com.bok.notification.service.NotificationPreferenceService;
import com.bok.notification.service.NotificationService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notification-preferences")
public class NotificationPreferenceController {

    private final NotificationPreferenceService notificationPreferenceService;

    public NotificationPreferenceController(NotificationPreferenceService notificationPreferenceService) {
        this.notificationPreferenceService = notificationPreferenceService;
    }

    @PostMapping
    public NotificationPreference createNotificationPreference(@Valid @RequestBody CreateNotificationPreferenceRequest request) {
        NotificationPreference notificationPreference = new NotificationPreference();
        notificationPreference.setUserId(request.getUserId());
        notificationPreference.setEmailEnabled(request.isEmailEnabled());
        notificationPreference.setSmsEnabled(request.isSmsEnabled());
        notificationPreference.setInAppEnabled(request.isInAppEnabled());
        notificationPreference.setTransactionAlerts(request.isTransactionAlerts());
        notificationPreference.setLoginAlerts(request.isLoginAlerts());
        notificationPreference.setInterestAlerts(request.isInterestAlerts());

        return notificationPreferenceService.createNotificationPreference(notificationPreference);
    }

    @GetMapping
    public List<NotificationPreference> listNotificationPreferences() {
        return notificationPreferenceService.listNotificationPreferences();
    }

    @GetMapping("/{id}")
    public NotificationPreference getNotificationPreferenceById(@PathVariable UUID id) {
        return notificationPreferenceService.getNotificationPreferenceById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteNotificationPreference(@PathVariable UUID id) {
        notificationPreferenceService.deleteNotificationPreference(id);
    }
}
