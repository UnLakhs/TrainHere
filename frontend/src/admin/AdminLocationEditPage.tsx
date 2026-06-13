import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAdminLocationById,
  updateLocation,
  type LocationResponse,
} from "../api/locations/locations";
import CreateLocationForm from "../locations/CreateLocationForm";

const AdminLocationEditPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadLocation() {
      if (!id) {
        setStatus("error");
        setMessage("Location id is missing.");
        return;
      }

      try {
        setStatus("loading");
        setMessage("");
        const response = await getAdminLocationById(id);
        setLocation(response);
        setStatus("success");
      } catch (error) {
        console.error("Error loading location for edit:", error);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Could not load location.");
      }
    }

    loadLocation();
  }, [id]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-(--color-page) px-6 py-10 text-(--color-text-primary)">
      <section className="mx-auto max-w-5xl">
        <Link
          className="text-sm font-semibold text-(--color-text-secondary) transition hover:text-(--color-text-primary)"
          to="/admin"
        >
          Back to admin
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-(--color-text-secondary)">
            Admin edit
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight">
            Review location details.
          </h1>
          <p className="mt-4 max-w-2xl text-(--color-text-secondary)">
            Correct submitted information before approving it for public discovery.
          </p>
        </div>
      </section>

      {status === "loading" && (
        <p className="mx-auto mt-10 max-w-5xl text-sm text-(--color-text-secondary)">
          Loading location...
        </p>
      )}

      {status === "error" && (
        <p className="mx-auto mt-10 max-w-5xl rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {message}
        </p>
      )}

      {status === "success" && location && id && (
        <CreateLocationForm
          initialLocation={location}
          onSubmitLocation={(request) => updateLocation(id, request)}
          submitLabel="Save changes"
          successMessage="Location updated successfully."
        />
      )}
    </main>
  );
};

export default AdminLocationEditPage;
