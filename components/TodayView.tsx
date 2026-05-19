"use client";
import { useEffect, useState } from "react";
import type { TripData, Day } from "@/lib/trip";
import Link from "next/link";
import { Plane, BedDouble, Car, MapPin } from "lucide-react";
import PreTripChecklist from "./PreTripChecklist";

const CACHE_PREFIX = "canada-trip-cache-v2::";

function loadEditedDay(d: Day | undefined): Day | undefined {
  if (!d) return d;
  if (typeof window === "undefined") return d;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + `day-${d.day}`);
    if (raw) {
      const edited = JSON.parse(raw);
      return { ...d, ...edited };
    }
  } catch {}
  return d;
}

function todayInVancouver(): Date {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return new Date(`${y}-${m}-${d}T00:00:00`);
}

export default function TodayView({ trip }: { trip: TripData }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(todayInVancouver());
    const id = setInterval(() => setNow(todayInVancouver()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <div className="px-5 py-10 text-center text-stone-400">로딩…</div>;
  }

  const start = new Date(trip.startDate + "T00:00:00");
  const end = new Date(trip.endDate + "T00:00:00");
  const msDay = 86_400_000;
  const dayIndex = Math.floor((now.getTime() - start.getTime()) / msDay);

  if (now < start) {
    const daysLeft = Math.ceil((start.getTime() - now.getTime()) / msDay);
    return <PreTrip trip={trip} daysLeft={daysLeft} />;
  }
  if (now > end) {
    return <PostTrip trip={trip} />;
  }

  const today = loadEditedDay(trip.days[dayIndex])!;
  const tomorrow = loadEditedDay(trip.days[dayIndex + 1]);
  return <DuringTrip trip={trip} today={today} tomorrow={tomorrow} dayNum={dayIndex + 1} />;
}

function PreTrip({ trip, daysLeft }: { trip: TripData; daysLeft: number }) {
  return (
    <div className="px-5 pt-8 pb-4">
      <div className="rounded-2xl bg-gradient-to-br from-brand to-emerald-700 text-white p-6 shadow-lg">
        <div className="text-xs uppercase tracking-wider opacity-80">출발까지</div>
        <div className="text-6xl font-bold mt-1 tabular-nums">D−{daysLeft}</div>
        <div className="text-sm mt-3 opacity-90">{trip.title}</div>
        <div className="text-xs mt-1 opacity-75">{trip.subtitle}</div>
        <div className="text-xs mt-3 opacity-90">{trip.startDate} → {trip.endDate}</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link href="/reservations" className="rounded-xl border border-stone-200 p-4">
          <Plane size={18} className="text-sky2" />
          <div className="text-xs text-stone-500 mt-2">첫 항공편</div>
          <div className="text-sm font-medium">AC64</div>
        </Link>
        <Link href="/packing" className="rounded-xl border border-stone-200 p-4">
          <BedDouble size={18} className="text-brand" />
          <div className="text-xs text-stone-500 mt-2">짐 싸기</div>
          <div className="text-sm font-medium">체크리스트</div>
        </Link>
      </div>

      <PreTripChecklist />

      <div className="mt-5">
        <h2 className="text-sm font-semibold text-stone-700 mb-2">여정 미리보기</h2>
        <ul className="space-y-1.5">
          {trip.days.slice(0, 4).map((d) => (
            <li key={d.day} className="flex gap-3 text-sm">
              <span className="text-stone-400 w-12">D{d.day}</span>
              <span className="text-stone-700 flex-1 truncate">{d.title}</span>
            </li>
          ))}
          <li className="text-xs text-stone-400 pl-15 pt-1">…</li>
        </ul>
        <Link href="/itinerary" className="inline-block mt-3 text-sm text-brand font-medium">
          전체 일정 보기 →
        </Link>
      </div>
    </div>
  );
}

function DuringTrip({ trip, today, tomorrow, dayNum }: { trip: TripData; today: Day; tomorrow?: Day; dayNum: number }) {
  const baseCity = trip.places[today.base];
  return (
    <div className="px-5 pt-6 pb-4">
      <div className="text-xs text-stone-500">Day {dayNum} · {today.weekday} · {today.date}</div>
      <h1 className="text-xl font-bold text-stone-900 mt-1">{today.title}</h1>
      <p className="text-sm text-stone-500 mt-1">{today.summary}</p>

      {today.drive && (
        <div className="mt-4 rounded-xl bg-sky2-light border border-sky-100 p-3 flex items-center gap-3">
          <Car size={20} className="text-sky2" />
          <div className="flex-1">
            <div className="text-xs text-stone-500">오늘의 드라이브</div>
            <div className="text-sm font-medium">
              {trip.places[today.drive.from]?.name} → {trip.places[today.drive.to]?.name}
            </div>
            <div className="text-xs text-stone-500">{today.drive.km}km · 약 {today.drive.hours}h</div>
          </div>
        </div>
      )}

      <h2 className="text-sm font-semibold text-stone-700 mt-5 mb-2">오늘 일정</h2>
      <ol className="space-y-2.5">
        {today.activities.map((a, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="text-brand font-medium w-10 shrink-0">{a.time}</span>
            <div className="flex-1">
              <div className="font-medium text-stone-800">{a.place}</div>
              {a.note && <div className="text-xs text-stone-500">{a.note}</div>}
            </div>
          </li>
        ))}
      </ol>

      {today.hotel && (
        <div className="mt-5 rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2">
            <BedDouble size={16} className="text-brand" />
            <span className="text-xs text-stone-500">오늘 숙소</span>
          </div>
          <div className="text-sm font-semibold text-stone-900 mt-1">{today.hotel.name}</div>
          <div className="text-xs text-stone-500">{today.hotel.area} · 예약 {today.hotel.conf}</div>
        </div>
      )}

      {baseCity && (
        <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
          <MapPin size={14} /> {baseCity.name}
        </div>
      )}

      {tomorrow && (
        <div className="mt-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-2">내일</h2>
          <Link href="/itinerary" className="block rounded-xl border border-stone-200 p-3">
            <div className="text-xs text-stone-500">Day {tomorrow.day} · {tomorrow.date}</div>
            <div className="text-sm font-medium mt-0.5">{tomorrow.title}</div>
          </Link>
        </div>
      )}
    </div>
  );
}

function PostTrip({ trip }: { trip: TripData }) {
  return (
    <div className="px-5 pt-8 text-center">
      <div className="text-5xl">🎉</div>
      <h1 className="text-2xl font-bold mt-3">여행 완주!</h1>
      <p className="text-sm text-stone-500 mt-2">{trip.title}</p>
      <p className="text-xs text-stone-400 mt-1">{trip.startDate} → {trip.endDate}</p>
      <Link href="/itinerary" className="inline-block mt-6 text-sm text-brand font-medium">
        다시 보기 →
      </Link>
    </div>
  );
}
