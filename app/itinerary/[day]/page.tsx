import { getTrip } from "@/lib/trip";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import DayNote from "@/components/DayNote";
import DayEditor from "@/components/DayEditor";

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
          <h2 className="text-sm font-semibold text-stone-700 mb-2">주요 정차지</h2>
          <ul className="flex flex-wrap gap-1.5">
            {day.stops.map((s) => (
              <li
                key={s}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-700"
              >
                <MapPin size={11} /> {trip.places[s]?.name ?? s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <DayNote day={day.day} />
    </div>
  );
}
