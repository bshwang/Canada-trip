import { getTrip } from "@/lib/trip";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, BedDouble, Car, MapPin } from "lucide-react";

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
      <Link href="/itinerary" className="inline-flex items-center text-sm text-stone-500 mb-2">
        <ChevronLeft size={16} /> 전체 일정
      </Link>
      <div className="text-xs text-stone-500">Day {day.day} · {day.weekday} · {day.date}</div>
      <h1 className="text-xl font-bold text-stone-900 mt-1">{day.title}</h1>
      <p className="text-sm text-stone-500 mt-1">{day.summary}</p>

      {day.drive && (
        <div className="mt-4 rounded-xl bg-sky2-light border border-sky-100 p-3 flex items-center gap-3">
          <Car size={20} className="text-sky2" />
          <div className="flex-1">
            <div className="text-xs text-stone-500">드라이브</div>
            <div className="text-sm font-medium">
              {trip.places[day.drive.from]?.name} → {trip.places[day.drive.to]?.name}
            </div>
            <div className="text-xs text-stone-500">{day.drive.km}km · 약 {day.drive.hours}h</div>
          </div>
        </div>
      )}

      <h2 className="text-sm font-semibold text-stone-700 mt-5 mb-2">시간대별</h2>
      <ol className="space-y-2.5">
        {day.activities.map((a, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="text-brand font-medium w-10 shrink-0">{a.time}</span>
            <div className="flex-1">
              <div className="font-medium text-stone-800">{a.place}</div>
              {a.note && <div className="text-xs text-stone-500">{a.note}</div>}
            </div>
          </li>
        ))}
      </ol>

      {day.hotel && (
        <div className="mt-5 rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2">
            <BedDouble size={16} className="text-brand" />
            <span className="text-xs text-stone-500">숙소</span>
          </div>
          <div className="text-sm font-semibold text-stone-900 mt-1">{day.hotel.name}</div>
          <div className="text-xs text-stone-500">{day.hotel.area} · 예약 {day.hotel.conf}</div>
        </div>
      )}

      {day.stops.length > 0 && (
        <div className="mt-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-2">주요 정차지</h2>
          <ul className="flex flex-wrap gap-1.5">
            {day.stops.map((s) => (
              <li key={s} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-700">
                <MapPin size={11} /> {trip.places[s]?.name ?? s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
