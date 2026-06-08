package com.apostolos.backend.user;

import java.util.UUID;

public record CurrentUserResponse(
        UUID id,
        String email,
        String displayName,
        UserRole role) {
}
