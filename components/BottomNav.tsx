"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ListChecks, Map as MapIcon, UtensilsCrossed, MoreHorizontal } from "lucide-react";

const items = [
  { href: "/", label: "오늘", icon: Calendar },
  { href: "/itinerary", label: "일정", icon: ListChecks },
  { href: "/map", label: "지도", icon: MapIcon },
  { href: "/food", label: "맛집", icon: UtensilsCrossed },
  { href: "/more", label: "더보기", icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 mx-auto max-w-md border-t border-stone-200 bg-white/95 backdrop-blur">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center py-2.5 text-[11px] gap-0.5 ${
                  active ? "text-brand" : "text-stone-500"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
