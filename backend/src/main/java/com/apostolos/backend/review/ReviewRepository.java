package com.apostolos.backend.review;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByLocationId(UUID locationId);

    Optional<Review> findByLocationIdAndUserId(UUID locationId, UUID userId);
}
