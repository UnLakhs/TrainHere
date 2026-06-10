import { useEffect, useRef } from "react";
import maplibregl, { type LngLatBoundsLike, type Map, type Marker } from "maplibre-gl";
import type {
  LocationBoundsRequest,
  LocationResponse,
} from "../api/locations/locations";

type LocationMapProps = {
  locations: LocationResponse[];
  selectedLocationId: string | null;
  onBoundsChange: (bounds: LocationBoundsRequest) => void;
  onSelectLocation: (id: string) => void;
};

const defaultCenter: [number, number] = [23.7275, 37.9838];
const mapStyle =
  import.meta.env.VITE_MAP_STYLE_URL ?? "https://tiles.openfreemap.org/styles/liberty";

const LocationMap = ({
  locations,
  selectedLocationId,
  onBoundsChange,
  onSelectLocation,
}: LocationMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const hasFitInitialBoundsRef = useRef(false);
  const shouldRefreshBoundsAfterMoveRef = useRef(false);
  const previousSelectedLocationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: defaultCenter,
      zoom: 11,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current.on("movestart", (event) => {
      shouldRefreshBoundsAfterMoveRef.current = Boolean(event.originalEvent);
    });

    mapRef.current.on("moveend", () => {
      if (!shouldRefreshBoundsAfterMoveRef.current) {
        return;
      }

      shouldRefreshBoundsAfterMoveRef.current = false;
      const bounds = mapRef.current?.getBounds();

      if (!bounds) {
        return;
      }

      onBoundsChange({
        minLatitude: bounds.getSouth(),
        maxLatitude: bounds.getNorth(),
        minLongitude: bounds.getWest(),
        maxLongitude: bounds.getEast(),
      });
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onBoundsChange]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = locations.map((location) => {
      const markerElement = document.createElement("button");
      markerElement.className =
        selectedLocationId === location.id
          ? "h-5 w-5 rounded-full border-2 border-zinc-950 bg-emerald-300 shadow-lg shadow-black/50 ring-4 ring-emerald-300/25"
          : "h-4 w-4 rounded-full border-2 border-zinc-950 bg-zinc-50 shadow-lg shadow-black/40";
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

  return (
    <div className="min-h-130 rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
      <div
        className="h-full min-h-120 overflow-hidden rounded-md border border-zinc-800"
        ref={containerRef}
      />
    </div>
  );
};

const getLocationBounds = (locations: LocationResponse[]): LngLatBoundsLike => {
  const bounds = new maplibregl.LngLatBounds();

  locations.forEach((location) => {
    bounds.extend([location.longitude, location.latitude]);
  });

  return bounds;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export default LocationMap;
