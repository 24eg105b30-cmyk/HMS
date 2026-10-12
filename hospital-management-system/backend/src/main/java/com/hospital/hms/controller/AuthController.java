package com.hospital.hms.controller;

import com.hospital.hms.model.ApiResponse;
import com.hospital.hms.model.User;
import com.hospital.hms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 1. Sign Up / Register Endpoint
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signup(@Valid @RequestBody User user) {
        User savedUser = authService.register(user);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("id", savedUser.getId());
        responseData.put("username", savedUser.getUsername());
        responseData.put("fullName", savedUser.getFullName());
        responseData.put("email", savedUser.getEmail());
        responseData.put("role", savedUser.getRole());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(responseData, "Account registered successfully"));
    }

    // 2. Log In Endpoint
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Username and password are required");
        }

        User user = authService.login(username.trim(), password.trim());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("id", user.getId());
        responseData.put("username", user.getUsername());
        responseData.put("fullName", user.getFullName());
        responseData.put("email", user.getEmail());
        responseData.put("role", user.getRole());

        return ResponseEntity.ok(ApiResponse.success(responseData, "Login successful"));
    }
}
