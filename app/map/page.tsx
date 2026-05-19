import { getTrip } from "@/lib/trip";
import TripMapClient from "@/components/TripMapClient";

export default function MapPage() {
  const trip = getTrip();
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold">여정 지도</h1>
        <p className="text-xs text-stone-500 mt-0.5">초록 라인 = 호텔 베이스 동선</p>
      </div>
      <div className="flex-1 mx-3 mb-3 rounded-xl overflow-hidden border border-stone-200">
        <TripMapClient trip={trip} />
      </div>
    </div>
  );
}
