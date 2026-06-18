import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { hasAuthToken, subscribeToAuthChanges } from "../api/auth/auth";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../api/favorites/favorites";
import {
  getLocationById,
  type LocationResponse,
} from "../api/locations/locations";
import {
  getApprovedLocationPhotos,
  getPhotoUrl,
  uploadLocationPhoto,
  type LocationPhotoResponse,
} from "../api/photos/photos";
import LocationMap from "./LocationMap";
import RatingStars from "./RatingStars";
import ReviewSection from "./ReviewSection";
import { getLocationTypeDotClass, getLocationTypeLabel } from "./locationTypes";

const LocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    id ? "loading" : "error",
  );
  const [message, setMessage] = useState(id ? "" : "Location id is missing.");
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthToken());
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [approvedPhotos, setApprovedPhotos] = useState<LocationPhotoResponse[]>(
    [],
  );

  const fetchLocationDetails = async () => {
    if (!id) {
      setStatus("error");
      setMessage("Location id is missing.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");
      const response = await getLocationById(id);
      setLocation(response);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching location details:", error);
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Could not load location.",
      );
    }
  };

  useEffect(() => {
    let shouldIgnore = false;

    if (!id) {
      return () => {
        shouldIgnore = true;
      };
    }

    getLocationById(id)
      .then((response) => {
        if (shouldIgnore) {
          return;
        }

        setLocation(response);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (shouldIgnore) {
          return;
        }

        console.error("Error fetching location details:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Could not load location.",
        );
      });

    return () => {
      shouldIgnore = true;
    };
  }, [id]);

  useEffect(() => {
    let shouldIgnore = false;

    if (!location) {
      return () => {
        shouldIgnore = true;
      };
    }

    getApprovedLocationPhotos(location.id)
      .then((photos) => {
        if (shouldIgnore) {
          return;
        }

        setApprovedPhotos(photos);
      })
      .catch((error: unknown) => {
        if (shouldIgnore) {
          return;
        }

        console.error("Error loading location photos:", error);
      });

    return () => {
      shouldIgnore = true;
    };
  }, [location]);

  useEffect(() => {
    const syncAuthState = () => {
      const nextIsAuthenticated = hasAuthToken();
      setIsAuthenticated(nextIsAuthenticated);

      if (!nextIsAuthenticated) {
        setIsFavorite(false);
      }
    };

    return subscribeToAuthChanges(syncAuthState);
  }, []);

  useEffect(() => {
    let shouldIgnore = false;

    if (!location || !isAuthenticated) {
      return () => {
        shouldIgnore = true;
      };
    }

    getFavorites()
      .then((favorites) => {
        if (shouldIgnore) {
          return;
        }

        setIsFavorite(
          favorites.some((favorite) => favorite.location.id === location.id),
        );
      })
      .catch((error: unknown) => {
        if (shouldIgnore) {
          return;
        }

        console.error("Error loading favorite state:", error);
      });

    return () => {
      shouldIgnore = true;
    };
  }, [isAuthenticated, location]);

  const handleFavoriteClick = async () => {
    if (!location) {
      return;
    }

    if (!isAuthenticated) {
      setFavoriteMessage("Sign in to save this location.");
      return;
    }

    try {
      setFavoriteMessage("");

      if (isFavorite) {
        await removeFavorite(location.id);
        setIsFavorite(false);
      } else {
        await addFavorite(location.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      setFavoriteMessage(
        error instanceof Error ? error.message : "Could not update favorite.",
      );
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-(--color-page) px-6 py-10 text-(--color-text-primary)">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-secondary) transition hover:text-(--color-text-primary)"
          to="/"
        >
          <span aria-hidden="true">&lt;-</span>
          Back to locations
        </Link>

        {status === "loading" && (
          <p className="text-sm text-(--color-text-secondary)">
            Loading location...
          </p>
        )}

        {status === "error" && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {message}
          </p>
        )}

        {status === "success" && location && (
          <>
            <article className="overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) shadow-2xl shadow-black/10">
              <LocationHero location={location} photos={approvedPhotos} />

              <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:p-8">
                <div className="flex flex-col gap-8">
                  <header className="flex flex-col gap-4">
                    <p className="flex items-center gap-2 text-sm text-(--color-text-secondary)">
                      <span className={getLocationTypeDotClass(location.type)} />
                      {getLocationTypeLabel(location.type)}
                    </p>
                    <div>
                      <h1 className="text-4xl font-bold leading-tight">
                        {location.name}
                      </h1>
                      <p className="mt-2 text-(--color-text-secondary)">
                        {location.city}, {location.country}
                      </p>
                    </div>
                    {location.description && (
                      <p className="max-w-3xl leading-7 text-(--color-text-secondary)">
                        {location.description}
                      </p>
                    )}
                  </header>

                  <section className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-(--color-text-primary)">
                      About
                    </h2>
                    <div className="rounded-lg border border-(--color-border) bg-(--color-page) p-4">
                      <p className="text-sm font-medium text-(--color-text-primary)">
                        Address
                      </p>
                      <p className="mt-1 text-sm text-(--color-text-secondary)">
                        {location.address ||
                          `${location.city}, ${location.country}`}
                      </p>
                    </div>

                    <LocationMap
                      locations={[location]}
                      onSelectLocation={() => undefined}
                      selectedLocationId={location.id}
                      variant="compact"
                    />
                  </section>
                </div>

                <aside className="flex flex-col gap-4">
                  <section className="rounded-lg border border-(--color-border) bg-(--color-page) p-5">
                    {location.reviewCount > 0 ? (
                      <div className="flex flex-col gap-2">
                        <RatingStars rating={location.averageRating} />
                        <p className="text-sm text-(--color-text-secondary)">
                          <span className="font-semibold text-(--color-text-primary)">
                            {location.averageRating.toFixed(1)}
                          </span>{" "}
                          - {formatReviewCount(location.reviewCount)}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-(--color-text-secondary)">
                        No reviews yet
                      </p>
                    )}
                  </section>

                  <button
                    aria-pressed={isFavorite}
                    className={
                      isFavorite
                        ? "inline-flex items-center justify-center gap-2 rounded-md border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-400/15 focus:outline-none"
                        : "inline-flex items-center justify-center gap-2 rounded-md border border-(--color-border) px-4 py-3 text-sm font-semibold text-(--color-text-primary) transition hover:bg-(--color-elevated) hover:text-red-400 focus:outline-none"
                    }
                    onClick={() => void handleFavoriteClick()}
                    type="button"
                  >
                    <HeartIcon isFilled={isFavorite} />
                    {isFavorite ? "Saved" : "Save"}
                  </button>

                  {favoriteMessage && (
                    <p className="text-sm text-(--color-text-secondary)">
                      {favoriteMessage}
                    </p>
                  )}

                  <a
                    className="inline-flex items-center justify-center rounded-md bg-(--color-accent) px-4 py-3 text-sm font-semibold text-(--color-accent-text) transition hover:bg-(--color-accent-hover)"
                    href={getDirectionsUrl(location)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Get directions
                  </a>
                </aside>
              </div>
            </article>

            <ReviewSection
              locationId={location.id}
              onReviewsChanged={fetchLocationDetails}
              photoUploadSlot={
                <PhotoUploadPanel
                  isAuthenticated={isAuthenticated}
                  locationId={location.id}
                  onPhotoUploaded={() => undefined}
                />
              }
            />
          </>
        )}
      </section>
    </main>
  );
};

const LocationHero = ({
  location,
  photos,
}: {
  location: LocationResponse;
  photos: LocationPhotoResponse[];
}) => {
  const heroImage = getLocationHeroImage(location, photos);

  return (
    <div className="relative h-64 max-h-104 overflow-hidden bg-(--color-elevated) sm:h-80 lg:h-96">
    {heroImage ? (
      <>
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-30 blur-xl"
          src={heroImage}
        />
        <img
          alt={`${location.name} in ${location.city}`}
          className="relative z-10 h-full w-full object-contain object-center"
          src={heroImage}
        />
      </>
    ) : (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(61,220,151,0.24),transparent_28%),linear-gradient(135deg,rgba(107,155,209,0.22),transparent_42%),var(--color-elevated)]" />
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-size-[34px_34px]" />
      </>
    )}
    <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
    <div className="absolute bottom-5 left-5 rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
      {getLocationTypeLabel(location.type)} in {location.city}
    </div>
  </div>
  );
};

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

const getDirectionsUrl = (location: LocationResponse) => {
  const query = encodeURIComponent(
    `${location.latitude},${location.longitude}`,
  );
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
};

const formatReviewCount = (reviewCount: number) =>
  `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`;

const PhotoUploadPanel = ({
  isAuthenticated,
  locationId,
  onPhotoUploaded,
}: {
  isAuthenticated: boolean;
  locationId: string;
  onPhotoUploaded: () => void;
}) => {
  const maxPhotoSizeBytes = 5 * 1024 * 1024;
  const allowedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!file) {
      setStatus("error");
      setMessage("Choose a photo first.");
      return;
    }

    if (!allowedPhotoTypes.includes(file.type)) {
      setStatus("error");
      setMessage("Only JPG, PNG, and WEBP photos are allowed.");
      return;
    }

    if (file.size > maxPhotoSizeBytes) {
      setStatus("error");
      setMessage("Photo must be up to 5MB.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");
      await uploadLocationPhoto(locationId, file, caption);
      setFile(null);
      setCaption("");
      setStatus("success");
      setMessage("Photo uploaded. An admin needs to approve it before it appears here.");
      formElement.reset();
      onPhotoUploaded();
    } catch (error) {
      console.error("Error uploading photo:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not upload photo.");
    }
  };

  return (
    <section className="rounded-lg border border-(--color-border) bg-(--color-page) p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-(--color-text-primary)">
            Add a photo
          </h3>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Photos become public after admin approval.
          </p>
        </div>
      </div>

      {isAuthenticated ? (
        <form className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]" onSubmit={handleSubmit}>
          <input
            accept="image/jpeg,image/png,image/webp"
            className="block w-full rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text-secondary) file:mr-4 file:rounded-md file:border-0 file:bg-(--color-elevated) file:px-3 file:py-2 file:text-sm file:font-semibold file:text-(--color-text-primary)"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            type="file"
          />
          <input
            className="rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2.5 text-sm text-(--color-text-primary) outline-none transition placeholder:text-(--color-text-tertiary) focus:border-(--color-accent-indicator) focus:ring-2 focus:ring-(--color-accent-indicator)/20"
            maxLength={255}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Caption (optional)"
            value={caption}
          />
          <button
            className="rounded-md border border-(--color-border) px-4 py-2 text-sm font-semibold text-(--color-text-primary) transition hover:bg-(--color-elevated) disabled:cursor-not-allowed disabled:text-(--color-text-tertiary)"
            disabled={status === "loading"}
            type="submit"
          >
            {status === "loading" ? "Uploading..." : "Upload photo"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-(--color-text-secondary)">
          Sign in to upload photos.
        </p>
      )}

      {message && (
        <p
          className={
            status === "error"
              ? "mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              : "mt-3 rounded-md border border-(--color-accent-indicator)/30 bg-(--color-accent-indicator)/10 px-3 py-2 text-sm text-(--color-text-primary)"
          }
        >
          {message}
        </p>
      )}
    </section>
  );
};

const getLocationHeroImage = (
  location: LocationResponse,
  photos: LocationPhotoResponse[],
) => {
  if (photos.length > 0) {
    return getPhotoUrl(photos[0].publicUrl);
  }

  if (location.city.toLowerCase() === "orestiada") {
    return "/Orestiada-stadium.jpg";
  }

  return null;
};

export default LocationDetails;
