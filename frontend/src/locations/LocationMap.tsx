import { useEffect, useRef } from "react";
import maplibregl, { type Map, type Marker } from "maplibre-gl";
import type { LocationResponse } from "../api/locations/locations";

type LocationMapProps = {
  locations: LocationResponse[];
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
};

const defaultCenter: [number, number] = [23.7275, 37.9838];
const mapStyle =
  import.meta.env.VITE_MAP_STYLE_URL ?? "https://tiles.openfreemap.org/styles/liberty";

const LocationMap = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  userLocation,
}: LocationMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userMarkerRef = useRef<Marker | null>(null);
  const hasFitInitialBoundsRef = useRef(false);
  const previousSelectedLocationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: defaultCenter,
      zoom: 11,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(containerRef.current);
    map.on("load", () => map.resize());
    requestAnimationFrame(() => map.resize());

    return () => {
      resizeObserver.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = locations.map((location) => {
      const markerElement = document.createElement("button");
      markerElement.className = getLocationMarkerClass(
        location,
        selectedLocationId === location.id,
      );
      markerElement.type = "button";
      markerElement.setAttribute("aria-label", `Select ${location.name}`);

      const popup = new maplibregl.Popup({ offset: 18 }).setHTML(
        `<strong>${escapeHtml(location.name)}</strong><br />${escapeHtml(location.city)}, ${escapeHtml(location.country)}<br /><a href="/locations/${location.id}">View details</a>`,
      );

      markerElement.addEventListener("click", () => {
        onSelectLocation(location.id);
      });

      return new maplibregl.Marker({ element: markerElement })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    if (hasFitInitialBoundsRef.current) {
      return;
    }

    if (locations.length === 1) {
      hasFitInitialBoundsRef.current = true;
      map.easeTo({
        center: [locations[0].longitude, locations[0].latitude],
        zoom: 13,
        duration: 500,
      });
    }

    if (locations.length > 1) {
      hasFitInitialBoundsRef.current = true;
      map.fitBounds(getLocationBounds(locations), {
        padding: 64,
        maxZoom: 13,
        duration: 500,
      });
    }
  }, [locations, onSelectLocation, selectedLocationId]);

  useEffect(() => {
    if (previousSelectedLocationIdRef.current === selectedLocationId) {
      return;
    }

    if (previousSelectedLocationIdRef.current === null) {
      previousSelectedLocationIdRef.current = selectedLocationId;
      return;
    }

    previousSelectedLocationIdRef.current = selectedLocationId;

    const selectedLocation = locations.find(
      (location) => location.id === selectedLocationId,
    );

    if (!selectedLocation || !mapRef.current) {
      return;
    }

    mapRef.current.easeTo({
      center: [selectedLocation.longitude, selectedLocation.latitude],
      zoom: Math.max(mapRef.current.getZoom(), 13),
      duration: 500,
    });
  }, [locations, selectedLocationId]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !userLocation) {
      return;
    }

    userMarkerRef.current?.remove();

    const userMarkerElement = document.createElement("div");
    userMarkerElement.className =
      "h-5 w-5 rounded-full border-2 border-(--color-page) bg-[#EDEFF2] shadow-lg shadow-black/50 ring-4 ring-[#EDEFF2]/25";

    userMarkerRef.current = new maplibregl.Marker({
      element: userMarkerElement,
    })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(new maplibregl.Popup({ offset: 18 }).setText("You are here"))
      .addTo(map);

    const bounds = getLocationBounds(locations);
    bounds.extend([userLocation.longitude, userLocation.latitude]);

    map.fitBounds(bounds, {
      padding: 72,
      maxZoom: 13,
      duration: 600,
    });
  }, [locations, userLocation]);

  return (
    <div className="relative isolate h-128 overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) p-4 lg:h-full">
      <div
        className="trainhere-map h-full w-full overflow-hidden rounded-md border border-(--color-border)"
        ref={containerRef}
      />
    </div>
  );
};

const getLocationBounds = (locations: LocationResponse[]) => {
  const bounds = new maplibregl.LngLatBounds();

  locations.forEach((location) => {
    bounds.extend([location.longitude, location.latitude]);
  });

  return bounds;
};

const getLocationMarkerClass = (
  location: LocationResponse,
  isSelected: boolean,
) => {
  const baseClass =
    "border-2 border-(--color-page) shadow-lg shadow-black/40 transition";
  const selectedClass = isSelected
    ? "h-5 w-5 ring-4 ring-(--color-text-primary)/25"
    : "h-4 w-4";

  if (location.type === "GYM") {
    return `${baseClass} ${selectedClass} rounded-[0.3rem] bg-[#6B9BD1]`;
  }

  return `${baseClass} ${selectedClass} rounded-full bg-[#3DDC97]`;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export default LocationMap;
