"use client";
import { useMemo, useState } from "react";
import type { Reservation } from "@/lib/trip";
import { useTripList, withSeedIds } from "@/lib/store";
import {
  Plane,
  BedDouble,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Car,
  Ticket,
  RotateCcw,
} from "lucide-react";

type ResWithId = Reservation & { id: string };

const KIND_OPTIONS = ["항공", "호텔", "렌터카", "투어", "기타"];

function kindIcon(kind: string) {
  if (kind === "항공") return <Plane size={18} className="text-sky2" />;
  if (kind === "호텔") return <BedDouble size={18} className="text-brand" />;
  if (kind === "렌터카") return <Car size={18} className="text-amber-600" />;
  if (kind === "투어") return <Ticket size={18} className="text-violet-600" />;
  return <Ticket size={18} className="text-stone-500" />;
}

export default function ReservationsEditor({
  defaults,
}: {
  defaults: Reservation[];
}) {
  const seeded = useMemo(() => withSeedIds(defaults, "res"), [defaults]);
  const { items, loaded, add, update, remove, reset } = useTripList<ResWithId>(
    "reservations",
    seeded,
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  if (!loaded) {
    return <div className="px-5 py-10 text-center text-stone-400 text-sm">로딩…</div>;
  }

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-stone-500">{items.length}건</div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm("초기 데이터로 복원할까요? 모든 편집 내용이 사라집니다.")) {
                reset();
              }
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
        <ReservationForm
          initial={{ kind: "호텔", label: "", when: "", code: "" }}
          onSave={(v) => {
            add(v);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id}>
            {editingId === r.id ? (
              <ReservationForm
                initial={r}
                onSave={(v) => {
                  update(r.id, v);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="rounded-xl border border-stone-200 p-4">
                <div className="flex items-center gap-3">
                  {kindIcon(r.kind)}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-stone-500">
                      {r.kind} · {r.when}
                    </div>
                    <div className="text-sm font-semibold text-stone-900 truncate">
                      {r.label}
                    </div>
                  </div>
                  <div className="flex gap-1 -mr-2">
                    <button
                      onClick={() => setEditingId(r.id)}
                      className="p-2 text-stone-400 active:text-brand"
                      aria-label="편집"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${r.label}" 삭제할까요?`)) remove(r.id);
                      }}
                      className="p-2 text-stone-400 active:text-rose-600"
                      aria-label="삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {r.code && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-stone-500">예약번호</span>
                    <code className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 select-all">
                      {r.code}
                    </code>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-stone-400 text-center py-10 border border-dashed border-stone-200 rounded-xl">
            예약이 없습니다. "추가"를 눌러 시작하세요.
          </li>
        )}
      </ul>
    </div>
  );
}

function ReservationForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Reservation, "id"> & { id?: string };
  onSave: (v: Reservation) => void;
  onCancel: () => void;
}) {
  const [kind, setKind] = useState(initial.kind || "호텔");
  const [label, setLabel] = useState(initial.label || "");
  const [when, setWhen] = useState(initial.when || "");
  const [code, setCode] = useState(initial.code || "");

  return (
    <div className="rounded-xl border-2 border-brand p-3 space-y-2 bg-white">
      <div className="grid grid-cols-2 gap-2">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="rounded-lg border border-stone-300 px-2 py-2 text-sm"
        >
          {KIND_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="일자 (예: 8/4-8/6)"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="rounded-lg border border-stone-300 px-2 py-2 text-sm"
        />
      </div>
      <input
        type="text"
        placeholder="라벨 (예: Fairmont Pacific Rim 2박)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="예약번호 / 컨퍼메이션 코드"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-mono"
      />
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            if (!label.trim()) return;
            onSave({ kind, label: label.trim(), when: when.trim(), code: code.trim() });
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
