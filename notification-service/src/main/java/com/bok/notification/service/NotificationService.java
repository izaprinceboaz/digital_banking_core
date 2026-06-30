package com.bok.notification.service;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.bok.notification.client.AuthClient;
import com.bok.notification.dto.NotificationRequest;
import com.bok.notification.entity.Notification;
import com.bok.notification.repository.NotificationRepository;
import com.bok.notification.exception.NotificationNotFoundException;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final AuthClient authClient;
    private final EmailService emailService;


    public NotificationService(NotificationRepository notificationRepository, AuthClient authClient, EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.authClient = authClient;
        this.emailService = emailService;
    }

    public Notification createNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setEventType(request.getEventType());
        notification.setChannel(request.getChannel());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        Notification saved = notificationRepository.save(notification);

        if ("EMAIL".equalsIgnoreCase(saved.getChannel())) {
            try {
                String email = authClient.getUserEmail(saved.getUserId());
                emailService.sendEmail(email, saved.getTitle(), saved.getMessage());
            } catch (Exception ex) {
                log.warn("Failed to resolve email for user {}: {}", saved.getUserId(), ex.getMessage());
            }
        }

        return saved;
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