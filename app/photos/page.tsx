import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import { Camera, Sunrise } from "lucide-react";

export default function PhotosPage() {
  const trip = getTrip();
  return (
    <>
      <Header title="포토 스팟" subtitle="2026년 8월 록키 매직 아워" />
      <ul className="px-5 space-y-2 pb-4">
        {trip.photos.map((p, i) => (
          <li key={i} className="rounded-xl border border-stone-200 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium text-stone-900">{p.place}</div>
              <div className="text-xs text-stone-500">{p.date}</div>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <Sunrise size={13} className="text-amber-600" />
              <span className="font-medium text-stone-800">{p.time}</span>
            </div>
            <div className="text-xs text-stone-600 mt-1.5 flex items-start gap-1.5">
              <Camera size={13} className="text-stone-400 mt-0.5 shrink-0" />
              <span><strong>구도:</strong> {p.best}</span>
            </div>
            {p.note && <div className="text-xs text-stone-500 mt-1">{p.note}</div>}
          </li>
        ))}
      </ul>
    </>
  );
}
