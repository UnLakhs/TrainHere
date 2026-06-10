import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, type CurrentUserResponse } from "../api/auth/auth";
import {
  getPendingLocations,
  getRejectedLocations,
  updateLocationStatus,
  type LocationResponse,
  type LocationStatus,
} from "../api/locations/locations";

const AdminDashboard = () => {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [pendingLocations, setPendingLocations] = useState<LocationResponse[]>([]);
  const [rejectedLocations, setRejectedLocations] = useState<LocationResponse[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setStatus("loading");
        setMessage("");
        const userData = await getCurrentUser();
        setUser(userData);

        if (userData.role !== "ADMIN") {
          setStatus("error");
          setMessage("You do not have access to the admin dashboard.");
          return;
        }

        const [pending, rejected] = await Promise.all([
          getPendingLocations(),
          getRejectedLocations(),
        ]);

        setPendingLocations(pending);
        setRejectedLocations(rejected);
        setStatus("success");
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Could not load admin dashboard.");
      }
    };

    fetchAdminData();
  }, []);

  const handleStatusChange = async (id: string, nextStatus: LocationStatus) => {
    try {
      setMessage("");
      await updateLocationStatus(id, nextStatus);
      setPendingLocations((locations) =>
        locations.filter((location) => location.id !== id),
      );
      setRejectedLocations((locations) =>
        locations.filter((location) => location.id !== id),
      );
      setMessage(`Location marked as ${nextStatus.toLowerCase()}.`);
    } catch (error) {
      console.error("Error updating location status:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not update location.");
    }
  };
  
  const renderLocationCard = (location: LocationResponse, currentStatus: LocationStatus) => (
    <article
      className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm shadow-black/30"
      key={location.id}
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
          {currentStatus}
        </p>
        <h3 className="text-xl font-semibold text-zinc-50">{location.name}</h3>
        <p className="text-sm text-zinc-400">
          {location.city}, {location.country}
        </p>
        <p className="text-sm text-zinc-300">Type: {location.type}</p>
        <p className="font-mono text-sm text-zinc-400">
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          className="rounded-md border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          to={`/admin/locations/${location.id}/edit`}
        >
          Edit
        </Link>
        <button
          className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
          type="button"
          onClick={() => handleStatusChange(location.id, "APPROVED")}
        >
          Approve
        </button>
        <button
          className="rounded-md border border-red-400/50 px-3 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-400/10 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
          type="button"
          onClick={() => handleStatusChange(location.id, "REJECTED")}
        >
          Reject
        </button>
      </div>
    </article>
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-6 py-10 text-zinc-50">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
            TrainHere Admin Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">
            Location moderation
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-300">
            Review submitted locations before they become visible in public search.
          </p>
        </div>

        {status === "loading" && (
          <p className="text-sm text-zinc-300">Loading admin dashboard...</p>
        )}

        {message && (
          <p
            className={
              status === "error"
                ? "rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                : "rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
            }
          >
            {message}
          </p>
        )}

        {status === "success" && user?.role === "ADMIN" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <h2 className="text-2xl font-semibold">Pending locations</h2>
              <div className="mt-4 flex flex-col gap-4">
                {pendingLocations.length === 0 ? (
                  <p className="rounded-md border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-300">
                    No pending locations.
                  </p>
                ) : (
                  pendingLocations.map((location) =>
                    renderLocationCard(location, "PENDING"),
                  )
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Rejected locations</h2>
              <div className="mt-4 flex flex-col gap-4">
                {rejectedLocations.length === 0 ? (
                  <p className="rounded-md border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-300">
                    No rejected locations.
                  </p>
                ) : (
                  rejectedLocations.map((location) =>
                    renderLocationCard(location, "REJECTED"),
                  )
                )}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminDashboard;
