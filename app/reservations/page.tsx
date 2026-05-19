import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import { Plane, BedDouble } from "lucide-react";

export default function ReservationsPage() {
  const trip = getTrip();
  return (
    <>
      <Header title="예약 정보" subtitle="항공권 + 호텔 컨퍼메이션" />
      <ul className="px-5 space-y-2 pb-4">
        {trip.reservations.map((r, i) => (
          <li key={i} className="rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-3">
              {r.kind === "항공"
                ? <Plane size={18} className="text-sky2" />
                : <BedDouble size={18} className="text-brand" />}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-500">{r.kind} · {r.when}</div>
                <div className="text-sm font-semibold text-stone-900 truncate">{r.label}</div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] text-stone-500">예약번호</span>
              <code className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 select-all">
                {r.code}
              </code>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
