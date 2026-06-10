import { useState } from "react";
import { createLocation, type LocationRequest } from "../api/locations/locations";

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

const CreateLocationForm = () => {
  const [formData, setFormData] = useState<LocationFormState>(
    initialLocationFormState,
  );
  const [createStatus, setCreateStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [createMessage, setCreateMessage] = useState("");

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
      await createLocation({
        ...formData,
        type: formData.type,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      });
      setFormData(initialLocationFormState);
      setCreateStatus("success");
      setCreateMessage("Location submitted successfully.");
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
        className="flex flex-col items-start gap-4 rounded-md bg-emerald-400/10 p-6 text-center"
        onSubmit={handleSubmit}
      >
        <div className="w-full">
          <label
            className="block text-sm font-medium text-zinc-300"
            htmlFor="locationName"
          >
            Location Name
          </label>
          <input
            className="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
            className="mt-4 block text-sm font-medium text-zinc-300"
            htmlFor="locationType"
          >
            Location Type
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-800 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
            className="mt-4 block text-sm font-medium text-zinc-300"
            htmlFor="locationDescription"
          >
            Description
          </label>
          <textarea
            className="mt-1 block min-h-24 w-full rounded-md border border-zinc-600 bg-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
            className="mt-4 block text-sm font-medium text-zinc-300"
            htmlFor="locationCountry"
          >
            Country
          </label>
          <input
            className="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
            className="mt-4 block text-sm font-medium text-zinc-300"
            htmlFor="locationCity"
          >
            City
          </label>
          <input
            className="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
            className="mt-4 block text-sm font-medium text-zinc-300"
            htmlFor="locationAddress"
          >
            Address
          </label>
          <input
            className="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
              className="mt-4 block text-sm font-medium text-zinc-300"
              htmlFor="locationLatitude"
            >
              Latitude
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
              className="mt-4 block text-sm font-medium text-zinc-300"
              htmlFor="locationLongitude"
            >
              Longitude
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
                ? "w-full rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-left text-sm text-emerald-200"
                : "w-full rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-left text-sm text-red-200"
            }
          >
            {createMessage}
          </p>
        )}

        <button
          className="mt-6 inline-flex rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          disabled={createStatus === "loading"}
          type="submit"
        >
          {createStatus === "loading" ? "Creating location..." : "Create Location"}
        </button>
      </form>
    </section>
  );
};

export default CreateLocationForm;
