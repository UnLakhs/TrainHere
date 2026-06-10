import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getLocationById,
  type LocationResponse,
} from "../api/locations/locations";

const LocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchLocationDetails() {
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
        setMessage(error instanceof Error ? error.message : "Could not load location.");
      }
    }

    fetchLocationDetails();
  }, [id]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-6 py-10 text-zinc-50">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link
          className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
          to="/"
        >
          Back to locations
        </Link>

        {status === "loading" && (
          <p className="text-sm text-zinc-300">Loading location...</p>
        )}

        {status === "error" && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {message}
          </p>
        )}

        {status === "success" && location && (
          <article className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30 sm:p-8">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                {location.type === "GYM" ? "Gym" : "Calisthenics park"}
              </p>
              <h1 className="text-4xl font-bold leading-tight">
                {location.name}
              </h1>
              <p className="text-zinc-300">
                {location.city}, {location.country}
              </p>
              {location.description && (
                <p className="max-w-3xl text-zinc-300">{location.description}</p>
              )}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">Address</p>
                <p className="mt-2 text-zinc-100">
                  {location.address || "No address provided"}
                </p>
              </div>

              <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">Status</p>
                <p className="mt-2 text-zinc-100">{location.status}</p>
              </div>

              <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">Average rating</p>
                <p className="mt-2 text-lg font-semibold text-zinc-100">
                  {location.averageRating.toFixed(1)} / 5
                </p>
              </div>

              <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">Reviews</p>
                <p className="mt-2 text-lg font-semibold text-zinc-100">
                  {location.reviewCount}
                </p>
              </div>

              <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">Latitude</p>
                <p className="mt-2 font-mono text-sm text-zinc-100">
                  {location.latitude.toFixed(6)}
                </p>
              </div>

              <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">Longitude</p>
                <p className="mt-2 font-mono text-sm text-zinc-100">
                  {location.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export default LocationDetails;
