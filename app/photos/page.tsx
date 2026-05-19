import Header from "@/components/Header";
import { getTrip } from "@/lib/trip";
import PhotosEditor from "@/components/PhotosEditor";

export default function PhotosPage() {
  const trip = getTrip();
  return (
    <>
      <Header title="포토 스팟" subtitle="추가·수정 가능" />
      <PhotosEditor defaults={trip.photos} />
    </>
  );
}
