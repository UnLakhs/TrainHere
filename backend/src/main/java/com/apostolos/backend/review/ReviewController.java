package com.apostolos.backend.review;

import java.util.List;
import java.util.UUID;

import com.apostolos.backend.user.AppUser;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/locations/{locationId}/reviews")
    public List<ReviewResponse> getReviews(
            @PathVariable UUID locationId,
            @AuthenticationPrincipal AppUser user
    ) {
        return reviewService.getReviews(locationId, user);
    }

    @PostMapping("/locations/{locationId}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(
            @PathVariable UUID locationId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal AppUser user
    ) {
        return reviewService.createReview(locationId, request, user);
    }

    @PutMapping("/reviews/{reviewId}")
    public ReviewResponse updateReview(
            @PathVariable UUID reviewId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal AppUser user
    ) {
        return reviewService.updateReview(reviewId, request, user);
    }

    @DeleteMapping("/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(
            @PathVariable UUID reviewId,
            @AuthenticationPrincipal AppUser user
    ) {
        reviewService.deleteReview(reviewId, user);
    }
}
