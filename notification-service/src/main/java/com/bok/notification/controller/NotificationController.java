package com.bok.notification.controller;

import com.bok.notification.entity.Notification;
import com.bok.notification.service.NotificationService;
import com.bok.notification.dto.NotificationRequest;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public Notification createNotification(@Valid @RequestBody NotificationRequest notification) {
        return notificationService.createNotification(notification);
    }

    @GetMapping
    public List<Notification> listNotifications() {
        return notificationService.listNotifications();
    }

    @GetMapping("/{id}")
    public Notification getNotificationById(@PathVariable UUID id) {
        return notificationService.getNotificationById(id);
    }

    @GetMapping("/my-notifications")
    public List<Notification> findNotificationsByUserId(@AuthenticationPrincipal String userId) {
        return notificationService.findNotificationsByUserId(UUID.fromString(userId));
    }


    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable UUID id) {
        notificationService.deleteNotification(id);
    }

    @PatchMapping("/{id}/mark-as-read")
    public void markNotificationAsRead(@PathVariable UUID id) {
        notificationService.markNotificationAsRead(id);
    }

}
