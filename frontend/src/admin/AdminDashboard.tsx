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
import {
  deletePhoto,
  getPendingPhotos,
  getPhotoUrl,
  getRejectedPhotos,
  updatePhotoStatus,
  type LocationPhotoResponse,
  type PhotoStatus,
} from "../api/photos/photos";

const AdminDashboard = () => {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [pendingLocations, setPendingLocations] = useState<LocationResponse[]>([]);
  const [rejectedLocations, setRejectedLocations] = useState<LocationResponse[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<LocationPhotoResponse[]>([]);
  const [rejectedPhotos, setRejectedPhotos] = useState<LocationPhotoResponse[]>([]);
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

        try {
          const [pendingPhotoData, rejectedPhotoData] = await Promise.all([
            getPendingPhotos(),
            getRejectedPhotos(),
          ]);
          setPendingPhotos(pendingPhotoData);
          setRejectedPhotos(rejectedPhotoData);
        } catch (photoError) {
          console.error("Error fetching photo moderation data:", photoError);
          setMessage("Locations loaded, but photo moderation could not be loaded.");
        }

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

  const handlePhotoStatusChange = async (id: string, nextStatus: PhotoStatus) => {
    try {
      setMessage("");
      await updatePhotoStatus(id, nextStatus);
      setPendingPhotos((photos) => photos.filter((photo) => photo.id !== id));
      setRejectedPhotos((photos) => photos.filter((photo) => photo.id !== id));
      setMessage(`Photo marked as ${nextStatus.toLowerCase()}.`);
    } catch (error) {
      console.error("Error updating photo status:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not update photo.");
    }
  };

  const handlePhotoDelete = async (id: string) => {
    try {
      setMessage("");
      await deletePhoto(id);
      setPendingPhotos((photos) => photos.filter((photo) => photo.id !== id));
      setRejectedPhotos((photos) => photos.filter((photo) => photo.id !== id));
      setMessage("Photo deleted.");
    } catch (error) {
      console.error("Error deleting photo:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not delete photo.");
    }
  };
  
  const renderLocationCard = (location: LocationResponse, currentStatus: LocationStatus) => (
    <article
      className="rounded-lg border border-(--color-border) bg-(--color-surface) p-5 shadow-sm shadow-black/10"
      key={location.id}
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-secondary)">
          {currentStatus}
        </p>
        <h3 className="text-xl font-semibold text-(--color-text-primary)">{location.name}</h3>
        <p className="text-sm text-(--color-text-secondary)">
          {location.city}, {location.country}
        </p>
        <p className="text-sm text-(--color-text-secondary)">Type: {location.type}</p>
        <p className="font-mono text-sm text-(--color-text-secondary)">
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          className="rounded-md border border-(--color-border) px-3 py-2 text-sm font-semibold text-(--color-text-primary) transition hover:bg-(--color-elevated) focus:outline-none focus:ring-2 focus:ring-(--color-accent-indicator) focus:ring-offset-2 focus:ring-offset-(--color-page)"
          to={`/admin/locations/${location.id}/edit`}
        >
          Edit
        </Link>
        <button
          className="rounded-md bg-(--color-accent) px-3 py-2 text-sm font-semibold text-(--color-accent-text) transition hover:bg-(--color-accent-hover) focus:outline-none focus:ring-2 focus:ring-(--color-accent-indicator) focus:ring-offset-2 focus:ring-offset-(--color-page)"
          type="button"
          onClick={() => handleStatusChange(location.id, "APPROVED")}
        >
          Approve
        </button>
        <button
          className="rounded-md border border-red-400/50 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-400/10 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-(--color-page)"
          type="button"
          onClick={() => handleStatusChange(location.id, "REJECTED")}
        >
          Reject
        </button>
      </div>
    </article>
  );

  const renderPhotoCard = (photo: LocationPhotoResponse, currentStatus: PhotoStatus) => {
    const caption = getReadableCaption(photo.caption);

    return (
    <article
      className="overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) shadow-sm shadow-black/10 sm:grid sm:grid-cols-[13rem_minmax(0,1fr)]"
      key={photo.id}
    >
      <div className="flex h-44 items-center justify-center bg-(--color-page) sm:h-full">
        <img
          alt={caption || photo.locationName}
          className="h-full w-full object-contain"
          src={getPhotoUrl(photo.publicUrl)}
        />
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="rounded-full border border-(--color-border) px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-(--color-text-secondary)">
              {currentStatus}
            </p>
            <p className="text-xs text-(--color-text-tertiary)">
              {formatPhotoSize(photo.sizeBytes)}
            </p>
          </div>
          <h3 className="text-xl font-semibold text-(--color-text-primary)">
            {photo.locationName}
          </h3>
          {caption && (
            <p className="text-sm text-(--color-text-secondary)">
              {caption}
            </p>
          )}
          <p className="text-sm text-(--color-text-secondary)">
            Uploaded by {photo.uploadedByDisplayName || "Unknown user"}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="rounded-md bg-(--color-accent) px-3 py-2 text-sm font-semibold text-(--color-accent-text) transition hover:bg-(--color-accent-hover) focus:outline-none focus:ring-2 focus:ring-(--color-accent-indicator) focus:ring-offset-2 focus:ring-offset-(--color-page)"
            onClick={() => void handlePhotoStatusChange(photo.id, "APPROVED")}
            type="button"
          >
            Approve
          </button>
          {currentStatus === "PENDING" ? (
            <button
              className="rounded-md border border-red-400/50 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-400/10 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-(--color-page)"
              onClick={() => void handlePhotoStatusChange(photo.id, "REJECTED")}
              type="button"
            >
              Reject
            </button>
          ) : (
            <button
              className="rounded-md border border-red-400/50 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-400/10 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-(--color-page)"
              onClick={() => void handlePhotoDelete(photo.id)}
              type="button"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
    );
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-(--color-page) px-6 py-10 text-(--color-text-primary)">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-(--color-text-secondary)">
            TrainHere Admin Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">
            Location moderation
          </h1>
          <p className="mt-4 max-w-2xl text-(--color-text-secondary)">
            Review submitted locations before they become visible in public search.
          </p>
        </div>

        {status === "loading" && (
          <p className="text-sm text-(--color-text-secondary)">Loading admin dashboard...</p>
        )}

        {message && (
          <p
            className={
              status === "error"
                ? "rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                : "rounded-md border border-(--color-accent-indicator)/30 bg-(--color-accent-indicator)/10 px-3 py-2 text-sm text-(--color-text-primary)"
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
                  <p className="rounded-md border border-(--color-border) bg-(--color-surface) p-4 text-sm text-(--color-text-secondary)">
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
                  <p className="rounded-md border border-(--color-border) bg-(--color-surface) p-4 text-sm text-(--color-text-secondary)">
                    No rejected locations.
                  </p>
                ) : (
                  rejectedLocations.map((location) =>
                    renderLocationCard(location, "REJECTED"),
                  )
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Pending photos</h2>
              <div className="mt-4 flex flex-col gap-4">
                {pendingPhotos.length === 0 ? (
                  <p className="rounded-md border border-(--color-border) bg-(--color-surface) p-4 text-sm text-(--color-text-secondary)">
                    No pending photos.
                  </p>
                ) : (
                  pendingPhotos.map((photo) => renderPhotoCard(photo, "PENDING"))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Rejected photos</h2>
              <div className="mt-4 flex flex-col gap-4">
                {rejectedPhotos.length === 0 ? (
                  <p className="rounded-md border border-(--color-border) bg-(--color-surface) p-4 text-sm text-(--color-text-secondary)">
                    No rejected photos.
                  </p>
                ) : (
                  rejectedPhotos.map((photo) => renderPhotoCard(photo, "REJECTED"))
                )}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
};

const getReadableCaption = (caption: string | null) => {
  const trimmedCaption = caption?.trim();

  if (!trimmedCaption || /^[^\p{L}\p{N}]+$/u.test(trimmedCaption)) {
    return null;
  }

  return trimmedCaption;
};

const formatPhotoSize = (sizeBytes: number) => {
  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default AdminDashboard;
