package com.apostolos.backend.review;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByLocationId(UUID locationId);

    Optional<Review> findByLocationIdAndUserId(UUID locationId, UUID userId);

    @Query("select coalesce(avg(review.rating), 0) from Review review where review.location.id = :locationId")
    double findAverageRatingByLocationId(UUID locationId);

    int countByLocationId(UUID locationId);
}
