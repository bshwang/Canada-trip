"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/lib/auth";
import { Cloud, CloudOff, LogIn, LogOut, AlertCircle } from "lucide-react";

export default function AccountPage() {
  const { user, loading, configured, signIn, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSignIn() {
    setBusy(true);
    setErr(null);
    try {
      await signIn();
    } catch (e) {
      setErr((e as Error).message || "로그인 실패");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header title="계정 / 동기화" subtitle="Firebase로 모든 기기 동기화" />
      <div className="px-5 space-y-4 pb-4">
        {!configured ? (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle size={16} /> Firebase 미설정
            </div>
            <div>
              Vercel 환경변수에 <code className="font-mono text-xs">NEXT_PUBLIC_FIREBASE_*</code>{" "}
              를 추가해야 합니다. 자세한 방법은 README의 "Firebase 설정" 참고.
            </div>
            <div className="text-xs">
              현재는 로컬 전용으로 동작 — 이 기기 브라우저에만 저장.
            </div>
          </div>
        ) : loading ? (
          <div className="text-center text-stone-400 py-10 text-sm">로딩…</div>
        ) : user ? (
          <>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-5">
              <div className="flex items-center gap-2 text-xs opacity-80">
                <Cloud size={14} /> 클라우드 동기화 활성
              </div>
              <div className="text-base font-semibold mt-2">
                {user.displayName || "사용자"}
              </div>
              <div className="text-sm opacity-90">{user.email}</div>
            </div>

            <div className="rounded-xl border border-stone-200 p-4 text-sm text-stone-700 space-y-2">
              <div className="font-semibold text-stone-900">현재 상태</div>
              <ul className="text-xs text-stone-600 space-y-1 list-disc pl-5">
                <li>모든 편집·체크·메모는 Firestore에 자동 저장</li>
                <li>다른 기기에서 같은 계정으로 로그인하면 즉시 동기화</li>
                <li>오프라인 시 캐시에서 동작, 온라인 복귀 시 자동 업로드</li>
              </ul>
            </div>

            <button
              onClick={handleSignOut}
              disabled={busy}
              className="w-full rounded-xl border border-stone-300 text-stone-700 py-3 text-sm font-medium flex items-center justify-center gap-2 active:bg-stone-50 disabled:opacity-50"
            >
              <LogOut size={16} /> 로그아웃
            </button>
          </>
        ) : (
          <>
            <div className="rounded-2xl bg-stone-100 p-5">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <CloudOff size={14} /> 로그인하지 않음
              </div>
              <div className="text-sm mt-2 text-stone-700">
                로그인하면 모든 편집 데이터가 클라우드에 저장되어 폰·태블릿·다른
                브라우저에서 동일하게 보입니다.
              </div>
            </div>

            <button
              onClick={handleSignIn}
              disabled={busy}
              className="w-full rounded-xl bg-brand text-white py-3 text-sm font-medium flex items-center justify-center gap-2 active:bg-brand-dark disabled:opacity-50"
            >
              <LogIn size={16} /> Google로 로그인
            </button>

            {err && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 text-sm">
                {err}
              </div>
            )}

            <div className="text-xs text-stone-500">
              로그인 안 해도 앱은 동작합니다 — 다만 이 기기 브라우저에만 데이터가
              저장됩니다. 폰을 바꾸거나 캐시가 지워지면 데이터가 사라질 수
              있으니 로그인을 권장합니다.
            </div>
          </>
        )}
      </div>
    </>
  );
}
