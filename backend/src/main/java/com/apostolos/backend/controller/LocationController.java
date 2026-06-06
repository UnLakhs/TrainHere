package com.apostolos.backend.controller;

import com.apostolos.backend.location.LocationRequest;
import com.apostolos.backend.location.LocationResponse;
import com.apostolos.backend.location.LocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
        return locationService.getLocationInfo(id);
    }

    @PutMapping("/{id}")
    public LocationResponse updateLocation(@PathVariable UUID id, @Valid @RequestBody LocationRequest request) {
        return locationService.updateLocation(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLocation(@PathVariable UUID id) {
        locationService.deleteLocation(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LocationResponse createLocation(@Valid @RequestBody LocationRequest request) {
        return locationService.createLocation(request);
    }
}
