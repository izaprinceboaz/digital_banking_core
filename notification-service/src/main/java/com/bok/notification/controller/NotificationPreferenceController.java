package com.bok.notification.controller;

import com.bok.notification.dto.CreateNotificationPreferenceRequest;
import com.bok.notification.entity.NotificationPreference;
import com.bok.notification.service.NotificationPreferenceService;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public NotificationPreference saveNotificationPreference(
        @Valid @RequestBody CreateNotificationPreferenceRequest request,
        @AuthenticationPrincipal String userId) {
        NotificationPreference incoming = new NotificationPreference();
        incoming.setEmailEnabled(request.isEmailEnabled());
        incoming.setSmsEnabled(request.isSmsEnabled());
        incoming.setInAppEnabled(request.isInAppEnabled());
        incoming.setTransactionAlerts(request.isTransactionAlerts());
        incoming.setLoginAlerts(request.isLoginAlerts());
        incoming.setInterestAlerts(request.isInterestAlerts());

        return notificationPreferenceService.savePreference(UUID.fromString(userId), incoming);
    }

    @GetMapping
    public List<NotificationPreference> listNotificationPreferences() {
        return notificationPreferenceService.listNotificationPreferences();
    }

    @GetMapping("/{id}")
    public NotificationPreference getNotificationPreferenceById(@PathVariable UUID id) {
        return notificationPreferenceService.getNotificationPreferenceById(id);
    }

    @GetMapping("/my-notification-preferences")
    public NotificationPreference getMyNotificationPreferences(@AuthenticationPrincipal String userId) {
        return notificationPreferenceService.getOrDefault(UUID.fromString(userId));
    }

    @DeleteMapping("/{id}")
    public void deleteNotificationPreference(@PathVariable UUID id) {
        notificationPreferenceService.deleteNotificationPreference(id);
    }
}
