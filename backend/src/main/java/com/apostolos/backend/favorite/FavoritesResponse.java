package com.apostolos.backend.favorite;

import com.apostolos.backend.location.LocationResponse;

import java.util.UUID;

public record FavoritesResponse(
        UUID id,
        LocationResponse location
) {
}
