package com.bok.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class NotificationRequest {

    @NotNull(message = "User id is required")
    private UUID userId;

    @NotBlank(message = "Event type is required")
    private String eventType;

    @NotBlank(message = "Channel is required")
    private String channel;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    public UUID getUserId() {
        return userId;
    } 

    public String getEventType() {
        return eventType;
    }

    public String getChannel() {
        return channel;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }
    
    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setMessage(String message) {
        this.message = message;
    }    
}
