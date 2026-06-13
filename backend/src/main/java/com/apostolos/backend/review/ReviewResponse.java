package com.apostolos.backend.review;

import java.time.Instant;
import java.util.UUID;

public record ReviewResponse(
        UUID id,
        UUID locationId,
        UUID userId,
        String displayName,
        short rating,
        String title,
        String comment,
        Instant createdAt,
        Instant updatedAt,
        boolean ownedByCurrentUser
) {
}
