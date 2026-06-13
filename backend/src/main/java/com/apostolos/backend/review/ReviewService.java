package com.apostolos.backend.review;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

import com.apostolos.backend.location.Location;
import com.apostolos.backend.location.LocationRepository;
import com.apostolos.backend.location.LocationStatus;
import com.apostolos.backend.user.AppUser;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final LocationRepository locationRepository;

    public ReviewService(ReviewRepository reviewRepository, LocationRepository locationRepository) {
        this.reviewRepository = reviewRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(UUID locationId, AppUser user) {
        return reviewRepository.findByLocationId(locationId)
                .stream()
                .map(review -> mapToResponse(review, user))
                .toList();
    }

    @Transactional
    public ReviewResponse createReview(UUID locationId, ReviewRequest request, AppUser user) {
        Location location = getApprovedLocation(locationId);

        reviewRepository.findByLocationIdAndUserId(locationId, user.getId())
                .ifPresent(review -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reviewed this location.");
                });

        Review review = reviewRepository.save(new Review(
                location,
                user,
                request.rating(),
                request.title(),
                request.comment()
        ));
        updateLocationRatingSummary(location);

        return mapToResponse(review, user);
    }

    @Transactional
    public ReviewResponse updateReview(UUID reviewId, ReviewRequest request, AppUser user) {
        Review review = getOwnedReview(reviewId, user);

        review.updateDetails(request.rating(), request.title(), request.comment());
        updateLocationRatingSummary(review.getLocation());

        return mapToResponse(review, user);
    }

    @Transactional
    public void deleteReview(UUID reviewId, AppUser user) {
        Review review = getOwnedReview(reviewId, user);
        Location location = review.getLocation();

        reviewRepository.delete(review);
        reviewRepository.flush();
        updateLocationRatingSummary(location);
    }

    private Location getApprovedLocation(UUID locationId) {
        return locationRepository.findById(locationId)
                .filter(location -> location.getStatus() == LocationStatus.APPROVED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found."));
    }

    private Review getOwnedReview(UUID reviewId, AppUser user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found."));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own reviews.");
        }

        return review;
    }

    private void updateLocationRatingSummary(Location location) {
        int reviewCount = reviewRepository.countByLocationId(location.getId());
        BigDecimal averageRating = reviewCount == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(reviewRepository.findAverageRatingByLocationId(location.getId()))
                        .setScale(2, RoundingMode.HALF_UP);

        location.updateRatingSummary(averageRating, reviewCount);
        locationRepository.save(location);
    }

    private ReviewResponse mapToResponse(Review review, AppUser currentUser) {
        return new ReviewResponse(
                review.getId(),
                review.getLocation().getId(),
                review.getUser().getId(),
                review.getUser().getDisplayName(),
                review.getRating(),
                review.getTitle(),
                review.getComment(),
                review.getCreatedAt(),
                review.getUpdatedAt(),
                currentUser != null && review.getUser().getId().equals(currentUser.getId())
        );
    }
}
