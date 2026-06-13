import { Link } from "react-router-dom";
import {
  getLocationTypeDotClass,
  getLocationTypeLabel,
  hasDistance,
  type LocationListItem,
} from "./locationTypes";

type LocationCardProps = {
  isFavorite: boolean;
  isUserAuthenticated: boolean;
  isSelected: boolean;
  location: LocationListItem;
  onFavoriteClick: (locationId: string) => void;
  onSelect: () => void;
};

const LocationCard = ({
  isFavorite,
  isUserAuthenticated,
  isSelected,
  location,
  onFavoriteClick,
  onSelect,
}: LocationCardProps) => (
  <article
    className={
      isSelected
        ? "relative rounded-lg border border-(--color-border) bg-(--color-elevated) p-4 shadow-sm shadow-black/20"
        : "relative rounded-lg border border-(--color-border) bg-(--color-surface) p-4 shadow-sm shadow-black/10 transition hover:bg-(--color-elevated)"
    }
    onMouseEnter={onSelect}
  >
    {isSelected && (
      <span className="absolute left-0 top-4 h-8 w-1 rounded-r-full bg-(--color-accent-indicator)" />
    )}
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--color-text-secondary)">
          <span className={getLocationTypeDotClass(location.type)} />
          {getLocationTypeLabel(location.type)}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-(--color-text-primary)">
          {location.name}
        </h3>
        <p className="mt-1 text-sm text-(--color-text-secondary)">
          {location.city}, {location.country}
        </p>
        {hasDistance(location) && (
          <p className="mt-2 text-sm font-medium text-(--color-text-primary)">
            {location.distanceKm.toFixed(1)} km away
          </p>
        )}
        {location.reviewCount > 0 && (
          <p className="mt-2 text-sm font-medium text-(--color-text-primary)">
            Rating {location.averageRating.toFixed(1)}
          </p>
        )}
      </div>
      <button
        aria-label={
          isFavorite
            ? `Remove ${location.name} from favorites`
            : `Save ${location.name} to favorites`
        }
        aria-pressed={isFavorite}
        className={
          isFavorite
            ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-red-400 transition hover:bg-red-400/10 focus:outline-none"
            : "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-(--color-text-secondary) transition hover:bg-(--color-elevated) hover:text-red-400 focus:outline-none"
        }
        onClick={() => onFavoriteClick(location.id)}
        title={
          isUserAuthenticated
            ? "Save favorite"
            : "Sign in to save favorites"
        }
        type="button"
      >
        <HeartIcon isFilled={isFavorite} />
      </button>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm text-(--color-text-secondary)">
        {location.reviewCount === 0
          ? "No reviews yet"
          : `${location.reviewCount} reviews`}
      </p>
      <Link
        className="rounded-md border border-(--color-border) px-3 py-2 text-sm font-semibold text-(--color-text-primary) transition hover:bg-(--color-elevated) focus:outline-none focus:ring-2 focus:ring-(--color-accent-indicator) focus:ring-offset-2 focus:ring-offset-(--color-surface)"
        to={`/locations/${location.id}`}
      >
        Details
      </Link>
    </div>
  </article>
);

const HeartIcon = ({ isFilled }: { isFilled: boolean }) => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill={isFilled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

export default LocationCard;
