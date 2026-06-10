package com.apostolos.backend.location;

import java.math.BigDecimal;
import java.util.UUID;

public record LocationResponse (
        UUID id,
        String name,
        LocationType type,
        LocationStatus status,
        String description,
        String city,
        String country,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal averageRating,
        int reviewCount
) {

}
