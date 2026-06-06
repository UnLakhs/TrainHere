package com.apostolos.backend.location;

import java.math.BigDecimal;
import java.util.UUID;

public record LocationResponse (
        UUID id,
        String name,
        LocationType type,
        String city,
        String country,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal averageRating,
        int reviewCount
) {

}
