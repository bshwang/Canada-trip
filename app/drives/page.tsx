import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import { Car, Fuel, Camera, Signal, AlertTriangle } from "lucide-react";

export default function DrivesPage() {
  const trip = getTrip();
  const totalKm = trip.drives.reduce((acc, d) => acc + d.km, 0);
  const totalHours = trip.drives.reduce((acc, d) => acc + d.hours, 0);

  return (
    <>
      <Header title="드라이브 구간" subtitle={`총 ${totalKm}km · 약 ${totalHours.toFixed(1)}시간`} />
      <ul className="px-5 space-y-3">
        {trip.drives.map((d, i) => {
          const from = trip.places[d.from]?.name ?? d.from;
          const to = trip.places[d.to]?.name ?? d.to;
          const noCell = d.cell.includes("끊김");
          return (
            <li key={i} className="rounded-xl border border-stone-200 p-4">
              <div className="flex items-center gap-2">
                <Car size={18} className="text-sky2" />
                <div className="font-semibold text-stone-900">{from} → {to}</div>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-stone-600">
                <span><strong className="text-stone-900">{d.km}</strong> km</span>
                <span>약 <strong className="text-stone-900">{d.hours}</strong>h</span>
              </div>

              <div className="mt-3 space-y-1.5 text-sm">
                <Row icon={<Camera size={14} className="text-emerald-600" />} label="포토 스팟">
                  {d.scenic.join(" · ")}
                </Row>
                <Row icon={<Fuel size={14} className="text-amber-600" />} label="주유">
                  {d.fuel.join(" · ")}
                </Row>
                <Row
                  icon={
                    noCell ? <AlertTriangle size={14} className="text-rose-600" /> :
                    <Signal size={14} className="text-stone-500" />
                  }
                  label="셀룰러"
                >
                  <span className={noCell ? "text-rose-600 font-medium" : ""}>{d.cell}</span>
                </Row>
              </div>

              {d.from === "bow" && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900">
                  ⛽ <strong>Saskatchewan River Crossing</strong> — Icefields Parkway 유일한 핵심 주유소.
                  꼭 풀탱크로 통과하세요.
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="pt-0.5">{icon}</div>
      <div className="text-xs">
        <span className="text-stone-500">{label}: </span>
        <span className="text-stone-800">{children}</span>
      </div>
    </div>
  );
}
