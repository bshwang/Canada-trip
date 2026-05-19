import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import { Phone, Languages, CreditCard, Receipt, AlertOctagon, Utensils, ArrowRightLeft } from "lucide-react";
import FxConverter from "@/components/FxConverter";

export default function InfoPage() {
  const trip = getTrip();
  const info = trip.info;
  return (
    <>
      <Header title="현지 정보" subtitle="세금·팁·비상연락·한식" />
      <div className="px-5 space-y-5 pb-4">
        <Card title="세금" icon={<Receipt size={16} className="text-brand" />}>
          <ul className="space-y-1.5 text-sm">
            {info.tax.map((t, i) => (
              <li key={i} className="text-stone-700">
                <div className="font-medium">{t.region}</div>
                <div className="text-xs text-stone-500">GST {t.gst}{t.pst !== "없음" && ` · PST ${t.pst}`} — {t.note}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="팁" icon={<CreditCard size={16} className="text-brand" />}>
          <div className="text-sm text-stone-700">{info.tip}</div>
        </Card>

        <Card title="비상" icon={<Phone size={16} className="text-rose-600" />}>
          <div className="text-sm font-mono text-stone-900">{info.emergency}</div>
        </Card>

        <Card title="운전 주의" icon={<AlertOctagon size={16} className="text-amber-600" />}>
          <ul className="text-sm text-stone-700 space-y-1 list-disc pl-5">
            {info.drivingRules.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </Card>

        <Card title="언어·통화" icon={<Languages size={16} className="text-sky2" />}>
          <div className="text-sm text-stone-700">{info.language}</div>
          <div className="text-xs text-stone-500 mt-1">{info.currency}</div>
        </Card>

        <Card title="환율 변환" icon={<ArrowRightLeft size={16} className="text-sky2" />}>
          <FxConverter />
        </Card>

        <Card title="한식·한국 마트" icon={<Utensils size={16} className="text-brand" />}>
          <ul className="text-sm text-stone-700 space-y-1.5">
            {info.koreanFood.map((k, i) => {
              const p = trip.places[k.place];
              return (
                <li key={i}>
                  <div className="font-medium">{k.name}</div>
                  <div className="text-xs text-stone-500">{k.kind}{p && ` · ${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}`}</div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-stone-200 p-4">
      <h2 className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-2">{icon}{title}</h2>
      {children}
    </section>
  );
}
