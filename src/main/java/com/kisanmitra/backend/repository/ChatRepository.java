package com.kisanmitra.backend.repository;

import com.kisanmitra.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository
        extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByUserIdOrderByTimestampAsc(
            String userId
    );

    void deleteByUserId(String userId);
}