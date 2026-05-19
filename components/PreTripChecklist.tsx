"use client";
import { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp, ListChecks } from "lucide-react";

const KEY = "canada-trip-predeparture-v1";
const OPEN_KEY = "canada-trip-predeparture-open-v1";

interface Item {
  id: string;
  label: string;
  hint?: string;
  deadline?: string; // 출발 며칠 전
}

const ITEMS: Item[] = [
  { id: "passport", label: "여권 유효기간 6개월 이상 확인", hint: "2026-08-14 이후 6개월 = 2027-02-14 이후 만료" , deadline: "D-60"},
  { id: "eta", label: "캐나다 ETA 신청 ($7 CAD)", hint: "여권 정보와 정확히 일치해야 함", deadline: "D-30" },
  { id: "intl-license", label: "국제운전면허증 발급", hint: "운전면허시험장 또는 일부 구청, 8,500원", deadline: "D-14" },
  { id: "kor-license", label: "한국 운전면허증 챙기기", hint: "국제면허는 반드시 한국면허와 함께 제시" },
  { id: "rental-car", label: "렌터카 예약 확인 (밴쿠버 → 캘거리 편도)", hint: "픽업/반납 시간·보험·추가 운전자", deadline: "D-30" },
  { id: "hotel-conf", label: "호텔 예약 확인서 캡처/PDF 저장", hint: "Reservations 탭의 예약번호 8건 전부" },
  { id: "flight-checkin", label: "AC64 온라인 체크인 (24h 전)", hint: "Air Canada 앱에서 좌석·식사 확인" },
  { id: "esim", label: "eSIM 또는 로밍 신청", hint: "Roam Mobility / Holafly / Airalo. Icefields 통신 약함" },
  { id: "insurance", label: "여행자 보험 가입", hint: "록키 하이킹 포함 보장 확인" },
  { id: "krw-cad", label: "CAD 현금 환전 ($200-300)", hint: "팁·소액용. 99%는 카드 사용" },
  { id: "credit-card", label: "해외 사용 카드 2장 + 알림 설정", hint: "Visa/Master, 백업용 한 장 분리 보관" },
  { id: "park-pass", label: "Discovery Pass 구매 (선택)", hint: "Banff/Yoho/Jasper 7일 이상이면 이득" },
  { id: "moraine-shuttle", label: "Moraine Lake 셔틀/주차 사전 예약", hint: "Parks Canada 사이트, 자차 진입 불가", deadline: "D-7" },
  { id: "dinner-reserv", label: "파인다이닝 사전 예약 (Eden·Hawksworth 등)", hint: "OpenTable / 호텔 컨시어지", deadline: "D-14" },
  { id: "packing-done", label: "패킹 리스트 완료", hint: "Packing 탭 100%" },
];

export default function PreTripChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDone(JSON.parse(raw));
      const o = localStorage.getItem(OPEN_KEY);
      if (o !== null) setOpen(o === "1");
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(done));
  }, [done, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem(OPEN_KEY, open ? "1" : "0");
  }, [open, loaded]);

  const total = ITEMS.length;
  const doneCount = ITEMS.filter((it) => done[it.id]).length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <section className="mt-5 rounded-xl border border-stone-200 overflow-hidden">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center gap-2 px-4 py-3 active:bg-stone-50"
      >
        <ListChecks size={16} className="text-brand" />
        <span className="flex-1 text-left text-sm font-semibold text-stone-800">
          출발 전 체크리스트
        </span>
        <span className="text-xs text-stone-500 tabular-nums">
          {doneCount}/{total}
        </span>
        {open ? (
          <ChevronUp size={16} className="text-stone-400" />
        ) : (
          <ChevronDown size={16} className="text-stone-400" />
        )}
      </button>
      <div className="px-4">
        <div className="h-1 bg-stone-100 rounded">
          <div
            className="h-1 bg-brand rounded transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {open && (
        <ul className="p-2 pt-3 space-y-0.5">
          {ITEMS.map((it) => {
            const checked = !!done[it.id];
            return (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() =>
                    setDone((s) => ({ ...s, [it.id]: !s[it.id] }))
                  }
                  className="w-full flex items-start gap-3 rounded-lg px-2 py-2 text-left active:bg-stone-50"
                >
                  <span
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                      checked
                        ? "bg-brand border-brand"
                        : "border-stone-300"
                    }`}
                  >
                    {checked && (
                      <Check
                        size={14}
                        className="text-white"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm ${
                          checked
                            ? "line-through text-stone-400"
                            : "text-stone-800"
                        }`}
                      >
                        {it.label}
                      </span>
                      {it.deadline && !checked && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                          {it.deadline}
                        </span>
                      )}
                    </div>
                    {it.hint && (
                      <div className="text-xs text-stone-500">{it.hint}</div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
