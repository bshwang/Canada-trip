import { getTrip } from "@/lib/trip";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin, Navigation } from "lucide-react";
import DayNote from "@/components/DayNote";
import DayEditor from "@/components/DayEditor";
import { gmapsDirections } from "@/lib/maps";

export function generateStaticParams() {
  const trip = getTrip();
  return trip.days.map((d) => ({ day: String(d.day) }));
}

export default function DayPage({ params }: { params: { day: string } }) {
  const trip = getTrip();
  const day = trip.days.find((d) => String(d.day) === params.day);
  if (!day) return notFound();

  return (
    <div className="px-5 pt-5 pb-6">
      <Link
        href="/itinerary"
        className="inline-flex items-center text-sm text-stone-500 mb-2"
      >
        <ChevronLeft size={16} /> 전체 일정
      </Link>

      <DayEditor day={day} places={trip.places} />

      {day.stops.length > 0 && (
        <div className="mt-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-2">
            주요 정차지 <span className="text-xs font-normal text-stone-400">· 탭하면 지도</span>
          </h2>
          <ul className="space-y-1.5">
            {day.stops.map((s) => {
              const p = trip.places[s];
              return (
                <li
                  key={s}
                  className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2"
                >
                  <Link
                    href={`/map?focus=${s}`}
                    className="flex-1 flex items-center gap-2 min-w-0 active:opacity-60"
                  >
                    <MapPin size={14} className="text-brand shrink-0" />
                    <span className="text-sm text-stone-800 truncate">
                      {p?.name ?? s}
                    </span>
                  </Link>
                  {p && (
                    <a
                      href={gmapsDirections(p.lat, p.lon, p.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-sky2 px-2 py-1 rounded-lg active:bg-sky-50 shrink-0"
                    >
                      <Navigation size={13} /> 길찾기
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <DayNote day={day.day} />
    </div>
  );
}
