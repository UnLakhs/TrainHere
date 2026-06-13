import { useState } from "react";
import {
  createLocation,
  type LocationRequest,
  type LocationResponse,
} from "../api/locations/locations";

type LocationFormState = Omit<LocationRequest, "type" | "latitude" | "longitude"> & {
  type: LocationRequest["type"] | "";
  latitude: string;
  longitude: string;
};

const initialLocationFormState: LocationFormState = {
  name: "",
  type: "",
  description: "",
  country: "",
  city: "",
  address: "",
  latitude: "",
  longitude: "",
};

type CreateLocationFormProps = {
  initialLocation?: LocationResponse;
  submitLabel?: string;
  successMessage?: string;
  onSubmitLocation?: (request: LocationRequest) => Promise<LocationResponse>;
};

const mapLocationToFormState = (location: LocationResponse): LocationFormState => ({
  name: location.name,
  type: location.type,
  description: location.description ?? "",
  country: location.country,
  city: location.city,
  address: location.address ?? "",
  latitude: String(location.latitude),
  longitude: String(location.longitude),
});

const CreateLocationForm = ({
  initialLocation,
  submitLabel = "Create Location",
  successMessage = "Location submitted successfully.",
  onSubmitLocation = createLocation,
}: CreateLocationFormProps) => {
  const [formData, setFormData] = useState<LocationFormState>(
    initialLocation ? mapLocationToFormState(initialLocation) : initialLocationFormState,
  );
  const [createStatus, setCreateStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [createMessage, setCreateMessage] = useState("");
  const labelClass = "mt-4 block text-sm font-medium text-[var(--color-text-primary)]";
  const fieldClass =
    "mt-1 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2.5 text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent-indicator)] focus:ring-2 focus:ring-[var(--color-accent-indicator)]/20";

  const handleFormChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.type) {
      setCreateStatus("error");
      setCreateMessage("Please select a location type.");
      return;
    }

    try {
      setCreateStatus("loading");
      setCreateMessage("");
      await onSubmitLocation({
        ...formData,
        type: formData.type,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      });
      if (!initialLocation) {
        setFormData(initialLocationFormState);
      }
      setCreateStatus("success");
      setCreateMessage(successMessage);
    } catch (error) {
      console.error("Error creating location:", error);
      setCreateStatus("error");
      setCreateMessage(
        error instanceof Error ? error.message : "Could not create location.",
      );
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-5xl">
      <form
        className="flex flex-col items-start gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-left shadow-sm shadow-black/10"
        onSubmit={handleSubmit}
      >
        <div className="w-full">
          <label
            className="block text-sm font-medium text-[var(--color-text-primary)]"
            htmlFor="locationName"
          >
            Location Name
          </label>
          <input
            className={fieldClass}
            id="locationName"
            name="name"
            onChange={handleFormChange}
            placeholder="Enter location name"
            required
            type="text"
            value={formData.name}
          />
        </div>

        <div className="w-full">
          <label
            className={labelClass}
            htmlFor="locationType"
          >
            Location Type
          </label>
          <select
            className={fieldClass}
            id="locationType"
            name="type"
            onChange={handleFormChange}
            required
            value={formData.type}
          >
            <option value="">Select type</option>
            <option value="GYM">Gym</option>
            <option value="CALISTHENICS_PARK">Calisthenics Park</option>
          </select>
        </div>

        <div className="w-full">
          <label
            className={labelClass}
            htmlFor="locationDescription"
          >
            Description
          </label>
          <textarea
            className={`${fieldClass} min-h-24`}
            id="locationDescription"
            name="description"
            onChange={handleFormChange}
            placeholder="Add a short description"
            required
            value={formData.description}
          />
        </div>

        <div className="w-full">
          <label
            className={labelClass}
            htmlFor="locationCountry"
          >
            Country
          </label>
          <input
            className={fieldClass}
            id="locationCountry"
            name="country"
            onChange={handleFormChange}
            placeholder="Enter country"
            required
            type="text"
            value={formData.country}
          />
        </div>

        <div className="w-full">
          <label
            className={labelClass}
            htmlFor="locationCity"
          >
            City
          </label>
          <input
            className={fieldClass}
            id="locationCity"
            name="city"
            onChange={handleFormChange}
            placeholder="Enter city"
            required
            type="text"
            value={formData.city}
          />
        </div>

        <div className="w-full">
          <label
            className={labelClass}
            htmlFor="locationAddress"
          >
            Address
          </label>
          <input
            className={fieldClass}
            id="locationAddress"
            name="address"
            onChange={handleFormChange}
            placeholder="Enter address"
            required
            type="text"
            value={formData.address}
          />
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div>
            <label
              className={labelClass}
              htmlFor="locationLatitude"
            >
              Latitude
            </label>
            <input
              className={fieldClass}
              id="locationLatitude"
              name="latitude"
              onChange={handleFormChange}
              placeholder="Enter latitude"
              required
              step="any"
              type="number"
              value={formData.latitude}
            />
          </div>

          <div>
            <label
              className={labelClass}
              htmlFor="locationLongitude"
            >
              Longitude
            </label>
            <input
              className={fieldClass}
              id="locationLongitude"
              name="longitude"
              onChange={handleFormChange}
              placeholder="Enter longitude"
              required
              step="any"
              type="number"
              value={formData.longitude}
            />
          </div>
        </div>

        {createMessage && (
          <p
            className={
              createStatus === "success"
                ? "w-full rounded-md border border-[var(--color-accent-indicator)]/30 bg-[var(--color-accent-indicator)]/10 px-3 py-2 text-left text-sm text-[var(--color-text-primary)]"
                : "w-full rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-left text-sm text-red-200"
            }
          >
            {createMessage}
          </p>
        )}

        <button
          className="mt-6 inline-flex rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-indicator)] focus:ring-offset-2 focus:ring-offset-[var(--color-page)] disabled:cursor-not-allowed disabled:bg-[var(--color-elevated)] disabled:text-[var(--color-text-tertiary)]"
          disabled={createStatus === "loading"}
          type="submit"
        >
          {createStatus === "loading" ? "Saving location..." : submitLabel}
        </button>
      </form>
    </section>
  );
};

export default CreateLocationForm;
