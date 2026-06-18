import { useMemo, useState } from "react";
import LocationControls from "./LocationControls";
import LocationMap from "./LocationMap";
import LocationResults from "./LocationResults";
import { NEARBY_RADIUS_KM } from "./locationConstants";
import type { AdvancedLocationFilters } from "./locationTypes";
import { filterLocations } from "./locationUtils";
import { useFavorites } from "./useFavorites";
import { useLocations } from "./useLocations";

const defaultAdvancedFilters: AdvancedLocationFilters = {
  hasReviewsOnly: false,
  maxDistanceKm: NEARBY_RADIUS_KM,
  minimumRating: 0,
};

const LocationList = () => {
  const [search, setSearch] = useState("");
  const [advancedFilters, setAdvancedFilters] =
    useState<AdvancedLocationFilters>(defaultAdvancedFilters);
  const {
    fetchAllLocations,
    handleNearbyClick,
    handleTypeFilterClick,
    isLocating,
    locations,
    message,
    nearbyMessage,
    selectedLocationId,
    setSelectedLocationId,
    setTypeFilter,
    status,
    typeFilter,
    userLocation,
  } = useLocations();
  const {
    favoriteLocationIds,
    favoriteMessage,
    handleFavoriteClick,
    handleFavoritesClick,
    isUserAuthenticated,
  } = useFavorites({
    fetchAllLocations,
    setSelectedLocationId,
    setTypeFilter,
    typeFilter,
  });

  const filteredLocations = useMemo(
    () =>
      filterLocations(
        locations,
        favoriteLocationIds,
        search,
        typeFilter,
        advancedFilters,
      ),
    [advancedFilters, favoriteLocationIds, locations, search, typeFilter],
  );

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:h-[calc(100vh-15rem)] lg:min-h-136 lg:grid-cols-[minmax(360px,480px)_1fr]">
      <div className="flex min-h-0 flex-col gap-4">
        <LocationControls
          advancedFilters={advancedFilters}
          isLocating={isLocating}
          nearbyMessage={nearbyMessage}
          onAdvancedFiltersChange={setAdvancedFilters}
          onFavoritesClick={() => void handleFavoritesClick()}
          onNearbyClick={handleNearbyClick}
          onSearchChange={setSearch}
          onTypeFilterClick={(nextFilter) =>
            void handleTypeFilterClick(nextFilter)
          }
          search={search}
          typeFilter={typeFilter}
        />

        <LocationResults
          favoriteLocationIds={favoriteLocationIds}
          favoriteMessage={favoriteMessage}
          isUserAuthenticated={isUserAuthenticated}
          locations={filteredLocations}
          message={message}
          onFavoriteClick={handleFavoriteClick}
          onSelectLocation={setSelectedLocationId}
          selectedLocationId={selectedLocationId}
          status={status}
          typeFilter={typeFilter}
        />
      </div>

      <LocationMap
        locations={filteredLocations}
        onSelectLocation={setSelectedLocationId}
        selectedLocationId={selectedLocationId}
        userLocation={userLocation}
      />
    </section>
  );
};

export default LocationList;
