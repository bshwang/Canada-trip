"use client";
import { useMemo, useState } from "react";
import type { Day, Activity, Hotel, DriveSpec, Place } from "@/lib/trip";
import { useTripData, uid } from "@/lib/store";
import {
  BedDouble,
  Car,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

type ActivityWithId = Activity & { id: string };
type EditableDay = Omit<Day, "activities"> & { activities: ActivityWithId[] };

function seedDay(d: Day): EditableDay {
  return {
    ...d,
    activities: d.activities.map((a, i) => ({ ...a, id: `seed-${i}` })),
  };
}

export default function DayEditor({
  day: defaults,
  places,
}: {
  day: Day;
  places: Record<string, Place>;
}) {
  const seeded = useMemo(() => seedDay(defaults), [defaults]);
  const { value: day, setValue: setDay, loaded } = useTripData<EditableDay>(
    `day-${defaults.day}`,
    seeded,
  );

  const [editingHeader, setEditingHeader] = useState(false);
  const [editingHotel, setEditingHotel] = useState(false);
  const [editingDrive, setEditingDrive] = useState(false);
  const [editingActId, setEditingActId] = useState<string | null>(null);
  const [addingAct, setAddingAct] = useState(false);

  if (!loaded) {
    return <div className="py-10 text-center text-stone-400 text-sm">로딩…</div>;
  }

  function patch(p: Partial<EditableDay>) {
    setDay((prev) => ({ ...prev, ...p }));
  }

  function addActivity(a: Activity) {
    setDay((prev) => ({
      ...prev,
      activities: [...prev.activities, { ...a, id: uid() }],
    }));
  }

  function updateActivity(id: string, a: Activity) {
    setDay((prev) => ({
      ...prev,
      activities: prev.activities.map((it) =>
        it.id === id ? { ...it, ...a } : it,
      ),
    }));
  }

  function removeActivity(id: string) {
    setDay((prev) => ({
      ...prev,
      activities: prev.activities.filter((it) => it.id !== id),
    }));
  }

  function moveActivity(id: string, dir: -1 | 1) {
    setDay((prev) => {
      const i = prev.activities.findIndex((a) => a.id === id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.activities.length) return prev;
      const next = [...prev.activities];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...prev, activities: next };
    });
  }

  function resetAll() {
    if (!confirm("이 날의 모든 편집 내용을 초기화할까요?")) return;
    setDay(seeded);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-stone-500">
          Day {day.day} · {day.weekday} · {day.date}
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetAll}
            className="text-xs text-stone-500 flex items-center gap-1 active:text-stone-700"
          >
            <RotateCcw size={12} /> 초기화
          </button>
          <button
            onClick={() => setEditingHeader((s) => !s)}
            className="text-xs text-brand flex items-center gap-1"
          >
            <Pencil size={12} /> 제목/요약
          </button>
        </div>
      </div>

      {editingHeader ? (
        <div className="mt-2 rounded-xl border-2 border-brand p-3 space-y-2 bg-white">
          <input
            type="text"
            value={day.title}
            onChange={(e) => patch({ title: e.target.value })}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold"
            placeholder="제목"
          />
          <textarea
            value={day.summary}
            onChange={(e) => patch({ summary: e.target.value })}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm min-h-[60px]"
            placeholder="요약"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setEditingHeader(false)}
              className="flex-1 rounded-lg bg-brand text-white py-2 text-sm flex items-center justify-center gap-1"
            >
              <Check size={14} /> 완료
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold text-stone-900 mt-1">{day.title}</h1>
          <p className="text-sm text-stone-500 mt-1">{day.summary}</p>
        </>
      )}

      {/* Drive */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-semibold text-stone-500 flex items-center gap-1">
            <Car size={12} className="text-sky2" /> 드라이브
          </h2>
          <button
            onClick={() => setEditingDrive((s) => !s)}
            className="text-xs text-brand"
          >
            {day.drive ? "편집" : "추가"}
          </button>
        </div>
        {editingDrive ? (
          <DriveForm
            initial={day.drive}
            places={places}
            onSave={(v) => {
              patch({ drive: v });
              setEditingDrive(false);
            }}
            onCancel={() => setEditingDrive(false)}
            onClear={() => {
              patch({ drive: null });
              setEditingDrive(false);
            }}
          />
        ) : day.drive ? (
          <div className="rounded-xl bg-sky2-light border border-sky-100 p-3 flex items-center gap-3">
            <Car size={20} className="text-sky2" />
            <div className="flex-1">
              <div className="text-sm font-medium">
                {places[day.drive.from]?.name ?? day.drive.from} →{" "}
                {places[day.drive.to]?.name ?? day.drive.to}
              </div>
              <div className="text-xs text-stone-500">
                {day.drive.km}km · 약 {day.drive.hours}h
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-stone-400">드라이브 없음</div>
        )}
      </div>

      {/* Activities */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-stone-700">시간대별</h2>
          <button
            onClick={() => {
              setAddingAct(true);
              setEditingActId(null);
            }}
            className="text-xs text-brand flex items-center gap-1"
          >
            <Plus size={13} /> 활동 추가
          </button>
        </div>

        {addingAct && (
          <div className="mb-2">
            <ActivityForm
              initial={{ time: "", place: "", note: "" }}
              onSave={(a) => {
                addActivity(a);
                setAddingAct(false);
              }}
              onCancel={() => setAddingAct(false)}
            />
          </div>
        )}

        <ol className="space-y-2">
          {day.activities.map((a, idx) => {
            if (editingActId === a.id) {
              return (
                <li key={a.id}>
                  <ActivityForm
                    initial={a}
                    onSave={(v) => {
                      updateActivity(a.id, v);
                      setEditingActId(null);
                    }}
                    onCancel={() => setEditingActId(null)}
                  />
                </li>
              );
            }
            return (
              <li key={a.id} className="flex gap-2 text-sm items-start">
                <span className="text-brand font-medium w-10 shrink-0 mt-1">
                  {a.time}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-stone-800">{a.place}</div>
                  {a.note && <div className="text-xs text-stone-500">{a.note}</div>}
                </div>
                <div className="flex flex-col gap-0.5 -mr-1">
                  <button
                    onClick={() => moveActivity(a.id, -1)}
                    disabled={idx === 0}
                    className="p-1 text-stone-400 active:text-stone-700 disabled:opacity-30"
                    aria-label="위로"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    onClick={() => moveActivity(a.id, 1)}
                    disabled={idx === day.activities.length - 1}
                    className="p-1 text-stone-400 active:text-stone-700 disabled:opacity-30"
                    aria-label="아래로"
                  >
                    <ChevronDown size={13} />
                  </button>
                </div>
                <div className="flex gap-0.5 -mr-1">
                  <button
                    onClick={() => setEditingActId(a.id)}
                    className="p-1.5 text-stone-400 active:text-brand"
                    aria-label="편집"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`"${a.place}" 삭제?`)) removeActivity(a.id);
                    }}
                    className="p-1.5 text-stone-400 active:text-rose-600"
                    aria-label="삭제"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Hotel */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-semibold text-stone-500 flex items-center gap-1">
            <BedDouble size={12} className="text-brand" /> 숙소
          </h2>
          <button
            onClick={() => setEditingHotel((s) => !s)}
            className="text-xs text-brand"
          >
            {day.hotel ? "편집" : "추가"}
          </button>
        </div>
        {editingHotel ? (
          <HotelForm
            initial={day.hotel}
            onSave={(v) => {
              patch({ hotel: v });
              setEditingHotel(false);
            }}
            onCancel={() => setEditingHotel(false)}
            onClear={() => {
              patch({ hotel: null });
              setEditingHotel(false);
            }}
          />
        ) : day.hotel ? (
          <div className="rounded-xl border border-stone-200 p-4">
            <div className="text-sm font-semibold text-stone-900">
              {day.hotel.name}
            </div>
            <div className="text-xs text-stone-500">
              {day.hotel.area} · 예약 {day.hotel.conf}
            </div>
          </div>
        ) : (
          <div className="text-xs text-stone-400">숙소 없음</div>
        )}
      </div>
    </div>
  );
}

function ActivityForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Activity;
  onSave: (v: Activity) => void;
  onCancel: () => void;
}) {
  const [time, setTime] = useState(initial.time);
  const [place, setPlace] = useState(initial.place);
  const [note, setNote] = useState(initial.note);

  return (
    <div className="rounded-xl border-2 border-brand p-3 space-y-2 bg-white">
      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="시간"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-lg border border-stone-300 px-2 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="장소"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="col-span-2 rounded-lg border border-stone-300 px-2 py-2 text-sm"
        />
      </div>
      <input
        type="text"
        placeholder="메모"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            if (!place.trim()) return;
            onSave({ time: time.trim(), place: place.trim(), note: note.trim() });
          }}
          className="flex-1 rounded-lg bg-brand text-white py-2 text-sm font-medium flex items-center justify-center gap-1 active:bg-brand-dark"
        >
          <Check size={14} /> 저장
        </button>
        <button
          onClick={onCancel}
          className="px-4 rounded-lg border border-stone-300 py-2 text-sm text-stone-600 flex items-center gap-1"
        >
          <X size={14} /> 취소
        </button>
      </div>
    </div>
  );
}

function HotelForm({
  initial,
  onSave,
  onCancel,
  onClear,
}: {
  initial: Hotel | null;
  onSave: (v: Hotel) => void;
  onCancel: () => void;
  onClear: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [area, setArea] = useState(initial?.area || "");
  const [conf, setConf] = useState(initial?.conf || "");

  return (
    <div className="rounded-xl border-2 border-brand p-3 space-y-2 bg-white">
      <input
        type="text"
        placeholder="호텔명"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="지역"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="예약번호"
        value={conf}
        onChange={(e) => setConf(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-mono"
      />
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            if (!name.trim()) return;
            onSave({ name: name.trim(), area: area.trim(), conf: conf.trim() });
          }}
          className="flex-1 rounded-lg bg-brand text-white py-2 text-sm font-medium flex items-center justify-center gap-1"
        >
          <Check size={14} /> 저장
        </button>
        {initial && (
          <button
            onClick={onClear}
            className="px-3 rounded-lg border border-rose-300 py-2 text-sm text-rose-600"
          >
            <Trash2 size={14} />
          </button>
        )}
        <button
          onClick={onCancel}
          className="px-4 rounded-lg border border-stone-300 py-2 text-sm text-stone-600"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function DriveForm({
  initial,
  places,
  onSave,
  onCancel,
  onClear,
}: {
  initial: DriveSpec | null;
  places: Record<string, Place>;
  onSave: (v: DriveSpec) => void;
  onCancel: () => void;
  onClear: () => void;
}) {
  const placeKeys = Object.keys(places);
  const [from, setFrom] = useState(initial?.from || placeKeys[0] || "");
  const [to, setTo] = useState(initial?.to || placeKeys[1] || "");
  const [km, setKm] = useState(String(initial?.km ?? ""));
  const [hours, setHours] = useState(String(initial?.hours ?? ""));

  return (
    <div className="rounded-xl border-2 border-brand p-3 space-y-2 bg-white">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-[10px] text-stone-500 mb-0.5">출발</div>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-2 py-2 text-sm"
          >
            {placeKeys.map((k) => (
              <option key={k} value={k}>
                {places[k].name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="text-[10px] text-stone-500 mb-0.5">도착</div>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-2 py-2 text-sm"
          >
            {placeKeys.map((k) => (
              <option key={k} value={k}>
                {places[k].name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          inputMode="decimal"
          placeholder="km"
          value={km}
          onChange={(e) => setKm(e.target.value)}
          className="rounded-lg border border-stone-300 px-2 py-2 text-sm tabular-nums"
        />
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          placeholder="hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="rounded-lg border border-stone-300 px-2 py-2 text-sm tabular-nums"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            const k = parseFloat(km);
            const h = parseFloat(hours);
            if (!from || !to || !k || !h) return;
            onSave({ from, to, km: k, hours: h });
          }}
          className="flex-1 rounded-lg bg-brand text-white py-2 text-sm font-medium flex items-center justify-center gap-1"
        >
          <Check size={14} /> 저장
        </button>
        {initial && (
          <button
            onClick={onClear}
            className="px-3 rounded-lg border border-rose-300 py-2 text-sm text-rose-600"
          >
            <Trash2 size={14} />
          </button>
        )}
        <button
          onClick={onCancel}
          className="px-4 rounded-lg border border-stone-300 py-2 text-sm text-stone-600"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
