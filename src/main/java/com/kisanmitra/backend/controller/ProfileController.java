package com.kisanmitra.backend.controller;

import com.kisanmitra.backend.model.User;
import com.kisanmitra.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(
            @PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                new java.util.HashMap<String, Object>() {{
                    put("id", user.getId());
                    put("name", user.getName());
                    put("email", user.getEmail());
                    put("mobile", user.getMobile());
                    put("state", user.getState());
                    put("soil", user.getSoil());
                    put("season", user.getSeason());
                }}
        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody User profileData) {

        User user = userRepository.findById(userId)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setState(profileData.getState());
        user.setSoil(profileData.getSoil());
        user.setSeason(profileData.getSeason());

        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }
}