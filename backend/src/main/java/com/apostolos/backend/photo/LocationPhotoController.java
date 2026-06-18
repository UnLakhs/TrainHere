package com.apostolos.backend.photo;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class LocationPhotoController {

    private final LocationPhotoService locationPhotoService;

    public LocationPhotoController(LocationPhotoService locationPhotoService) {
        this.locationPhotoService = locationPhotoService;
    }

    @GetMapping("/locations/{locationId}/photos")
    public List<LocationPhotoResponse> getApprovedPhotos(@PathVariable UUID locationId) {
        return locationPhotoService.getApprovedPhotos(locationId);
    }

    @PostMapping("/locations/{locationId}/photos")
    @ResponseStatus(HttpStatus.CREATED)
    public LocationPhotoResponse uploadPhoto(
            @PathVariable UUID locationId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption,
            @AuthenticationPrincipal AppUser user
    ) {
        return locationPhotoService.uploadPhoto(locationId, file, caption, user);
    }

    @GetMapping("/photos/pending")
    public List<LocationPhotoResponse> getPendingPhotos() {
        return locationPhotoService.getPendingPhotos();
    }

    @GetMapping("/photos/rejected")
    public List<LocationPhotoResponse> getRejectedPhotos() {
        return locationPhotoService.getRejectedPhotos();
    }

    @PatchMapping("/photos/{photoId}/status")
    public LocationPhotoResponse updatePhotoStatus(
            @PathVariable UUID photoId,
            @Valid @RequestBody PhotoStatusRequest request
    ) {
        return locationPhotoService.updatePhotoStatus(photoId, request.status());
    }

    @DeleteMapping("/photos/{photoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePhoto(@PathVariable UUID photoId) {
        locationPhotoService.deletePhoto(photoId);
    }
}
