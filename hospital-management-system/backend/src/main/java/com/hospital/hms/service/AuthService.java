package com.hospital.hms.service;

import com.hospital.hms.exception.DuplicateResourceException;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.model.User;
import com.hospital.hms.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;

    // Resilient in-memory fallback store when MongoDB Atlas connection is not yet configured by the user
    private final Map<String, User> fallbackUserStore = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;

        // Initialize default administrator in fallback store
        User defaultAdmin = new User("admin", "admin123", "System Administrator", "admin@hospital.com", "ADMIN");
        defaultAdmin.setId("USER-DEFAULT-001");
        fallbackUserStore.put("admin", defaultAdmin);

        User defaultDoctor = new User("doctor", "doctor123", "Dr. Marcus Vance", "doctor@hospital.com", "DOCTOR");
        defaultDoctor.setId("USER-DEFAULT-002");
        fallbackUserStore.put("doctor", defaultDoctor);
    }

    public User register(User user) {
        // Attempt persistent MongoDB Atlas registration
        try {
            if (userRepository.existsByUsername(user.getUsername())) {
                throw new DuplicateResourceException("Username '" + user.getUsername() + "' is already taken");
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new DuplicateResourceException("Email '" + user.getEmail() + "' is already registered");
            }
            User saved = userRepository.save(user);
            fallbackUserStore.put(user.getUsername(), saved);
            return saved;
        } catch (DuplicateResourceException e) {
            throw e;
        } catch (Exception ex) {
            log.warn("MongoDB Atlas offline/unreachable during registration. Saving to resilient local cache: {}", ex.getMessage());

            if (fallbackUserStore.containsKey(user.getUsername())) {
                throw new DuplicateResourceException("Username '" + user.getUsername() + "' is already taken");
            }
            if (user.getId() == null || user.getId().isEmpty()) {
                user.setId("USR-" + System.currentTimeMillis());
            }
            fallbackUserStore.put(user.getUsername(), user);
            return user;
        }
    }

    public User login(String username, String password) {
        // 1. Try querying MongoDB Atlas
        try {
            Optional<User> dbUser = userRepository.findByUsername(username);
            if (dbUser.isPresent()) {
                User user = dbUser.get();
                if (!user.getPassword().equals(password)) {
                    throw new IllegalArgumentException("Invalid password. Please check your credentials.");
                }
                return user;
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception ex) {
            log.warn("MongoDB Atlas offline/unreachable during login check. Checking resilient local store: {}", ex.getMessage());
        }

        // 2. Fallback check for offline/unconfigured environments & demo credentials
        User cachedUser = fallbackUserStore.get(username);
        if (cachedUser != null) {
            if (!cachedUser.getPassword().equals(password)) {
                throw new IllegalArgumentException("Invalid password. Please check your credentials.");
            }
            return cachedUser;
        }

        // Allow instant evaluation access with common demo credentials if user entered them
        if (("admin".equalsIgnoreCase(username) && "admin123".equals(password)) ||
            ("demo".equalsIgnoreCase(username) && "demo123".equals(password))) {
            User demo = new User(username, password, "Administrator (" + username + ")", username + "@hospital.com", "ADMIN");
            demo.setId("USR-DEMO-" + username);
            fallbackUserStore.put(username, demo);
            return demo;
        }

        throw new ResourceNotFoundException("User not found with username: " + username + ". Click 'Create Account' to sign up or use 'admin' / 'admin123'.");
    }

    public Optional<User> findByUsername(String username) {
        try {
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent()) return user;
        } catch (Exception ignored) {
        }
        return Optional.ofNullable(fallbackUserStore.get(username));
    }
}
