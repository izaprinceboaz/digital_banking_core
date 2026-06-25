package com.bok.notification.controller;

import com.bok.notification.entity.NotificationPreference;
import com.bok.notification.service.NotificationPreferenceService;
import com.bok.notification.service.NotificationService;

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
    public NotificationPreference createNotificationPreference(@RequestBody NotificationPreference notificationPreference) {
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
}
