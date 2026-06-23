package com.bok.notification.controller;

import com.bok.notification.entity.Notification;
import com.bok.notification.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    public Notification createNotification(@RequestBody Notification notificatin) {
        return notificationRepository.save(notificatin);
    }

    @GetMapping
    public List<Notification> listNotifications() {
        return notificationRepository.findAll();
    }

    @GetMapping("/{id}")
    public Notification getNotificationById(@PathVariable UUID id) {
        return notificationRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable UUID id) {
        notificationRepository.deleteById(id);
    }
}
