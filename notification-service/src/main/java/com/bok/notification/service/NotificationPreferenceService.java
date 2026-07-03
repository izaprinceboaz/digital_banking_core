package com.bok.notification.service;


import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.notification.entity.NotificationPreference;
import com.bok.notification.repository.NotificationPreferenceRepository;
import com.bok.notification.exception.NotificationPreferenceNotFoundException;

@Service
public class NotificationPreferenceService {

    
    private final NotificationPreferenceRepository notificationPreferenceRepository;


    public NotificationPreferenceService(NotificationPreferenceRepository notificationPreferenceRepository) {
        this.notificationPreferenceRepository = notificationPreferenceRepository;
    }

    public NotificationPreference createNotificationPreference(  NotificationPreference notificationPreference) {
        return notificationPreferenceRepository.save(notificationPreference);
    }

    public List<NotificationPreference> listNotificationPreferences() {
        return notificationPreferenceRepository.findAll();
    }

    public NotificationPreference getNotificationPreferenceById(  UUID id) {
        return notificationPreferenceRepository.findById(id).orElseThrow(() -> new NotificationPreferenceNotFoundException());
    }

    public List<NotificationPreference> findNotificationPreferencesByUserId(UUID userId) {
        return notificationPreferenceRepository.findNotificationPreferencesByUserId(userId);
    }

    public void deleteNotificationPreference(  UUID id) {
        notificationPreferenceRepository.deleteById(id);
    }
}
