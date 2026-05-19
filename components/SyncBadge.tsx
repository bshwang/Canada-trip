"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Cloud, CloudOff, AlertCircle } from "lucide-react";

export default function SyncBadge() {
  const { user, loading, configured } = useAuth();

  if (loading) return null;

  if (!configured) {
    return (
      <Link
        href="/account"
        className="absolute top-2 right-2 z-30 flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200"
        title="Firebase 미설정"
      >
        <AlertCircle size={11} /> 미설정
      </Link>
    );
  }

  if (!user) {
    return (
      <Link
        href="/account"
        className="absolute top-2 right-2 z-30 flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200"
      >
        <CloudOff size={11} /> 로컬 전용
      </Link>
    );
  }

  return (
    <Link
      href="/account"
      className="absolute top-2 right-2 z-30 flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200"
      title={user.email || ""}
    >
      <Cloud size={11} /> 동기화
    </Link>
  );
}
