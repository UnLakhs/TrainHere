import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { hasAuthToken, subscribeToAuthChanges } from "../api/auth/auth";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../api/favorites/favorites";
import type {
  LocationTypeFilter,
  StandardLocationTypeFilter,
} from "./locationTypes";

type UseFavoritesParams = {
  fetchAllLocations: (nextFilter?: StandardLocationTypeFilter) => Promise<void>;
  setSelectedLocationId: Dispatch<SetStateAction<string | null>>;
  setTypeFilter: Dispatch<SetStateAction<LocationTypeFilter>>;
  typeFilter: LocationTypeFilter;
};

export const useFavorites = ({
  fetchAllLocations,
  setSelectedLocationId,
  setTypeFilter,
  typeFilter,
}: UseFavoritesParams) => {
  const [favoriteLocationIds, setFavoriteLocationIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(hasAuthToken());

  useEffect(() => {
    const syncAuthState = () => {
      const hasToken = hasAuthToken();
      setIsUserAuthenticated(hasToken);

      if (hasToken) {
        setFavoriteMessage("");
      } else {
        setFavoriteLocationIds(new Set());
      }
    };

    return subscribeToAuthChanges(syncAuthState);
  }, []);

  useEffect(() => {
    let shouldIgnore = false;

    if (!isUserAuthenticated) {
      return () => {
        shouldIgnore = true;
      };
    }

    getFavorites()
      .then((favorites) => {
        if (shouldIgnore) {
          return;
        }

        const nextFavoriteIds = new Set(
          favorites.map((favorite) => favorite.location.id),
        );

        setFavoriteLocationIds(nextFavoriteIds);

        if (typeFilter === "FAVORITES" && nextFavoriteIds.size === 0) {
          setSelectedLocationId(null);
        }
      })
      .catch((error: unknown) => {
        if (shouldIgnore) {
          return;
        }

        console.error("Error loading favorites:", error);
        setFavoriteMessage(
          error instanceof Error ? error.message : "Could not load favorites.",
        );
      });

    return () => {
      shouldIgnore = true;
    };
  }, [isUserAuthenticated, setSelectedLocationId, typeFilter]);

  const handleFavoritesClick = async () => {
    if (!isUserAuthenticated) {
      setFavoriteMessage("Sign in to see your favorite locations.");
      return;
    }

    setFavoriteMessage("");

    if (typeFilter === "NEARBY") {
      await fetchAllLocations("ALL");
    }

    setTypeFilter("FAVORITES");
  };

  const handleFavoriteClick = async (locationId: string) => {
    if (!isUserAuthenticated) {
      setFavoriteMessage("Sign in to save favorite locations.");
      return;
    }

    setFavoriteMessage("");
    const wasFavorite = favoriteLocationIds.has(locationId);
    const nextFavoriteIds = new Set(favoriteLocationIds);

    if (wasFavorite) {
      nextFavoriteIds.delete(locationId);
    } else {
      nextFavoriteIds.add(locationId);
    }

    setFavoriteLocationIds(nextFavoriteIds);

    if (wasFavorite && typeFilter === "FAVORITES") {
      setSelectedLocationId((currentSelectedLocationId) =>
        currentSelectedLocationId === locationId
          ? null
          : currentSelectedLocationId,
      );
    }

    try {
      if (wasFavorite) {
        await removeFavorite(locationId);
      } else {
        await addFavorite(locationId);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      setFavoriteLocationIds((currentFavoriteIds) => {
        const rollbackFavoriteIds = new Set(currentFavoriteIds);

        if (wasFavorite) {
          rollbackFavoriteIds.add(locationId);
        } else {
          rollbackFavoriteIds.delete(locationId);
        }

        return rollbackFavoriteIds;
      });
      setFavoriteMessage(
        error instanceof Error ? error.message : "Could not update favorite.",
      );
    }
  };

  return {
    favoriteLocationIds,
    favoriteMessage,
    handleFavoriteClick,
    handleFavoritesClick,
    isUserAuthenticated,
  };
};
