package com.apostolos.backend.photo;

import java.time.Instant;
import java.util.UUID;

import com.apostolos.backend.location.Location;
import com.apostolos.backend.user.AppUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "location_photos")
public class LocationPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id")
    private AppUser uploadedBy;

    @Column(nullable = false, length = 500)
    private String storageKey;

    @Column(columnDefinition = "text")
    private String publicUrl;

    @Column(length = 255)
    private String caption; 

    @Column(length = 120)
    private String contentType;

    private Long sizeBytes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PhotoStatus status = PhotoStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private final Instant createdAt = Instant.now();

    protected LocationPhoto() {
    }

    public LocationPhoto(Location location, String storageKey) {
        this.location = location;
        this.storageKey = storageKey;
    }

    public void attachUploadDetails(
            AppUser uploadedBy,
            String publicUrl,
            String caption,
            String contentType,
            Long sizeBytes
    ) {
        this.uploadedBy = uploadedBy;
        this.publicUrl = publicUrl;
        this.caption = caption;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
    }

    public void updateStatus(PhotoStatus status) {
        this.status = status;
    }
}
