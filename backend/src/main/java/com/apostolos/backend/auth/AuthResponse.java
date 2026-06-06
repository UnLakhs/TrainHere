package com.apostolos.backend.auth;

import java.util.UUID;

public record AuthResponse(
        UUID userId,
        String email,
        String displayName) {
}
