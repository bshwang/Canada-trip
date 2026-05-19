import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface Place { name: string; lat: number; lon: number; }
export interface Hotel { name: string; area: string; conf: string; }
export interface DriveSpec { from: string; to: string; km: number; hours: number; }
export interface Activity { time: string; place: string; note: string; }
export interface Day {
  day: number;
  date: string;
  weekday: string;
  title: string;
  summary: string;
  base: string;
  hotel: Hotel | null;
  drive: DriveSpec | null;
  activities: Activity[];
  stops: string[];
}
export interface DriveSegment {
  from: string;
  to: string;
  km: number;
  hours: number;
  scenic: string[];
  fuel: string[];
  cell: string;
}
export interface FoodItem { name: string; cat: string; price: string; tags: string[]; }
export interface PhotoSpot { place: string; time: string; date: string; best: string; note: string; }
export interface PackItem { cat: string; item: string; note?: string; }
export interface Reservation { kind: string; label: string; when: string; code: string; }

export interface TripData {
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  style: string;
  places: Record<string, Place>;
  days: Day[];
  drives: DriveSegment[];
  food: Record<string, FoodItem[]>;
  photos: PhotoSpot[];
  packing: PackItem[];
  info: {
    tax: { region: string; gst: string; pst: string; note: string }[];
    tip: string;
    emergency: string;
    drivingRules: string[];
    language: string;
    currency: string;
    koreanFood: { name: string; kind: string; place: string }[];
  };
  reservations: Reservation[];
}

let cached: TripData | null = null;

export function getTrip(): TripData {
  if (cached) return cached;
  const file = path.join(process.cwd(), "data", "trip.yaml");
  const raw = fs.readFileSync(file, "utf8");
  cached = yaml.load(raw) as TripData;
  return cached;
}

export function placeOf(trip: TripData, key: string): Place | undefined {
  return trip.places[key];
}

export function cityName(trip: TripData, key: string): string {
  return trip.places[key]?.name ?? key;
}
