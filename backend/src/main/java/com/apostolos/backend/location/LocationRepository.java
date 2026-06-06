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
}
