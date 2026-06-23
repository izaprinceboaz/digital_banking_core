package com.bok.notification.controller;

import com.bok.notification.entity.NotificationPreference;
import com.bok.notification.repository.NotificationPreferenceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notification-preferences")
public class NotificationPreferenceController {

    private final NotificationPreferenceRepository notificationPreferenceRepository;

    public NotificationPreferenceController(NotificationPreferenceRepository notificationPreferenceRepository) {
        this.notificationPreferenceRepository = notificationPreferenceRepository;
    }

    @PostMapping
    public NotificationPreference createNotificationPreference(@RequestBody NotificationPreference notificationPreference) {
        return notificationPreferenceRepository.save(notificationPreference);
    }

    @GetMapping
    public List<NotificationPreference> listNotificationPreferences() {
        return notificationPreferenceRepository.findAll();
    }

    @GetMapping("/{id}")
    public NotificationPreference getNotificationPreferenceById(@PathVariable UUID id) {
        return notificationPreferenceRepository.findById(id).orElse(null);
    }
}
