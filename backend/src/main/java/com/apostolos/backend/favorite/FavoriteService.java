package com.apostolos.backend.favorite;

import com.apostolos.backend.location.Location;
import com.apostolos.backend.location.LocationRepository;
import com.apostolos.backend.location.LocationResponse;
import com.apostolos.backend.location.LocationStatus;
import com.apostolos.backend.user.AppUser;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final LocationRepository locationRepository;

    public FavoriteService(
            FavoriteRepository favoriteRepository,
            LocationRepository locationRepository
    ) {
        this.favoriteRepository = favoriteRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public List<FavoritesResponse> getFavorites(AppUser user) {
        return favoriteRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public FavoritesResponse addFavorite(UUID locationId, AppUser user) {
        return favoriteRepository.findByLocationIdAndUserId(locationId, user.getId())
                .map(this::mapToResponse)
                .orElseGet(() -> createFavorite(locationId, user));
    }

    @Transactional
    public void removeFavorite(UUID locationId, AppUser user) {
        favoriteRepository.deleteByLocationIdAndUserId(locationId, user.getId());
    }

    private FavoritesResponse createFavorite(UUID locationId, AppUser user) {
        Location location = locationRepository.findById(locationId)
                .filter(foundLocation -> foundLocation.getStatus() == LocationStatus.APPROVED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found."));

        Favorite favorite = favoriteRepository.save(new Favorite(location, user));

        return mapToResponse(favorite);
    }

    private FavoritesResponse mapToResponse(Favorite favorite) {
        return new FavoritesResponse(
                favorite.getId(),
                mapLocationToResponse(favorite.getLocation())
        );
    }

    private LocationResponse mapLocationToResponse(Location location) {
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
