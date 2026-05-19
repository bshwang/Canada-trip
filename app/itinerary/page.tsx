import Link from "next/link";
import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import { ChevronRight } from "lucide-react";

export default function ItineraryPage() {
  const trip = getTrip();
  return (
    <>
      <Header title="전체 일정" subtitle={`${trip.startDate} → ${trip.endDate}`} />
      <ul className="px-5 space-y-2">
        {trip.days.map((d) => (
          <li key={d.day}>
            <Link
              href={`/itinerary/${d.day}`}
              className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 active:bg-stone-50"
            >
              <div className="w-12 shrink-0 text-center">
                <div className="text-xs text-stone-400">DAY</div>
                <div className="text-lg font-bold text-brand leading-none">{d.day}</div>
                <div className="text-[10px] text-stone-400 mt-0.5">{d.weekday}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-500">{d.date}</div>
                <div className="text-sm font-semibold text-stone-800 truncate">{d.title}</div>
                <div className="text-xs text-stone-500 truncate">{d.summary}</div>
              </div>
              <ChevronRight size={18} className="text-stone-400 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
