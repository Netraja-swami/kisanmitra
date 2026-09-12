package com.kisanmitra.backend.controller;

import com.kisanmitra.backend.dto.LoginRequest;
import com.kisanmitra.backend.dto.RegisterRequest;
import com.kisanmitra.backend.model.User;
import com.kisanmitra.backend.repository.UserRepository;
import com.kisanmitra.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userRepository.existsByMobile(request.getMobile())) {
            return ResponseEntity.badRequest()
                    .body("Mobile number already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setMobile(request.getMobile());

        // Internal email because database currently requires email
        user.setEmail(request.getMobile() + "@kisanmitra.local");

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        return ResponseEntity.ok("Registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByMobile(request.getMobile())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Invalid mobile number or password");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return ResponseEntity.status(401)
                    .body("Invalid mobile number or password");
        }

        String token = jwtService.generateToken(user.getMobile());

        return ResponseEntity.ok(
                java.util.Map.of(
                        "token", token,
                        "id", user.getId(),
                        "name", user.getName(),
                        "mobile", user.getMobile()
                )
        );
    }
}