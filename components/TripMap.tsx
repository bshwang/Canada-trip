"use client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import type { TripData } from "@/lib/trip";

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

export default function TripMap({ trip }: { trip: TripData }) {
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
        <Marker key={key} position={[p.lat, p.lon]} icon={icon}>
          <Popup>
            <div className="text-sm font-semibold">{p.name}</div>
            <div className="text-xs text-stone-500 mt-0.5">{p.lat.toFixed(4)}, {p.lon.toFixed(4)}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
