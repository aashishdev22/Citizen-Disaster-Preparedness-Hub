import { WeatherForecastSnapshot, WeatherRiskAssessment, WeatherRiskLevel } from '../types';

export const WEATHER_CACHE_STORAGE_KEY = 'cdph_offline_weather_forecast';
export const WEATHER_CACHE_CLEARED_KEY = 'cdph_offline_weather_cleared';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const RISK_PRIORITY: Record<WeatherRiskLevel, number> = {
  High: 0,
  Moderate: 1,
  Low: 2,
};

function getDefaultStorage(): StorageLike | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

export function isValidWeatherSnapshot(value: unknown): value is WeatherForecastSnapshot {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<WeatherForecastSnapshot>;
  return (
    typeof candidate.location === 'string' &&
    typeof candidate.alertLevel === 'string' &&
    typeof candidate.temperatureC === 'number' &&
    typeof candidate.condition === 'string' &&
    typeof candidate.rainfallMmHr === 'number' &&
    typeof candidate.windGustsKmh === 'number' &&
    typeof candidate.cachedAtIso === 'string' &&
    Array.isArray(candidate.hourly) &&
    Array.isArray(candidate.risks) &&
    Array.isArray(candidate.outlook)
  );
}

export function saveWeatherSnapshot(
  snapshot: WeatherForecastSnapshot,
  storage: StorageLike | null = getDefaultStorage()
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(WEATHER_CACHE_STORAGE_KEY, JSON.stringify(snapshot));
    storage.removeItem(WEATHER_CACHE_CLEARED_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadWeatherSnapshot(
  storage: StorageLike | null = getDefaultStorage()
): WeatherForecastSnapshot | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(WEATHER_CACHE_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidWeatherSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function wasWeatherCacheCleared(
  storage: StorageLike | null = getDefaultStorage()
): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(WEATHER_CACHE_CLEARED_KEY) === '1';
  } catch {
    return false;
  }
}

export function clearWeatherSnapshot(
  storage: StorageLike | null = getDefaultStorage()
): void {
  if (!storage) return;
  try {
    storage.removeItem(WEATHER_CACHE_STORAGE_KEY);
    storage.setItem(WEATHER_CACHE_CLEARED_KEY, '1');
  } catch {
    // Ignore storage errors
  }
}

export function estimateSnapshotSizeKb(snapshot: WeatherForecastSnapshot | null): string {
  if (!snapshot) return '0 KB';
  const bytes = new TextEncoder().encode(JSON.stringify(snapshot)).length;
  return `${Math.max(0.1, Number((bytes / 1024).toFixed(1)))} KB`;
}

export function getCacheFreshness(
  cachedAtIso: string,
  nowMs: number = Date.now()
): { label: string; isStale: boolean; formattedTime: string } {
  const parsedMs = Date.parse(cachedAtIso);
  if (Number.isNaN(parsedMs)) {
    return { label: 'Saved offline', isStale: false, formattedTime: '14:30 IST' };
  }

  const diffMinutes = Math.max(0, Math.floor((nowMs - parsedMs) / 60000));
  const isStale = diffMinutes >= 360; // > 6 hours old

  let label = 'Just now';
  if (diffMinutes >= 1440) {
    const days = Math.floor(diffMinutes / 1440);
    label = `${days}d ago`;
  } else if (diffMinutes >= 60) {
    const hours = Math.floor(diffMinutes / 60);
    label = `${hours}h ago`;
  } else if (diffMinutes >= 1) {
    label = `${diffMinutes}m ago`;
  }

  const date = new Date(parsedMs);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return {
    label,
    isStale,
    formattedTime: `${hh}:${mm} local`,
  };
}

export function getCriticalWeatherRisks(
  snapshot: WeatherForecastSnapshot | null
): {
  orderedRisks: WeatherRiskAssessment[];
  elevatedCount: number;
  highestLevel: WeatherRiskLevel | 'None';
} {
  if (!snapshot || snapshot.risks.length === 0) {
    return { orderedRisks: [], elevatedCount: 0, highestLevel: 'None' };
  }

  const orderedRisks = [...snapshot.risks].sort(
    (a, b) => RISK_PRIORITY[a.level] - RISK_PRIORITY[b.level]
  );
  const elevatedCount = orderedRisks.filter(
    (risk) => risk.level === 'High' || risk.level === 'Moderate'
  ).length;

  return {
    orderedRisks,
    elevatedCount,
    highestLevel: orderedRisks[0].level,
  };
}
