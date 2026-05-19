"use client";
import { useEffect, useRef, useState } from "react";
import { Download, Upload, Trash2, AlertTriangle, Check } from "lucide-react";

// Catches both legacy localStorage keys and current cache-v2 keys.
const ALL_PREFIXES = ["canada-trip-"];

interface Snapshot {
  exportedAt: string;
  app: string;
  data: Record<string, string>;
}

function collectAll(): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (ALL_PREFIXES.some((p) => k.startsWith(p))) {
      const v = localStorage.getItem(k);
      if (v !== null) out[k] = v;
    }
  }
  return out;
}

function todayStr() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

export default function BackupTool() {
  const [count, setCount] = useState(0);
  const [size, setSize] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function refresh() {
    const all = collectAll();
    setCount(Object.keys(all).length);
    setSize(JSON.stringify(all).length);
  }

  useEffect(() => {
    refresh();
  }, []);

  function showMsg(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(null), 3000);
  }

  function exportData() {
    const data = collectAll();
    const snap: Snapshot = {
      exportedAt: new Date().toISOString(),
      app: "canada-trip",
      data,
    };
    const blob = new Blob([JSON.stringify(snap, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `canada-trip-backup-${todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMsg(`${Object.keys(data).length}개 키 내보내기 완료`);
  }

  function importData() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const snap = JSON.parse(reader.result as string) as Snapshot;
        if (snap.app !== "canada-trip" || !snap.data) {
          alert("올바른 백업 파일이 아닙니다.");
          return;
        }
        const keys = Object.keys(snap.data);
        if (
          !confirm(
            `${keys.length}개 키를 복원합니다. 현재 모든 편집/체크 내용이 덮어써집니다. 진행할까요?`,
          )
        )
          return;
        // Clear existing app keys
        const toDel: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && ALL_PREFIXES.some((p) => k.startsWith(p))) toDel.push(k);
        }
        toDel.forEach((k) => localStorage.removeItem(k));
        // Restore
        for (const [k, v] of Object.entries(snap.data)) {
          localStorage.setItem(k, v);
        }
        refresh();
        showMsg(
          `${keys.length}개 키 복원 완료. 페이지를 새로고침하면 반영됩니다.`,
        );
      } catch (err) {
        alert("파일 읽기 실패: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function clearAll() {
    if (
      !confirm(
        "정말 모든 편집/체크/메모를 초기화할까요? 이 작업은 되돌릴 수 없습니다.",
      )
    )
      return;
    if (!confirm("정말 정말 확실합니까?")) return;
    const toDel: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && ALL_PREFIXES.some((p) => k.startsWith(p))) toDel.push(k);
    }
    toDel.forEach((k) => localStorage.removeItem(k));
    refresh();
    showMsg(`${toDel.length}개 키 삭제. 새로고침 시 시드 데이터로 복원됩니다.`);
  }

  return (
    <div className="px-5 pb-4 space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-stone-700 to-stone-900 text-white p-5">
        <div className="text-xs opacity-80">저장된 데이터</div>
        <div className="text-2xl font-bold mt-1 tabular-nums">
          {count} <span className="text-sm font-normal opacity-80">키</span>
        </div>
        <div className="text-xs opacity-75 mt-1 tabular-nums">
          {(size / 1024).toFixed(1)} KB
        </div>
      </div>

      {msg && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-sm flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      <button
        onClick={exportData}
        className="w-full rounded-xl bg-brand text-white py-3 text-sm font-medium flex items-center justify-center gap-2 active:bg-brand-dark"
      >
        <Download size={16} /> JSON으로 내보내기
      </button>

      <div>
        <button
          onClick={importData}
          className="w-full rounded-xl border-2 border-brand text-brand py-3 text-sm font-medium flex items-center justify-center gap-2 active:bg-brand-light"
        >
          <Upload size={16} /> JSON에서 불러오기
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          onChange={onFile}
          className="hidden"
        />
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex gap-2">
        <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          이 앱의 모든 편집·체크·메모·예산·노트는 <strong>이 기기의 브라우저에만</strong>{" "}
          저장됩니다. 다른 기기에서 사용하려면 위 백업 파일을 옮겨 불러오세요.
        </div>
      </div>

      <button
        onClick={clearAll}
        className="w-full rounded-xl border border-rose-300 text-rose-600 py-3 text-sm font-medium flex items-center justify-center gap-2 active:bg-rose-50"
      >
        <Trash2 size={16} /> 전체 초기화 (시드 데이터로 복원)
      </button>
    </div>
  );
}
