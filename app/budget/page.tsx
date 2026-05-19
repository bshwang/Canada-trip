import Header from "@/components/Header";
import BudgetTracker from "@/components/BudgetTracker";
import { getTrip } from "@/lib/trip";

export default function BudgetPage() {
  const trip = getTrip();
  return (
    <>
      <Header title="여행 가계부" subtitle="일자별 지출 · CAD ↔ KRW" />
      <BudgetTracker days={trip.days} />
    </>
  );
}
