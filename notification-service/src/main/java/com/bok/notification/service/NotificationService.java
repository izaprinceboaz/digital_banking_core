package com.bok.notification.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.notification.entity.Notification;
import com.bok.notification.repository.NotificationRepository;

@Service
public class NotificationService {
    

    private final NotificationRepository notificationRepository;


    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(  Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> listNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(UUID id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public void deleteNotification(UUID id) {
        notificationRepository.deleteById(id);
    }
}