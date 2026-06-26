package com.bok.notification.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.notification.dto.NotificationRequest;
import com.bok.notification.entity.Notification;
import com.bok.notification.repository.NotificationRepository;
import com.bok.notification.exception.NotificationNotFoundException;

@Service
public class NotificationService {
    

    private final NotificationRepository notificationRepository;


    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setEventType(request.getEventType());
        notification.setChannel(request.getChannel());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        return notificationRepository.save(notification);
    }


    public List<Notification> listNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(UUID id) {
        return notificationRepository.findById(id).orElseThrow(() -> new NotificationNotFoundException());
    }

    public void deleteNotification(UUID id) {
        notificationRepository.deleteById(id);
    }
}