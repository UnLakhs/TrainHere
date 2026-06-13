package com.apostolos.backend.location;

import com.apostolos.backend.user.AppUser;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class LocationService {

    private static final BigDecimal MIN_LATITUDE = BigDecimal.valueOf(-90);
    private static final BigDecimal MAX_LATITUDE = BigDecimal.valueOf(90);
    private static final BigDecimal MIN_LONGITUDE = BigDecimal.valueOf(-180);
    private static final BigDecimal MAX_LONGITUDE = BigDecimal.valueOf(180);
    private static final BigDecimal MIN_RADIUS_KM = BigDecimal.valueOf(0);
    private static final BigDecimal MAX_RADIUS_KM = BigDecimal.valueOf(100);
    private static final BigDecimal METERS_PER_KILOMETER = BigDecimal.valueOf(1000);

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    //get all approved locations as a list
    public List<LocationResponse> getApprovedLocations() {
        return getLocationsByStatus(LocationStatus.APPROVED);
    }

    public List<LocationResponse> getApprovedLocationsWithinBounds(
            BigDecimal minLatitude,
            BigDecimal maxLatitude,
            BigDecimal minLongitude,
            BigDecimal maxLongitude
    ) {
        return locationRepository.findWithinBounds(
                        LocationStatus.APPROVED,
                        minLatitude,
                        maxLatitude,
                        minLongitude,
                        maxLongitude
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<NearbyLocationResponse> getNearbyApprovedLocations(
            BigDecimal latitude,
            BigDecimal longitude,
            BigDecimal radiusKm
    ) {
        validateNearbySearch(latitude, longitude, radiusKm);

        BigDecimal radiusMeters = radiusKm.multiply(METERS_PER_KILOMETER);

        return locationRepository.findNearbyApprovedLocations(
                        LocationStatus.APPROVED.name(),
                        latitude,
                        longitude,
                        radiusMeters
                )
                .stream()
                .map(this::mapNearbyProjectionToResponse)
                .toList();
    }

    public List<LocationResponse> getPendingLocations() {
        return getLocationsByStatus(LocationStatus.PENDING);
    }

    public List<LocationResponse> getRejectedLocations() {
        return getLocationsByStatus(LocationStatus.REJECTED);
    }

    //get info on location
    public LocationResponse getLocationInfo(UUID id) {
        return locationRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));
    }

    public LocationResponse getApprovedLocationInfo(UUID id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));

        if (location.getStatus() != LocationStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found");
        }

        return mapToResponse(location);
    }

    //delete location
    public void deleteLocation(UUID id) {
        if (!locationRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "location not found");
        }
        locationRepository.deleteById(id);
    }

    //update location
    public LocationResponse updateLocation(UUID id, LocationRequest request) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "location not found"));

        applyRequestToEntity(request, location);
        Location savedLocation = locationRepository.save(location);
        return mapToResponse(savedLocation);
    }

    public LocationResponse updateLocationStatus(UUID id, LocationStatus status) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "location not found"));

        location.updateStatus(status);
        Location savedLocation = locationRepository.save(location);
        return mapToResponse(savedLocation);
    }

    //add location
    public LocationResponse createLocation(LocationRequest request, AppUser owner) {
        Location location = new Location(
                request.name(),
                request.type(),
                request.country(),
                request.city(),
                request.latitude(),
                request.longitude()
                );
        applyRequestToEntity(request, location);
        location.assignOwner(owner);

        Location savedLocation = locationRepository.save(location);
        return mapToResponse(savedLocation);
    }

    private void applyRequestToEntity(LocationRequest request, Location location) {
        location.updateDetails(
                request.name(),
                request.type(),
                request.description(),
                request.country(),
                request.city(),
                request.address(),
                request.latitude(),
                request.longitude()
        );
    }

    private List<LocationResponse> getLocationsByStatus(LocationStatus status) {
        return locationRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private LocationResponse mapToResponse(Location location) {
        return new LocationResponse(
                location.getId(),
                location.getName(),
                location.getType(),
                location.getStatus(),
                location.getDescription(),
                location.getCity(),
                location.getCountry(),
                location.getAddress(),
                location.getLatitude(),
                location.getLongitude(),
                location.getAverageRating(),
                location.getReviewCount()
        );
    }

    private NearbyLocationResponse mapNearbyProjectionToResponse(NearbyLocationProjection location) {
        return new NearbyLocationResponse(
                location.getId(),
                location.getName(),
                LocationType.valueOf(location.getType()),
                LocationStatus.valueOf(location.getStatus()),
                location.getDescription(),
                location.getCity(),
                location.getCountry(),
                location.getAddress(),
                location.getLatitude(),
                location.getLongitude(),
                location.getAverageRating(),
                location.getReviewCount(),
                location.getDistanceKm()
        );
    }

    private void validateNearbySearch(BigDecimal latitude, BigDecimal longitude, BigDecimal radiusKm) {
        if (latitude.compareTo(MIN_LATITUDE) < 0 || latitude.compareTo(MAX_LATITUDE) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Latitude must be between -90 and 90.");
        }

        if (longitude.compareTo(MIN_LONGITUDE) < 0 || longitude.compareTo(MAX_LONGITUDE) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Longitude must be between -180 and 180.");
        }

        if (radiusKm.compareTo(MIN_RADIUS_KM) <= 0 || radiusKm.compareTo(MAX_RADIUS_KM) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Radius must be greater than 0 and up to 100 km.");
        }
    }
}
