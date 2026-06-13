package com.apostolos.backend.favorite;

import java.util.List;
import java.util.UUID;

import com.apostolos.backend.user.AppUser;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public List<FavoritesResponse> getFavorites(@AuthenticationPrincipal AppUser user) {
        return favoriteService.getFavorites(user);
    }

    @PostMapping("/{locationId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FavoritesResponse addFavorite(
            @PathVariable UUID locationId,
            @AuthenticationPrincipal AppUser user
    ) {
        return favoriteService.addFavorite(locationId, user);
    }

    @DeleteMapping("/{locationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorite(
            @PathVariable UUID locationId,
            @AuthenticationPrincipal AppUser user
    ) {
        favoriteService.removeFavorite(locationId, user);
    }
}
