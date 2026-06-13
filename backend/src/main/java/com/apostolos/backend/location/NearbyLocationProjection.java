package com.apostolos.backend.location;

import java.math.BigDecimal;
import java.util.UUID;

public interface NearbyLocationProjection {

    UUID getId();

    String getName();

    String getType();

    String getStatus();

    String getDescription();

    String getCity();

    String getCountry();

    String getAddress();

    BigDecimal getLatitude();

    BigDecimal getLongitude();

    BigDecimal getAverageRating();

    int getReviewCount();

    BigDecimal getDistanceKm();
}
