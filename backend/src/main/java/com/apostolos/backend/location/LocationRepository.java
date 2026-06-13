package com.apostolos.backend.location;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LocationRepository extends JpaRepository<Location, UUID> {

    List<Location> findByStatus(LocationStatus status);

    List<Location> findByTypeAndStatus(LocationType type, LocationStatus status);

    @Query("""
        select location
        from Location location
        where location.status = :status
          and location.latitude between :minLatitude and :maxLatitude
          and location.longitude between :minLongitude and :maxLongitude
        """)
    List<Location> findWithinBounds(
        @Param("status") LocationStatus status,
        @Param("minLatitude") BigDecimal minLatitude,
        @Param("maxLatitude") BigDecimal maxLatitude,
        @Param("minLongitude") BigDecimal minLongitude,
        @Param("maxLongitude") BigDecimal maxLongitude
    );

    @Query(value = """
        select
            id,
            name,
            type,
            status,
            description,
            city,
            country,
            address,
            latitude,
            longitude,
            average_rating as "averageRating",
            review_count as "reviewCount",
            round(
                (
                    ST_Distance(
                        coordinates,
                        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
                    ) / 1000
                )::numeric,
                2
            ) as "distanceKm"
        from locations
        where status = :status
          and ST_DWithin(
              coordinates,
              ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
              :radiusMeters
          )
        order by ST_Distance(
            coordinates,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
        )
        """, nativeQuery = true)
    List<NearbyLocationProjection> findNearbyApprovedLocations(
            @Param("status") String status,
            @Param("latitude") BigDecimal latitude,
            @Param("longitude") BigDecimal longitude,
            @Param("radiusMeters") BigDecimal radiusMeters
    );
}
