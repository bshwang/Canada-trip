import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import { UtensilsCrossed } from "lucide-react";

const cityOrder = ["vancouver", "kelowna", "revelstoke", "louise", "banff", "calgary"];

const tagColor = (tag: string) => {
  if (tag.includes("예약필수")) return "bg-rose-100 text-rose-700";
  if (tag.includes("드레스코드")) return "bg-violet-100 text-violet-700";
  if (tag.includes("예약권장")) return "bg-amber-100 text-amber-700";
  if (tag.includes("워크인")) return "bg-emerald-100 text-emerald-700";
  return "bg-stone-100 text-stone-700";
};

export default function FoodPage() {
  const trip = getTrip();
  return (
    <>
      <Header title="맛집 리스트" subtitle="도시별 럭셔리·파인다이닝 셀렉션" />
      <div className="px-5 space-y-5 pb-4">
        {cityOrder.map((cityKey) => {
          const list = trip.food[cityKey];
          if (!list) return null;
          const cityName = trip.places[cityKey]?.name ?? cityKey;
          return (
            <section key={cityKey}>
              <h2 className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-2">
                <UtensilsCrossed size={14} className="text-brand" /> {cityName}
              </h2>
              <ul className="space-y-2">
                {list.map((f, i) => (
                  <li key={i} className="rounded-xl border border-stone-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-stone-900 truncate">{f.name}</div>
                      <div className="text-xs font-mono text-emerald-700">{f.price}</div>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">{f.cat}</div>
                    {f.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {f.tags.map((t) => (
                          <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${tagColor(t)}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
