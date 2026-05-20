"use client";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";
import type { TripData } from "@/lib/trip";
import { gmapsDirections } from "@/lib/maps";

// Fix default marker icons (Leaflet/Webpack incompat)
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Highlighted icon for the focused place
const focusIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [33, 54],
  iconAnchor: [16, 54],
  popupAnchor: [1, -46],
  shadowSize: [54, 54],
  className: "focus-marker",
});

function FocusController({
  focusKey,
  places,
  markerRefs,
}: {
  focusKey?: string;
  places: TripData["places"];
  markerRefs: React.MutableRefObject<Record<string, L.Marker | null>>;
}) {
  const map = useMap();
  useEffect(() => {
    if (!focusKey) return;
    const p = places[focusKey];
    if (!p) return;
    map.flyTo([p.lat, p.lon], 11, { duration: 1.0 });
    const t = setTimeout(() => {
      markerRefs.current[focusKey]?.openPopup();
    }, 1100);
    return () => clearTimeout(t);
  }, [focusKey, places, map, markerRefs]);
  return null;
}

export default function TripMap({
  trip,
  focusKey,
}: {
  trip: TripData;
  focusKey?: string;
}) {
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const route = useMemo(() => {
    const keys = ["vancouver", "kelowna", "revelstoke", "bow", "moraine", "louise", "banff", "calgary"];
    return keys
      .map((k) => trip.places[k])
      .filter(Boolean)
      .map((p) => [p.lat, p.lon] as [number, number]);
  }, [trip]);

  const bounds = useMemo(() => {
    const all = Object.values(trip.places);
    const lats = all.map((p) => p.lat);
    const lons = all.map((p) => p.lon);
    return L.latLngBounds(
      [Math.min(...lats), Math.min(...lons)],
      [Math.max(...lats), Math.max(...lons)]
    );
  }, [trip]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [20, 20] }}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={route} pathOptions={{ color: "#059669", weight: 3, opacity: 0.7 }} />
      {Object.entries(trip.places).map(([key, p]) => (
        <Marker
          key={key}
          position={[p.lat, p.lon]}
          icon={key === focusKey ? focusIcon : icon}
          ref={(m) => {
            markerRefs.current[key] = m;
          }}
        >
          <Popup>
            <div className="text-sm font-semibold">{p.name}</div>
            <div className="text-xs text-stone-500 mt-0.5">
              {p.lat.toFixed(4)}, {p.lon.toFixed(4)}
            </div>
            <a
              href={gmapsDirections(p.lat, p.lon, p.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1.5 text-xs font-medium text-sky-700 underline"
            >
              Google Maps 길찾기 →
            </a>
          </Popup>
        </Marker>
      ))}
      <FocusController focusKey={focusKey} places={trip.places} markerRefs={markerRefs} />
    </MapContainer>
  );
}
