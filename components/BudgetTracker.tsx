"use client";
import { useEffect, useMemo, useState } from "react";
import type { Day } from "@/lib/trip";
import { Plus, Trash2, Wallet, ArrowRightLeft } from "lucide-react";

const KEY = "canada-trip-budget-v1";
const RATE_KEY = "canada-trip-fx-v1";

interface Expense {
  id: string;
  day: number;
  cat: string;
  label: string;
  cad: number;
  ts: number;
}

const CATS = ["식사", "숙소", "주유", "액티비티", "쇼핑", "기타"] as const;
const CAT_COLOR: Record<string, string> = {
  식사: "bg-amber-100 text-amber-800",
  숙소: "bg-emerald-100 text-emerald-800",
  주유: "bg-sky-100 text-sky-800",
  액티비티: "bg-violet-100 text-violet-800",
  쇼핑: "bg-rose-100 text-rose-800",
  기타: "bg-stone-100 text-stone-700",
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function BudgetTracker({ days }: { days: Day[] }) {
  const [items, setItems] = useState<Expense[]>([]);
  const [rate, setRate] = useState<number>(1000); // 1 CAD = X KRW
  const [loaded, setLoaded] = useState(false);

  const [day, setDay] = useState<number>(days[0]?.day ?? 1);
  const [cat, setCat] = useState<string>(CATS[0]);
  const [label, setLabel] = useState("");
  const [cad, setCad] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
      const r = localStorage.getItem(RATE_KEY);
      if (r) setRate(parseFloat(r) || 1000);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem(RATE_KEY, String(rate));
  }, [rate, loaded]);

  const totals = useMemo(() => {
    const totalCad = items.reduce((s, it) => s + it.cad, 0);
    const byCat: Record<string, number> = {};
    const byDay: Record<number, number> = {};
    for (const it of items) {
      byCat[it.cat] = (byCat[it.cat] || 0) + it.cad;
      byDay[it.day] = (byDay[it.day] || 0) + it.cad;
    }
    const daysWithSpend = Object.keys(byDay).length || 1;
    return { totalCad, byCat, byDay, avgPerDay: totalCad / daysWithSpend };
  }, [items]);

  function add() {
    const n = parseFloat(cad);
    if (!n || n <= 0 || !label.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: uid(), day, cat, label: label.trim(), cad: n, ts: Date.now() },
    ]);
    setLabel("");
    setCad("");
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const krw = (c: number) => Math.round(c * rate).toLocaleString("ko-KR");

  return (
    <div className="px-5 pb-4 space-y-5">
      {/* 합계 카드 */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs opacity-80">
          <Wallet size={14} /> 총 지출
        </div>
        <div className="text-3xl font-bold tabular-nums mt-1">
          CAD {totals.totalCad.toFixed(2)}
        </div>
        <div className="text-sm opacity-90 tabular-nums">≈ ₩{krw(totals.totalCad)}</div>
        <div className="text-xs opacity-75 mt-2">
          일평균 CAD {totals.avgPerDay.toFixed(2)} · ₩{krw(totals.avgPerDay)}
        </div>
      </div>

      {/* 환율 설정 */}
      <section className="rounded-xl border border-stone-200 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-800 mb-2">
          <ArrowRightLeft size={16} className="text-sky2" /> 환율 (1 CAD = ? KRW)
        </div>
        <input
          type="number"
          inputMode="decimal"
          step="1"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm tabular-nums"
        />
        <div className="text-xs text-stone-500 mt-1">
          출국 직전 환율로 업데이트하세요. (예: 1 CAD ≈ 1,000원)
        </div>
      </section>

      {/* 입력 폼 */}
      <section className="rounded-xl border border-stone-200 p-4 space-y-2">
        <div className="text-sm font-bold text-stone-800 mb-1">지출 추가</div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            className="rounded-lg border border-stone-300 px-2 py-2 text-sm"
          >
            {days.map((d) => (
              <option key={d.day} value={d.day}>
                Day {d.day} · {d.date.slice(5)}
              </option>
            ))}
          </select>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-lg border border-stone-300 px-2 py-2 text-sm"
          >
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="항목 (예: Eden 디너)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="CAD 금액"
            value={cad}
            onChange={(e) => setCad(e.target.value)}
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm tabular-nums"
          />
          <button
            onClick={add}
            className="px-4 rounded-lg bg-brand text-white text-sm font-medium flex items-center gap-1 active:bg-brand-dark"
          >
            <Plus size={16} /> 추가
          </button>
        </div>
        {cad && parseFloat(cad) > 0 && (
          <div className="text-xs text-stone-500 tabular-nums">
            ≈ ₩{krw(parseFloat(cad))}
          </div>
        )}
      </section>

      {/* 카테고리별 합계 */}
      {totals.totalCad > 0 && (
        <section>
          <h2 className="text-sm font-bold text-stone-800 mb-2">카테고리별</h2>
          <ul className="space-y-1.5">
            {CATS.filter((c) => totals.byCat[c]).map((c) => {
              const v = totals.byCat[c] || 0;
              const pct = (v / totals.totalCad) * 100;
              return (
                <li key={c} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLOR[c]}`}>
                      {c}
                    </span>
                    <span className="tabular-nums text-stone-700">
                      CAD {v.toFixed(2)} · ₩{krw(v)}
                    </span>
                  </div>
                  <div className="mt-1 h-1 bg-stone-100 rounded">
                    <div
                      className="h-1 bg-brand rounded"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 일자별 리스트 */}
      <section>
        <h2 className="text-sm font-bold text-stone-800 mb-2">일자별 내역</h2>
        {items.length === 0 ? (
          <div className="text-sm text-stone-400 text-center py-8 border border-dashed border-stone-200 rounded-xl">
            아직 기록된 지출이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {days.map((d) => {
              const list = items.filter((it) => it.day === d.day);
              if (list.length === 0) return null;
              const sum = list.reduce((s, it) => s + it.cad, 0);
              return (
                <div key={d.day} className="rounded-xl border border-stone-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-stone-500">
                      Day {d.day} · {d.date.slice(5)} · {d.weekday}
                    </div>
                    <div className="text-xs tabular-nums font-medium text-stone-700">
                      CAD {sum.toFixed(2)}
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {list.map((it) => (
                      <li key={it.id} className="flex items-center gap-2 text-sm">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${CAT_COLOR[it.cat]}`}
                        >
                          {it.cat}
                        </span>
                        <span className="flex-1 truncate text-stone-800">{it.label}</span>
                        <span className="tabular-nums text-stone-700">
                          {it.cad.toFixed(2)}
                        </span>
                        <button
                          onClick={() => remove(it.id)}
                          className="text-stone-400 active:text-rose-600 p-1 -m-1"
                          aria-label="삭제"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
