import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getLocationById,
  type LocationResponse,
} from "../api/locations/locations";
import ReviewSection from "./ReviewSection";

const LocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    id ? "loading" : "error",
  );
  const [message, setMessage] = useState(id ? "" : "Location id is missing.");

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

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-(--color-page) px-6 py-10 text-(--color-text-primary)">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-secondary) transition hover:text-(--color-text-primary)"
          to="/"
        >
          <span aria-hidden="true">&lt;-</span>
          Back to locations
        </Link>

        {status === "loading" && (
          <p className="text-sm text-(--color-text-secondary)">Loading location...</p>
        )}

        {status === "error" && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {message}
          </p>
        )}

        {status === "success" && location && (
          <>
            <article className="rounded-lg border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl shadow-black/10 sm:p-8">
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-(--color-text-secondary)">
                  <span
                    className={
                      location.type === "GYM"
                        ? "h-2 w-2 rounded-full bg-(--color-category-neutral)"
                        : "h-2 w-2 rounded-full bg-(--color-category-blue)"
                    }
                  />
                  {location.type === "GYM" ? "Gym" : "Calisthenics park"}
                </p>
                <h1 className="text-4xl font-bold leading-tight">
                  {location.name}
                </h1>
                <p className="text-(--color-text-secondary)">
                  {location.city}, {location.country}
                </p>
                {location.description && (
                  <p className="max-w-3xl text-(--color-text-secondary)">
                    {location.description}
                  </p>
                )}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-(--color-border) bg-(--color-page) p-4">
                  <p className="text-sm text-(--color-text-secondary)">Address</p>
                  <p className="mt-2 text-(--color-text-primary)">
                    {location.address || "No address provided"}
                  </p>
                </div>

                <div className="rounded-md border border-(--color-border) bg-(--color-page) p-4">
                  <p className="text-sm text-(--color-text-secondary)">
                    Average rating
                  </p>
                  <p className="mt-2 text-lg font-semibold text-(--color-text-primary)">
                    {location.reviewCount === 0
                      ? "No ratings yet"
                      : `${location.averageRating.toFixed(1)} / 5`}
                  </p>
                </div>

                <div className="rounded-md border border-(--color-border) bg-(--color-page) p-4">
                  <p className="text-sm text-(--color-text-secondary)">Reviews</p>
                  <p className="mt-2 text-lg font-semibold text-(--color-text-primary)">
                    {location.reviewCount === 0
                      ? "No reviews yet"
                      : location.reviewCount}
                  </p>
                </div>

                <div className="rounded-md border border-(--color-border) bg-(--color-page) p-4">
                  <p className="text-sm text-(--color-text-secondary)">Latitude</p>
                  <p className="mt-2 font-mono text-sm text-(--color-text-primary)">
                    {location.latitude.toFixed(6)}
                  </p>
                </div>

                <div className="rounded-md border border-(--color-border) bg-(--color-page) p-4">
                  <p className="text-sm text-(--color-text-secondary)">Longitude</p>
                  <p className="mt-2 font-mono text-sm text-(--color-text-primary)">
                    {location.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </article>

            <ReviewSection
              locationId={location.id}
              onReviewsChanged={fetchLocationDetails}
            />
          </>
        )}
      </section>
    </main>
  );
};

export default LocationDetails;
