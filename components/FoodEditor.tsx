"use client";
import { useState } from "react";
import type { FoodItem } from "@/lib/trip";
import { useEditableMap, uid } from "@/lib/editable";
import {
  UtensilsCrossed,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  RotateCcw,
} from "lucide-react";

type FoodWithId = FoodItem & { id: string };

const TAG_PRESETS = ["예약필수", "예약권장", "워크인 OK", "드레스코드", "곤돌라 패키지"];
const PRICE_OPTIONS = ["$", "$$", "$$$", "$$$$", "$$$$$"];

const tagColor = (tag: string) => {
  if (tag.includes("예약필수")) return "bg-rose-100 text-rose-700";
  if (tag.includes("드레스코드")) return "bg-violet-100 text-violet-700";
  if (tag.includes("예약권장")) return "bg-amber-100 text-amber-700";
  if (tag.includes("워크인")) return "bg-emerald-100 text-emerald-700";
  return "bg-stone-100 text-stone-700";
};

function seedCity(list: FoodItem[]): FoodWithId[] {
  return list.map((f, i) => ({ ...f, id: `seed-${i}` }));
}

export default function FoodEditor({
  defaults,
  cityOrder,
  cityNames,
}: {
  defaults: Record<string, FoodItem[]>;
  cityOrder: string[];
  cityNames: Record<string, string>;
}) {
  const seededDefaults: Record<string, FoodWithId[]> = {};
  for (const k of Object.keys(defaults)) {
    seededDefaults[k] = seedCity(defaults[k]);
  }

  const { data, loaded, setBucket, reset } = useEditableMap<FoodWithId[]>(
    "food",
    seededDefaults,
  );

  const [editing, setEditing] = useState<{ city: string; id: string } | null>(null);
  const [addingCity, setAddingCity] = useState<string | null>(null);
  const [newCityKey, setNewCityKey] = useState("");

  if (!loaded) {
    return <div className="px-5 py-10 text-center text-stone-400 text-sm">로딩…</div>;
  }

  const allCities = Array.from(
    new Set([...cityOrder, ...Object.keys(data)]),
  );

  function saveItem(city: string, item: FoodWithId, isNew: boolean) {
    const list = data[city] || [];
    const next = isNew
      ? [...list, item]
      : list.map((it) => (it.id === item.id ? item : it));
    setBucket(city, next);
  }

  function removeItem(city: string, id: string) {
    const list = data[city] || [];
    setBucket(
      city,
      list.filter((it) => it.id !== id),
    );
  }

  function addCity() {
    const k = newCityKey.trim();
    if (!k) return;
    if (data[k]) {
      alert("이미 존재하는 도시입니다.");
      return;
    }
    setBucket(k, []);
    setNewCityKey("");
    setAddingCity(k);
  }

  return (
    <div className="px-5 pb-4 space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-xs text-stone-500">
          {Object.values(data).reduce((s, l) => s + (l?.length || 0), 0)}곳
        </div>
        <button
          onClick={() => {
            if (confirm("초기 데이터로 복원할까요?")) reset();
          }}
          className="text-xs text-stone-500 flex items-center gap-1 active:text-stone-700"
        >
          <RotateCcw size={12} /> 초기화
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="새 도시 키 (예: jasper)"
          value={newCityKey}
          onChange={(e) => setNewCityKey(e.target.value)}
          className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <button
          onClick={addCity}
          className="px-3 rounded-lg border border-stone-300 text-sm text-stone-700 flex items-center gap-1 active:bg-stone-50"
        >
          <Plus size={14} /> 도시
        </button>
      </div>

      {allCities.map((cityKey) => {
        const list = data[cityKey] || [];
        const cityName = cityNames[cityKey] ?? cityKey;
        const isAddingHere = addingCity === cityKey;

        return (
          <section key={cityKey}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <UtensilsCrossed size={14} className="text-brand" /> {cityName}
                <span className="text-xs text-stone-400 font-normal">
                  ({list.length})
                </span>
              </h2>
              <button
                onClick={() => {
                  setAddingCity(isAddingHere ? null : cityKey);
                  setEditing(null);
                }}
                className="text-xs text-brand flex items-center gap-1 active:text-brand-dark"
              >
                <Plus size={13} /> 추가
              </button>
            </div>

            {isAddingHere && (
              <div className="mb-2">
                <FoodForm
                  initial={{ name: "", cat: "", price: "$$$", tags: [] }}
                  onSave={(v) => {
                    saveItem(cityKey, { ...v, id: uid() }, true);
                    setAddingCity(null);
                  }}
                  onCancel={() => setAddingCity(null)}
                />
              </div>
            )}

            {list.length === 0 && !isAddingHere ? (
              <div className="text-xs text-stone-400 text-center py-6 border border-dashed border-stone-200 rounded-xl">
                아직 등록된 식당이 없습니다.
              </div>
            ) : (
              <ul className="space-y-2">
                {list.map((f) =>
                  editing?.city === cityKey && editing.id === f.id ? (
                    <li key={f.id}>
                      <FoodForm
                        initial={f}
                        onSave={(v) => {
                          saveItem(cityKey, { ...v, id: f.id }, false);
                          setEditing(null);
                        }}
                        onCancel={() => setEditing(null)}
                      />
                    </li>
                  ) : (
                    <li key={f.id} className="rounded-xl border border-stone-200 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-stone-900 truncate flex-1">
                          {f.name}
                        </div>
                        <div className="text-xs font-mono text-emerald-700 shrink-0">
                          {f.price}
                        </div>
                        <div className="flex gap-1 -mr-1">
                          <button
                            onClick={() => setEditing({ city: cityKey, id: f.id })}
                            className="p-1.5 text-stone-400 active:text-brand"
                            aria-label="편집"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${f.name}" 삭제?`)) removeItem(cityKey, f.id);
                            }}
                            className="p-1.5 text-stone-400 active:text-rose-600"
                            aria-label="삭제"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">{f.cat}</div>
                      {f.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {f.tags.map((t) => (
                            <span
                              key={t}
                              className={`text-[10px] px-2 py-0.5 rounded-full ${tagColor(t)}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ),
                )}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

function FoodForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: FoodItem;
  onSave: (v: FoodItem) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [cat, setCat] = useState(initial.cat);
  const [price, setPrice] = useState(initial.price || "$$$");
  const [tags, setTags] = useState<string[]>(initial.tags || []);
  const [tagInput, setTagInput] = useState("");

  function toggleTag(t: string) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function addCustomTag() {
    const t = tagInput.trim();
    if (!t || tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  return (
    <div className="rounded-xl border-2 border-brand p-3 space-y-2 bg-white">
      <input
        type="text"
        placeholder="식당명"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="카테고리 (예: 모던 캐나디언)"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border border-stone-300 px-2 py-2 text-sm"
        />
        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded-lg border border-stone-300 px-2 py-2 text-sm font-mono"
        >
          {PRICE_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="text-xs text-stone-500 mb-1">태그</div>
        <div className="flex flex-wrap gap-1.5">
          {TAG_PRESETS.map((t) => {
            const on = tags.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={`text-[11px] px-2 py-1 rounded-full border ${
                  on
                    ? "bg-brand border-brand text-white"
                    : "border-stone-300 text-stone-600"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1.5 mt-2">
          <input
            type="text"
            placeholder="커스텀 태그"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomTag();
              }
            }}
            className="flex-1 rounded-lg border border-stone-300 px-2 py-1 text-xs"
          />
          <button
            type="button"
            onClick={addCustomTag}
            className="px-2 rounded-lg border border-stone-300 text-xs text-stone-700"
          >
            +
          </button>
        </div>
        {tags.filter((t) => !TAG_PRESETS.includes(t)).length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tags
              .filter((t) => !TAG_PRESETS.includes(t))
              .map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700"
                >
                  {t} ×
                </button>
              ))}
          </div>
        )}
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            if (!name.trim()) return;
            onSave({ name: name.trim(), cat: cat.trim(), price, tags });
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
