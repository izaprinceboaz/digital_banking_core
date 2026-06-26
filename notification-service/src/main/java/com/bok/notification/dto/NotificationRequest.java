package com.bok.notification.dto;

import java.util.UUID;

public class NotificationRequest {
    
    private UUID userId;    
    private String eventType;
    private String channel;
    private String title;
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
