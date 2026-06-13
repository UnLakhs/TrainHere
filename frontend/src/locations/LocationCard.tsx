import { Link } from "react-router-dom";
import {
  getLocationTypeDotClass,
  getLocationTypeLabel,
  hasDistance,
  type LocationListItem,
} from "./locationTypes";

type LocationCardProps = {
  isSelected: boolean;
  location: LocationListItem;
  onSelect: () => void;
};

const LocationCard = ({
  isSelected,
  location,
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
      <div>
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
      </div>
      <div className="rounded-md border border-(--color-border) bg-(--color-page) px-2.5 py-1 text-sm font-semibold text-(--color-text-primary)">
        {location.averageRating.toFixed(1)}
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm text-(--color-text-secondary)">
        {location.reviewCount} reviews
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

export default LocationCard;
