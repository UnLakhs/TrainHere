package com.apostolos.backend.photo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.apostolos.backend.location.Location;
import com.apostolos.backend.location.LocationRepository;
import com.apostolos.backend.location.LocationStatus;
import com.apostolos.backend.user.AppUser;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class LocationPhotoService {

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final LocationPhotoRepository locationPhotoRepository;
    private final LocationRepository locationRepository;
    private final Path photoStorageDirectory;

    public LocationPhotoService(
            LocationPhotoRepository locationPhotoRepository,
            LocationRepository locationRepository,
            @Value("${trainhere.uploads.location-photos-dir:uploads/location-photos}") String photoStorageDirectory
    ) {
        this.locationPhotoRepository = locationPhotoRepository;
        this.locationRepository = locationRepository;
        this.photoStorageDirectory = Path.of(photoStorageDirectory).toAbsolutePath().normalize();
    }

    public List<LocationPhotoResponse> getApprovedPhotos(UUID locationId) {
        return locationPhotoRepository.findByLocationIdAndStatus(locationId, PhotoStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<LocationPhotoResponse> getPendingPhotos() {
        return getPhotosByStatus(PhotoStatus.PENDING);
    }

    public List<LocationPhotoResponse> getRejectedPhotos() {
        return getPhotosByStatus(PhotoStatus.REJECTED);
    }

    @Transactional
    public LocationPhotoResponse uploadPhoto(UUID locationId, MultipartFile file, String caption, AppUser uploadedBy) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found."));

        if (location.getStatus() != LocationStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Photos can only be uploaded for approved locations.");
        }

        validateFile(file);

        try {
            Files.createDirectories(photoStorageDirectory);

            String extension = getExtension(file.getContentType());
            String storageKey = locationId + "-" + Instant.now().toEpochMilli() + "-" + UUID.randomUUID() + extension;
            Path targetPath = photoStorageDirectory.resolve(storageKey).normalize();

            if (!targetPath.startsWith(photoStorageDirectory)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid photo path.");
            }

            file.transferTo(targetPath);

            LocationPhoto photo = new LocationPhoto(location, storageKey);
            photo.attachUploadDetails(
                    uploadedBy,
                    "/uploads/location-photos/" + storageKey,
                    normalizeCaption(caption),
                    file.getContentType(),
                    file.getSize()
            );

            return mapToResponse(locationPhotoRepository.save(photo));
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save photo.", exception);
        }
    }

    @Transactional
    public LocationPhotoResponse updatePhotoStatus(UUID photoId, PhotoStatus status) {
        LocationPhoto photo = locationPhotoRepository.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found."));

        photo.updateStatus(status);
        return mapToResponse(locationPhotoRepository.save(photo));
    }

    @Transactional
    public void deletePhoto(UUID photoId) {
        LocationPhoto photo = locationPhotoRepository.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found."));

        String storageKey = photo.getStorageKey();
        locationPhotoRepository.delete(photo);
        deleteStoredFile(storageKey);
    }

    private List<LocationPhotoResponse> getPhotosByStatus(PhotoStatus status) {
        return locationPhotoRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Photo file is required.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Photo must be up to 5MB.");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPG, PNG, and WEBP photos are allowed.");
        }
    }

    private String normalizeCaption(String caption) {
        if (caption == null || caption.isBlank()) {
            return null;
        }

        String trimmedCaption = caption.trim();

        if (trimmedCaption.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Caption must be up to 255 characters.");
        }

        return trimmedCaption;
    }

    private String getExtension(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported photo type.");
        };
    }

    private void deleteStoredFile(String storageKey) {
        Path targetPath = photoStorageDirectory.resolve(storageKey).normalize();

        if (!targetPath.startsWith(photoStorageDirectory)) {
            return;
        }

        try {
            Files.deleteIfExists(targetPath);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not delete photo file.", exception);
        }
    }

    private LocationPhotoResponse mapToResponse(LocationPhoto photo) {
        AppUser uploadedBy = photo.getUploadedBy();

        return new LocationPhotoResponse(
                photo.getId(),
                photo.getLocation().getId(),
                photo.getLocation().getName(),
                uploadedBy == null ? null : uploadedBy.getId(),
                uploadedBy == null ? null : uploadedBy.getDisplayName(),
                photo.getPublicUrl(),
                photo.getCaption(),
                photo.getContentType(),
                photo.getSizeBytes(),
                photo.getStatus(),
                photo.getCreatedAt()
        );
    }
}
