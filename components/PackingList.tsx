"use client";
import { useEffect, useState } from "react";
import type { PackItem } from "@/lib/trip";
import { Check } from "lucide-react";

const KEY = "canada-trip-packing-v1";

export default function PackingList({ items }: { items: PackItem[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(done));
  }, [done, loaded]);

  const groups: Record<string, PackItem[]> = {};
  for (const it of items) {
    (groups[it.cat] ||= []).push(it);
  }

  const totalDone = Object.values(done).filter(Boolean).length;

  return (
    <div className="px-5 pb-4">
      <div className="text-xs text-stone-500 mb-3">
        체크 {totalDone}/{items.length}
      </div>
      <div className="space-y-5">
        {Object.entries(groups).map(([cat, list]) => (
          <section key={cat}>
            <h2 className="text-sm font-bold text-stone-800 mb-2">{cat}</h2>
            <ul className="space-y-1">
              {list.map((it) => {
                const id = `${cat}::${it.item}`;
                const checked = !!done[id];
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setDone((s) => ({ ...s, [id]: !s[id] }))}
                      className="w-full flex items-start gap-3 rounded-lg px-2 py-2 text-left active:bg-stone-50"
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          checked ? "bg-brand border-brand" : "border-stone-300"
                        }`}
                      >
                        {checked && <Check size={14} className="text-white" strokeWidth={3} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${checked ? "line-through text-stone-400" : "text-stone-800"}`}>
                          {it.item}
                        </div>
                        {it.note && <div className="text-xs text-stone-500">{it.note}</div>}
                      </div>
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
