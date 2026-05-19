import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import FoodEditor from "@/components/FoodEditor";

const cityOrder = ["vancouver", "kelowna", "revelstoke", "louise", "banff", "calgary"];

export default function FoodPage() {
  const trip = getTrip();
  const cityNames: Record<string, string> = {};
  for (const k of Object.keys(trip.places)) {
    cityNames[k] = trip.places[k].name;
  }
  return (
    <>
      <Header title="맛집 리스트" subtitle="추가·수정 가능" />
      <FoodEditor defaults={trip.food} cityOrder={cityOrder} cityNames={cityNames} />
    </>
  );
}
