import Link from "next/link";
import Header from "@/components/Header";
import { Car, BookmarkCheck, Camera, Backpack, Info, ChevronRight, Wallet, Shield } from "lucide-react";

const links = [
  { href: "/drives",       label: "드라이브 구간",     icon: Car,           color: "text-sky2" },
  { href: "/reservations", label: "예약 정보",       icon: BookmarkCheck, color: "text-brand" },
  { href: "/photos",       label: "포토 스팟",       icon: Camera,        color: "text-amber-600" },
  { href: "/budget",       label: "여행 가계부",      icon: Wallet,        color: "text-emerald-700" },
  { href: "/packing",      label: "짐 체크리스트",     icon: Backpack,      color: "text-emerald-600" },
  { href: "/safety",       label: "야생동물 안전",     icon: Shield,        color: "text-rose-600" },
  { href: "/info",         label: "현지 정보",       icon: Info,          color: "text-stone-700" },
];

export default function MorePage() {
  return (
    <>
      <Header title="더보기" />
      <ul className="px-5 space-y-2">
        {links.map(({ href, label, icon: Icon, color }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-3 rounded-xl border border-stone-200 p-3.5 active:bg-stone-50"
            >
              <Icon size={20} className={color} />
              <span className="flex-1 text-sm font-medium text-stone-900">{label}</span>
              <ChevronRight size={18} className="text-stone-400" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
