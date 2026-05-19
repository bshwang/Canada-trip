"use client";
import { useMemo, useState } from "react";
import type { PhotoSpot } from "@/lib/trip";
import { useTripList, withSeedIds } from "@/lib/store";
import {
  Camera,
  Sunrise,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  RotateCcw,
} from "lucide-react";

type PhotoWithId = PhotoSpot & { id: string };

export default function PhotosEditor({ defaults }: { defaults: PhotoSpot[] }) {
  const seeded = useMemo(() => withSeedIds(defaults, "photo"), [defaults]);
  const { items, loaded, add, update, remove, reset } =
    useTripList<PhotoWithId>("photos", seeded);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  if (!loaded) {
    return <div className="px-5 py-10 text-center text-stone-400 text-sm">로딩…</div>;
  }

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-stone-500">{items.length}개</div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm("초기 데이터로 복원할까요?")) reset();
            }}
            className="text-xs text-stone-500 flex items-center gap-1 active:text-stone-700"
          >
            <RotateCcw size={12} /> 초기화
          </button>
          <button
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="text-xs text-white bg-brand px-3 py-1.5 rounded-lg flex items-center gap-1 active:bg-brand-dark"
          >
            <Plus size={14} /> 추가
          </button>
        </div>
      </div>

      {adding && (
        <PhotoForm
          initial={{ place: "", time: "", date: "", best: "", note: "" }}
          onSave={(v) => {
            add(v);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <ul className="space-y-2 mt-2">
        {items.map((p) => (
          <li key={p.id}>
            {editingId === p.id ? (
              <PhotoForm
                initial={p}
                onSave={(v) => {
                  update(p.id, v);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="rounded-xl border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-stone-900 flex-1">{p.place}</div>
                  <div className="text-xs text-stone-500">{p.date}</div>
                  <div className="flex gap-1 -mr-1">
                    <button
                      onClick={() => setEditingId(p.id)}
                      className="p-1.5 text-stone-400 active:text-brand"
                      aria-label="편집"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${p.place}" 삭제?`)) remove(p.id);
                      }}
                      className="p-1.5 text-stone-400 active:text-rose-600"
                      aria-label="삭제"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <Sunrise size={13} className="text-amber-600" />
                  <span className="font-medium text-stone-800">{p.time}</span>
                </div>
                {p.best && (
                  <div className="text-xs text-stone-600 mt-1.5 flex items-start gap-1.5">
                    <Camera size={13} className="text-stone-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>구도:</strong> {p.best}
                    </span>
                  </div>
                )}
                {p.note && (
                  <div className="text-xs text-stone-500 mt-1">{p.note}</div>
                )}
              </div>
            )}
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-stone-400 text-center py-10 border border-dashed border-stone-200 rounded-xl">
            아직 등록된 포토 스팟이 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
}

function PhotoForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: PhotoSpot;
  onSave: (v: PhotoSpot) => void;
  onCancel: () => void;
}) {
  const [place, setPlace] = useState(initial.place);
  const [time, setTime] = useState(initial.time);
  const [date, setDate] = useState(initial.date);
  const [best, setBest] = useState(initial.best);
  const [note, setNote] = useState(initial.note);

  return (
    <div className="rounded-xl border-2 border-brand p-3 space-y-2 bg-white">
      <input
        type="text"
        placeholder="장소 (예: Moraine Lake)"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="시간 (예: 일출 05:55)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-lg border border-stone-300 px-2 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="날짜 (YYYY-MM-DD)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-stone-300 px-2 py-2 text-sm"
        />
      </div>
      <input
        type="text"
        placeholder="베스트 구도"
        value={best}
        onChange={(e) => setBest(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
      <textarea
        placeholder="추가 메모"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm min-h-[60px]"
      />
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            if (!place.trim()) return;
            onSave({
              place: place.trim(),
              time: time.trim(),
              date: date.trim(),
              best: best.trim(),
              note: note.trim(),
            });
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
