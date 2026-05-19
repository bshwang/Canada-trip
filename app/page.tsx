import { getTrip } from "@/lib/trip";
import TodayView from "@/components/TodayView";

export default function HomePage() {
  const trip = getTrip();
  return <TodayView trip={trip} />;
}
