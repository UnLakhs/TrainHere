import type {
  LocationResponse,
  NearbyLocationResponse,
} from "../api/locations/locations";

export type LocationListItem = LocationResponse | NearbyLocationResponse;
export type LocationTypeFilter =
  | "ALL"
  | "FAVORITES"
  | "NEARBY"
  | LocationResponse["type"];
export type StandardLocationTypeFilter = Exclude<
  LocationTypeFilter,
  "FAVORITES" | "NEARBY"
>;

export type UserLocation = {
  latitude: number;
  longitude: number;
};

export type AdvancedLocationFilters = {
  hasReviewsOnly: boolean;
  maxDistanceKm: number;
  minimumRating: number;
};
