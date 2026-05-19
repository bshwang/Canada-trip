"use client";
import { useEffect, useRef, useState } from "react";
import { NotebookPen, Check } from "lucide-react";

const KEY_PREFIX = "canada-trip-note-v1::";

export default function DayNote({ day }: { day: number }) {
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_PREFIX + day);
      if (raw) setText(raw);
    } catch {}
    setLoaded(true);
  }, [day]);

  useEffect(() => {
    if (!loaded) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(KEY_PREFIX + day, text);
        setSavedAt(Date.now());
      } catch {}
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [text, loaded, day]);

  const justSaved = savedAt && Date.now() - savedAt < 2000;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
          <NotebookPen size={15} className="text-brand" /> 데이 노트
        </h2>
        {savedAt && (
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            {justSaved ? (
              <>
                <Check size={12} className="text-emerald-500" /> 저장됨
              </>
            ) : (
              <>자동 저장</>
            )}
          </span>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="이 날의 기록 — 감상, 사진 메모, 다음 여행을 위한 팁..."
        className="w-full min-h-[140px] rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-brand focus:outline-none resize-y"
      />
    </section>
  );
}
