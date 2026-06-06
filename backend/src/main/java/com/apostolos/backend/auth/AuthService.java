package com.apostolos.backend.auth;

import com.apostolos.backend.user.AppUser;
import com.apostolos.backend.user.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (!registerRequest.password().equals(registerRequest.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        if (appUserRepository.findByEmail(registerRequest.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        String passwordHash = passwordEncoder.encode(registerRequest.password());
        AppUser user = new AppUser(
                registerRequest.email(),
                registerRequest.displayName(),
                passwordHash
        );

        AppUser savedUser = appUserRepository.save(user);
        return new AuthResponse(savedUser.getId(), savedUser.getEmail(), savedUser.getDisplayName());
    }
}
