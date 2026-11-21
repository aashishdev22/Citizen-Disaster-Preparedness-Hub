import { GpsCoordinates } from '../types';

export const LAST_GPS_STORAGE_KEY = 'cdph_last_gps_coords_v1';

export const DEFAULT_DEMO_COORDS: GpsCoordinates = {
  latitude: 19.027,
  longitude: 72.8397,
  accuracy: 8,
  timestamp: 0,
};

interface KnownLocality {
  label: string;
  district: string;
  lat: number;
  lng: number;
}

const KNOWN_LOCALITIES: KnownLocality[] = [
  { label: 'Shivaji Park, Dadar West', district: 'Mumbai Suburban, Maharashtra', lat: 19.027, lng: 72.8397 },
  { label: 'Dadar TT Circle, Dadar East', district: 'Mumbai City, Maharashtra', lat: 19.0178, lng: 72.8478 },
  { label: 'Hindmata Junction, Parel', district: 'Mumbai City, Maharashtra', lat: 19.0085, lng: 72.8424 },
  { label: 'Bandra West, Mumbai', district: 'Mumbai Suburban, Maharashtra', lat: 19.0596, lng: 72.8295 },
  { label: 'Kurla East, Mumbai', district: 'Mumbai Suburban, Maharashtra', lat: 19.0663, lng: 72.8856 },
  { label: 'Colaba, South Mumbai', district: 'Mumbai City, Maharashtra', lat: 18.9067, lng: 72.8147 },
  { label: 'Andheri West, Mumbai', district: 'Mumbai Suburban, Maharashtra', lat: 19.1136, lng: 72.8697 },
];

export function formatCoordinates(latitude: number, longitude: number): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lngDir}`;
}

export function formatCoordinatesWithAccuracy(coords: Pick<GpsCoordinates, 'latitude' | 'longitude' | 'accuracy'>): string {
  const base = formatCoordinates(coords.latitude, coords.longitude);
  const acc = Math.max(1, Math.round(coords.accuracy));
  return `${base} • ±${acc}m`;
}

export function haversineDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function resolveNearestLocality(
  latitude: number,
  longitude: number
): { label: string; district: string; matchedKnown: boolean; distanceKm?: number } {
  let closest: KnownLocality | null = null;
  let minDistance = Infinity;

  for (const loc of KNOWN_LOCALITIES) {
    const dist = haversineDistanceKm(latitude, longitude, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  if (closest && minDistance <= 15) {
    return {
      label: closest.label,
      district: closest.district,
      matchedKnown: true,
      distanceKm: minDistance,
    };
  }

  return {
    label: `Live GPS (${formatCoordinates(latitude, longitude)})`,
    district: 'Live Satellite Fix',
    matchedKnown: false,
  };
}

export function mapGeolocationError(code?: number, fallbackMessage?: string): string {
  switch (code) {
    case 1:
      return 'Location permission denied. Allow GPS access in browser settings and retry.';
    case 2:
      return 'GPS position unavailable. Move outdoors or enable device location services.';
    case 3:
      return 'GPS request timed out. Tap Fetch GPS to retry satellite lock.';
    default:
      return fallbackMessage?.trim() || 'Live GPS is not supported on this device or browser.';
  }
}

export function buildShareLocationText(coords: GpsCoordinates, localityLabel?: string | null): string {
  const formatted = formatCoordinatesWithAccuracy(coords);
  const mapsUrl = `https://maps.google.com/?q=${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`;
  const prefix = localityLabel ? `${localityLabel} — ` : '';
  return `Emergency Live GPS: ${prefix}${formatted} | Map: ${mapsUrl}`;
}

export function formatGpsTimestamp(timestamp: number): string {
  if (!timestamp || timestamp <= 0) return 'Reference Fix';
  try {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return 'Just now';
  }
}

export function isValidGpsCoordinates(value: unknown): value is GpsCoordinates {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.latitude === 'number' &&
    Number.isFinite(v.latitude) &&
    v.latitude >= -90 &&
    v.latitude <= 90 &&
    typeof v.longitude === 'number' &&
    Number.isFinite(v.longitude) &&
    v.longitude >= -180 &&
    v.longitude <= 180 &&
    typeof v.accuracy === 'number' &&
    Number.isFinite(v.accuracy) &&
    v.accuracy >= 0 &&
    typeof v.timestamp === 'number'
  );
}

export function loadLastGpsCoords(storage?: Storage): GpsCoordinates | null {
  try {
    const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
    if (!target) return null;
    const raw = target.getItem(LAST_GPS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidGpsCoordinates(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveLastGpsCoords(coords: GpsCoordinates, storage?: Storage): boolean {
  try {
    const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
    if (!target) return false;
    target.setItem(LAST_GPS_STORAGE_KEY, JSON.stringify(coords));
    return true;
  } catch {
    return false;
  }
}
