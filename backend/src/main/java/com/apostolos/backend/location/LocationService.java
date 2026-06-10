package com.apostolos.backend.location;

import com.apostolos.backend.user.AppUser;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    //get all approved locations as a list
    public List<LocationResponse> getApprovedLocations() {
        return getLocationsByStatus(LocationStatus.APPROVED);
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
}
