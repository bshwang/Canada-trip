"use client";
import dynamic from "next/dynamic";
import type { TripData } from "@/lib/trip";

const TripMap = dynamic(() => import("@/components/TripMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-stone-400">지도 로딩…</div>,
});

export default function TripMapClient({
  trip,
  focusKey,
}: {
  trip: TripData;
  focusKey?: string;
}) {
  return <TripMap trip={trip} focusKey={focusKey} />;
}
