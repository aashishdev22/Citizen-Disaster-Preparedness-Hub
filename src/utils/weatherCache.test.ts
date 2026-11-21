import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearWeatherSnapshot,
  estimateSnapshotSizeKb,
  getCacheFreshness,
  getCriticalWeatherRisks,
  loadWeatherSnapshot,
  saveWeatherSnapshot,
  StorageLike,
  wasWeatherCacheCleared,
  WEATHER_CACHE_STORAGE_KEY,
} from './weatherCache';
import { WeatherForecastSnapshot } from '../types';

function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

const SAMPLE_SNAPSHOT: WeatherForecastSnapshot = {
  location: 'Dadar West, Mumbai',
  source: 'IMD Mumbai + Civic Flood Model',
  alertLevel: 'IMD Orange Alert',
  temperatureC: 28,
  condition: 'Heavy Rain',
  rainfallMmHr: 42,
  windGustsKmh: 48,
  humidityPct: 94,
  aqi: 42,
  highTideNote: 'High Tide 4.4m at 17:40 IST',
  cachedAtIso: '2026-11-20T09:00:00.000Z',
  hourly: [
    { time: 'Now', icon: 'thunderstorm', iconClass: 'text-light-primary', temp: '28°C', pop: '90% rain' },
    { time: '18:00', icon: 'rainy', iconClass: 'text-light-error', temp: '26°C', pop: '100% rain' },
  ],
  risks: [
    {
      id: 'risk-heat',
      title: 'Heatwave Risk',
      detail: 'Within monsoon normal',
      actionTip: 'Maintain normal hydration.',
      level: 'Low',
      icon: 'wb_sunny',
    },
    {
      id: 'risk-flood',
      title: 'Urban Flood & Waterlogging',
      detail: 'High tide 4.4m + heavy rain',
      actionTip: 'Avoid submerged underpasses and move vehicles to elevated zones.',
      level: 'High',
      icon: 'flood',
    },
    {
      id: 'risk-swell',
      title: 'Coastal Gusts & High Swell',
      detail: 'INCOIS swell advisory',
      actionTip: 'Stay away from seafront promenades during high tide.',
      level: 'Moderate',
      icon: 'cyclone',
    },
  ],
  outlook: [{ day: 'Today', condition: 'Very Heavy Rain', temp: '28° / 24°' }],
};

test('saveWeatherSnapshot and loadWeatherSnapshot persist and restore valid data', () => {
  const storage = createMemoryStorage();
  assert.equal(loadWeatherSnapshot(storage), null);

  const saved = saveWeatherSnapshot(SAMPLE_SNAPSHOT, storage);
  assert.equal(saved, true);
  assert.equal(wasWeatherCacheCleared(storage), false);

  const loaded = loadWeatherSnapshot(storage);
  assert.deepEqual(loaded, SAMPLE_SNAPSHOT);
  assert.match(estimateSnapshotSizeKb(loaded), /KB$/);
});

test('loadWeatherSnapshot handles corrupted or incomplete localStorage payloads safely', () => {
  const storage = createMemoryStorage();
  storage.setItem(WEATHER_CACHE_STORAGE_KEY, '{not-valid-json');
  assert.equal(loadWeatherSnapshot(storage), null);

  storage.setItem(WEATHER_CACHE_STORAGE_KEY, JSON.stringify({ location: 'Mumbai' }));
  assert.equal(loadWeatherSnapshot(storage), null);
});

test('clearWeatherSnapshot deletes cached forecast and marks cleared state', () => {
  const storage = createMemoryStorage();
  saveWeatherSnapshot(SAMPLE_SNAPSHOT, storage);
  clearWeatherSnapshot(storage);

  assert.equal(loadWeatherSnapshot(storage), null);
  assert.equal(wasWeatherCacheCleared(storage), true);
  assert.equal(estimateSnapshotSizeKb(null), '0 KB');
});

test('getCacheFreshness computes age label and flags caches older than 6 hours', () => {
  const baseMs = Date.parse('2026-11-20T09:00:00.000Z');
  assert.equal(getCacheFreshness('2026-11-20T09:00:00.000Z', baseMs + 20 * 1000).label, 'Just now');
  assert.equal(getCacheFreshness('2026-11-20T09:00:00.000Z', baseMs + 25 * 60000).label, '25m ago');
  assert.equal(getCacheFreshness('2026-11-20T09:00:00.000Z', baseMs + 25 * 60000).isStale, false);

  const stale = getCacheFreshness('2026-11-20T09:00:00.000Z', baseMs + 7 * 60 * 60000);
  assert.equal(stale.label, '7h ago');
  assert.equal(stale.isStale, true);
});

test('getCriticalWeatherRisks orders High -> Moderate -> Low and counts elevated risks', () => {
  const summary = getCriticalWeatherRisks(SAMPLE_SNAPSHOT);
  assert.equal(summary.highestLevel, 'High');
  assert.equal(summary.elevatedCount, 2);
  assert.deepEqual(
    summary.orderedRisks.map((r) => r.level),
    ['High', 'Moderate', 'Low']
  );

  const empty = getCriticalWeatherRisks(null);
  assert.equal(empty.highestLevel, 'None');
  assert.equal(empty.elevatedCount, 0);
  assert.equal(empty.orderedRisks.length, 0);
});
