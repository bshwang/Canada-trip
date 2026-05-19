import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import PackingList from "@/components/PackingList";

export default function PackingPage() {
  const trip = getTrip();
  return (
    <>
      <Header title="짐 체크리스트" subtitle="8월 록키 · 럭셔리·하이크 겸용" />
      <PackingList items={trip.packing} />
    </>
  );
}
