package com.apostolos.backend.location;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<LocationResponse> getApprovedLocations() {
        return locationRepository.findByStatus(LocationStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }
    private LocationResponse mapToResponse(Location location) {
        return new LocationResponse(
                location.getId(),
                location.getName(),
                location.getType(),
                location.getCity(),
                location.getCountry(),
                location.getLatitude(),
                location.getLongitude(),
                location.getAverageRating(),
                location.getReviewCount()
        );
    }
}
