package com.kisanmitra.backend.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    private String userId;
    private String state;
    private String soil;
    private String season;
}