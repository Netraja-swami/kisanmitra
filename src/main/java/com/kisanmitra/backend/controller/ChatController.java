package com.kisanmitra.backend.controller;

import com.kisanmitra.backend.dto.ChatRequest;
import com.kisanmitra.backend.dto.ChatResponse;
import com.kisanmitra.backend.service.GeminiService;
import com.kisanmitra.backend.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final GeminiService geminiService;
    private final ChatService chatService;

    public ChatController(GeminiService geminiService,
                          ChatService chatService) {
        this.geminiService = geminiService;
        this.chatService = chatService;
    }

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request) {

        // Gemini se response lo with farmer context
        String aiResponse = geminiService.getResponse(
                request.getMessage(),
                request.getState(),
                request.getSoil(),
                request.getSeason()
        );

        // DB mein save karo
        chatService.saveMessage(
                request.getUserId(),
                request.getMessage(),
                aiResponse
        );

        return ResponseEntity.ok(
                new ChatResponse(aiResponse, true)
        );
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getChatHistory(
            @PathVariable String userId) {
        return ResponseEntity.ok(
                chatService.getChatHistory(userId)
        );
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearHistory(
            @PathVariable String userId) {
        chatService.clearHistory(userId);
        return ResponseEntity.ok("Chat cleared");
    }

    @PostMapping("/image")
    public ResponseEntity<?> analyzePlantImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam(defaultValue = "Uttar Pradesh") String state,
            @RequestParam(defaultValue = "Black Soil") String soil,
            @RequestParam(defaultValue = "Kharif") String season) {

        try {

            if (image.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Image is required");
            }

            String result = geminiService.analyzePlantImage(
                    image.getBytes(),
                    image.getContentType(),
                    state,
                    soil,
                    season
            );

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "response", result,
                            "success", true
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(
                            java.util.Map.of(
                                    "response",
                                    "Image analysis failed: " + e.getMessage(),
                                    "success",
                                    false
                            )
                    );
        }
    }
}