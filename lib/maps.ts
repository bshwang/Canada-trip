// Pure helpers for building external map links (no server deps — safe in client).

export function gmapsDirections(
  lat: number,
  lon: number,
  label?: string,
): string {
  const dest = label
    ? `${encodeURIComponent(label)}`
    : `${lat},${lon}`;
  // destination_place_id 없이 좌표 우선 — 정확도 위해 좌표 사용
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
}

export function gmapsDirectionsBetween(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lon}&destination=${to.lat},${to.lon}&travelmode=driving`;
}

export function gmapsSearch(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
