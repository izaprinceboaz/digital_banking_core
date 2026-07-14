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

    public NotificationPreference getOrDefault(UUID userId) {
        return notificationPreferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    NotificationPreference pref = new NotificationPreference();
                    pref.setUserId(userId);
                    return pref;
                });
    }

    public NotificationPreference savePreference(UUID userId, NotificationPreference incoming) {
        NotificationPreference pref = notificationPreferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    NotificationPreference fresh = new NotificationPreference();
                    fresh.setUserId(userId);
                    return fresh;
                });
        pref.setEmailEnabled(incoming.isEmailEnabled());
        pref.setSmsEnabled(incoming.isSmsEnabled());
        pref.setInAppEnabled(incoming.isInAppEnabled());
        pref.setTransactionAlerts(incoming.isTransactionAlerts());
        pref.setLoginAlerts(incoming.isLoginAlerts());
        pref.setInterestAlerts(incoming.isInterestAlerts());
        return notificationPreferenceRepository.save(pref);
    }

    public List<NotificationPreference> listNotificationPreferences() {
        return notificationPreferenceRepository.findAll();
    }

    public NotificationPreference getNotificationPreferenceById(  UUID id) {
        return notificationPreferenceRepository.findById(id).orElseThrow(() -> new NotificationPreferenceNotFoundException());
    }

    public void deleteNotificationPreference(  UUID id) {
        notificationPreferenceRepository.deleteById(id);
    }
}
