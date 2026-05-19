import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import ReservationsEditor from "@/components/ReservationsEditor";

export default function ReservationsPage() {
  const trip = getTrip();
  return (
    <>
      <Header title="예약 정보" subtitle="항공·호텔·렌터카·투어" />
      <ReservationsEditor defaults={trip.reservations} />
    </>
  );
}
