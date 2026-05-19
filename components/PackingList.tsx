"use client";
import { useEffect, useMemo, useState } from "react";
import type { PackItem } from "@/lib/trip";
import { useEditableList, uid } from "@/lib/editable";
import { Check, Plus, Pencil, Trash2, X, RotateCcw } from "lucide-react";

type PackWithId = PackItem & { id: string };

const CHECK_KEY = "canada-trip-packing-v1";

function seed(items: PackItem[]): PackWithId[] {
  return items.map((it, i) => ({ ...it, id: `seed-${i}` }));
}

export default function PackingList({ items: defaults }: { items: PackItem[] }) {
  const seeded = useMemo(() => seed(defaults), [defaults]);
  const { items, loaded, add, update, remove, reset } =
    useEditableList<PackWithId>("packing", seeded);

  const [done, setDone] = useState<Record<string, boolean>>({});
  const [checkLoaded, setCheckLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECK_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
    setCheckLoaded(true);
  }, []);

  useEffect(() => {
    if (checkLoaded) localStorage.setItem(CHECK_KEY, JSON.stringify(done));
  }, [done, checkLoaded]);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!loaded) {
    return <div className="px-5 py-10 text-center text-stone-400 text-sm">로딩…</div>;
  }

  const groups: Record<string, PackWithId[]> = {};
  for (const it of items) {
    (groups[it.cat] ||= []).push(it);
  }
  const cats = Object.keys(groups);
  const totalDone = items.filter((it) => done[it.id]).length;

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-stone-500">
          체크 {totalDone}/{items.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm("초기 패킹 리스트로 복원할까요? (체크 상태는 유지)")) reset();
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
            <Plus size={14} /> 항목
          </button>
        </div>
      </div>

      {adding && (
        <div className="mb-3">
          <PackForm
            initial={{ cat: cats[0] || "기타", item: "", note: "" }}
            existingCats={cats}
            onSave={(v) => {
              add(v);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="space-y-5">
        {Object.entries(groups).map(([cat, list]) => (
          <section key={cat}>
            <h2 className="text-sm font-bold text-stone-800 mb-2">{cat}</h2>
            <ul className="space-y-1">
              {list.map((it) => {
                const checked = !!done[it.id];
                const isEditing = editingId === it.id;
                if (isEditing) {
                  return (
                    <li key={it.id}>
                      <PackForm
                        initial={it}
                        existingCats={cats}
                        onSave={(v) => {
                          update(it.id, v);
                          setEditingId(null);
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    </li>
                  );
                }
                return (
                  <li key={it.id} className="flex items-start gap-1">
                    <button
                      type="button"
                      onClick={() => setDone((s) => ({ ...s, [it.id]: !s[it.id] }))}
                      className="flex-1 flex items-start gap-3 rounded-lg px-2 py-2 text-left active:bg-stone-50"
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          checked ? "bg-brand border-brand" : "border-stone-300"
                        }`}
                      >
                        {checked && (
                          <Check size={14} className="text-white" strokeWidth={3} />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm ${
                            checked ? "line-through text-stone-400" : "text-stone-800"
                          }`}
                        >
                          {it.item}
                        </div>
                        {it.note && (
                          <div className="text-xs text-stone-500">{it.note}</div>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => setEditingId(it.id)}
                      className="p-2 text-stone-400 active:text-brand"
                      aria-label="편집"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${it.item}" 삭제?`)) remove(it.id);
                      }}
                      className="p-2 text-stone-400 active:text-rose-600"
                      aria-label="삭제"
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function PackForm({
  initial,
  existingCats,
  onSave,
  onCancel,
}: {
  initial: PackItem;
  existingCats: string[];
  onSave: (v: PackItem) => void;
  onCancel: () => void;
}) {
  const [cat, setCat] = useState(initial.cat || existingCats[0] || "기타");
  const [item, setItem] = useState(initial.item);
  const [note, setNote] = useState(initial.note || "");
  const [customCat, setCustomCat] = useState(false);

  return (
    <div className="rounded-xl border-2 border-brand p-3 space-y-2 bg-white">
      {customCat ? (
        <input
          type="text"
          placeholder="새 카테고리"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-2 py-2 text-sm"
        />
      ) : (
        <div className="flex gap-2">
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="flex-1 rounded-lg border border-stone-300 px-2 py-2 text-sm"
          >
            {existingCats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setCustomCat(true);
              setCat("");
            }}
            className="px-2 rounded-lg border border-stone-300 text-xs text-stone-700"
          >
            새 카테고리
          </button>
        </div>
      )}
      <input
        type="text"
        placeholder="항목 (예: 우산)"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="메모 (선택)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            if (!item.trim() || !cat.trim()) return;
            onSave({ cat: cat.trim(), item: item.trim(), note: note.trim() });
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
