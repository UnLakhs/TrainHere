package com.apostolos.backend.photo;

import java.time.Instant;
import java.util.UUID;

public record LocationPhotoResponse(
        UUID id,
        UUID locationId,
        String locationName,
        UUID uploadedById,
        String uploadedByDisplayName,
        String publicUrl,
        String caption,
        String contentType,
        Long sizeBytes,
        PhotoStatus status,
        Instant createdAt
) {
}
