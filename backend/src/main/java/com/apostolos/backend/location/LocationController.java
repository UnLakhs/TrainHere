package com.apostolos.backend.location;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.apostolos.backend.user.AppUser;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public List<LocationResponse> getLocations() {
        return locationService.getApprovedLocations();
    }

    @GetMapping("/bounds")
    public List<LocationResponse> getLocationsWithinBounds(
            @RequestParam BigDecimal minLatitude,
            @RequestParam BigDecimal maxLatitude,
            @RequestParam BigDecimal minLongitude,
            @RequestParam BigDecimal maxLongitude
    ) {
        return locationService.getApprovedLocationsWithinBounds(
                minLatitude,
                maxLatitude,
                minLongitude,
                maxLongitude
        );
    }

    @GetMapping("/nearby")
    public List<NearbyLocationResponse> getNearbyLocations(
            @RequestParam BigDecimal latitude,
            @RequestParam BigDecimal longitude,
            @RequestParam(defaultValue = "10") BigDecimal radiusKm
    ) {
        return locationService.getNearbyApprovedLocations(latitude, longitude, radiusKm);
    }

    @GetMapping("/pending")
    public List<LocationResponse> getPendingLocations() {
        return locationService.getPendingLocations();
    }

    @GetMapping("/rejected")
    public List<LocationResponse> getRejectedLocations() {
        return locationService.getRejectedLocations();
    }

    @GetMapping("/{id}")
    public LocationResponse getLocationInfo(@PathVariable UUID id) {
        return locationService.getApprovedLocationInfo(id);
    }

    @GetMapping("/admin/{id}")
    public LocationResponse getAdminLocationInfo(@PathVariable UUID id) {
        return locationService.getLocationInfo(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LocationResponse createLocation(
            @AuthenticationPrincipal AppUser user,
            @Valid @RequestBody LocationRequest request
    ) {
        return locationService.createLocation(request, user);
    }

    @PutMapping("/{id}")
    public LocationResponse updateLocation(@PathVariable UUID id, @Valid @RequestBody LocationRequest request) {
        return locationService.updateLocation(id, request);
    }

    @PatchMapping("/{id}/status")
    public LocationResponse updateLocationStatus(
            @PathVariable UUID id,
            @Valid @RequestBody LocationStatusRequest request
    ) {
        return locationService.updateLocationStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLocation(@PathVariable UUID id) {
        locationService.deleteLocation(id);
    }
}
