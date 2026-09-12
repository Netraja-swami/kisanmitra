package com.kisanmitra.backend.service;

import com.kisanmitra.backend.model.ChatMessage;
import com.kisanmitra.backend.repository.ChatRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public void saveMessage(String userId,
                            String userMsg,
                            String aiMsg) {
        ChatMessage msg = new ChatMessage();
        msg.setUserId(userId);
        msg.setUserMessage(userMsg);
        msg.setAiResponse(aiMsg);
        msg.setTimestamp(LocalDateTime.now());
        chatRepository.save(msg);
    }

    public List<ChatMessage> getChatHistory(String userId) {
        return chatRepository
                .findByUserIdOrderByTimestampAsc(userId);
    }

    public void clearHistory(String userId) {
        chatRepository.deleteByUserId(userId);
    }
}