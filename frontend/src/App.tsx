import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLocations, type LocationResponse } from "./api/locations/locations";

function App() {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setStatus("loading");
        setMessage("");
        const response = await getLocations();
        setLocations(response);
        setStatus("success");
      } catch (error) {
        console.error("Error fetching locations:", error);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Could not load locations.");
      }
    };
    fetchLocations();
  }, []);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-6 py-10 text-zinc-50">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
          TrainHere
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
          Find the next place worth training.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-300">
          Discover gyms and calisthenics parks, then help the community keep
          each location accurate with reviews, photos, and practical details.
        </p>
      </section>

      {/* location list */}
      <section>
        <h2 className="mx-auto mt-10 max-w-5xl text-2xl font-semibold">
          Explore locations
        </h2>
        {status === "loading" && (
          <p className="mx-auto mt-6 max-w-5xl text-sm text-zinc-300">
            Loading locations...
          </p>
        )}

        {status === "error" && (
          <p className="mx-auto mt-6 max-w-5xl rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {message}
          </p>
        )}

        {status === "success" && (
          <div>
            {locations.map((location) => (
            <div
              key={location.id}
              className="mx-auto mt-6 max-w-5xl rounded-lg border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm shadow-black/30"
            >
              <h3 className="text-xl font-semibold">{location.name}</h3>
              <p className="text-sm text-zinc-400">
                {location.city}, {location.country}
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                Type: {location.type}
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                Average Rating: {location.averageRating.toFixed(1)} (
                {location.reviewCount} reviews)
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                Latitude: {location.latitude.toFixed(4)}
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                Longitude: {location.longitude.toFixed(4)}
              </p>
              <Link
                className="mt-4 inline-flex rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
                to={`/locations/${location.id}`}
              >
                View details
              </Link>
            </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
