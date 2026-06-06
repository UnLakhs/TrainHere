package com.apostolos.backend.review;

import java.time.Instant;
import java.util.UUID;

import com.apostolos.backend.location.Location;
import com.apostolos.backend.user.AppUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "reviews",
    uniqueConstraints = @UniqueConstraint(name = "reviews_location_user_unique", columnNames = {"location_id", "user_id"})
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(nullable = false)
    private short rating;

    @Column(length = 160)
    private String title;

    @Column(columnDefinition = "text")
    private String comment;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    protected Review() {
    }

    public Review(Location location, AppUser user, short rating) {
        this.location = location;
        this.user = user;
        this.rating = rating;
    }

    public UUID getId() {
        return id;
    }
}
