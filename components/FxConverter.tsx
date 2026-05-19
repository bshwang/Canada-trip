"use client";
import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { useTripData } from "@/lib/store";

export default function FxConverter() {
  const { value: rate, setValue: setRate } = useTripData<number>("fx-rate", 1000);
  const [cad, setCad] = useState<string>("10");

  const c = parseFloat(cad) || 0;
  const krw = Math.round(c * rate);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500 w-16">환율</span>
        <span className="text-xs text-stone-700">1 CAD =</span>
        <input
          type="number"
          inputMode="decimal"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
          className="w-24 rounded-lg border border-stone-300 px-2 py-1 text-sm tabular-nums"
        />
        <span className="text-xs text-stone-700">KRW</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500 w-16">CAD</span>
        <input
          type="number"
          inputMode="decimal"
          value={cad}
          onChange={(e) => setCad(e.target.value)}
          className="flex-1 rounded-lg border border-stone-300 px-2 py-1.5 text-sm tabular-nums"
        />
      </div>
      <div className="flex items-center gap-2 text-sm text-stone-800">
        <ArrowRightLeft size={14} className="text-sky2 ml-16" />
        <span className="font-semibold tabular-nums">
          ₩{krw.toLocaleString("ko-KR")}
        </span>
      </div>
    </div>
  );
}
