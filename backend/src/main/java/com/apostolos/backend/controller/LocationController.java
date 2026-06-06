package com.apostolos.backend.controller;

import com.apostolos.backend.location.LocationRequest;
import com.apostolos.backend.location.LocationResponse;
import com.apostolos.backend.location.LocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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
}
