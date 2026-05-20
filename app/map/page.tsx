import { getTrip } from "@/lib/trip";
import TripMapClient from "@/components/TripMapClient";

export default function MapPage({
  searchParams,
}: {
  searchParams: { focus?: string };
}) {
  const trip = getTrip();
  const focusKey =
    searchParams.focus && trip.places[searchParams.focus]
      ? searchParams.focus
      : undefined;
  const focusName = focusKey ? trip.places[focusKey].name : null;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold">여정 지도</h1>
        <p className="text-xs text-stone-500 mt-0.5">
          {focusName ? (
            <>
              <span className="text-brand font-medium">{focusName}</span> 위치 표시 중
            </>
          ) : (
            "초록 라인 = 호텔 베이스 동선 · 마커 탭하면 길찾기"
          )}
        </p>
      </div>
      <div className="flex-1 mx-3 mb-3 rounded-xl overflow-hidden border border-stone-200">
        <TripMapClient trip={trip} focusKey={focusKey} />
      </div>
    </div>
  );
}
