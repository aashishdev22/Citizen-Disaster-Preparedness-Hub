import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildShareLocationText,
  formatCoordinates,
  formatCoordinatesWithAccuracy,
  haversineDistanceKm,
  isValidGpsCoordinates,
  loadLastGpsCoords,
  mapGeolocationError,
  resolveNearestLocality,
  saveLastGpsCoords,
} from './gps.ts';

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe('GPS utilities', () => {
  it('formats northern/eastern and southern/western coordinates accurately', () => {
    assert.equal(formatCoordinates(19.027, 72.8397), '19.0270° N, 72.8397° E');
    assert.equal(formatCoordinates(-33.8688, -151.2093), '33.8688° S, 151.2093° W');
  });

  it('formats coordinates with rounded accuracy in meters', () => {
    const formatted = formatCoordinatesWithAccuracy({
      latitude: 19.0596,
      longitude: 72.8295,
      accuracy: 12.4,
    });
    assert.equal(formatted, '19.0596° N, 72.8295° E • ±12m');
  });

  it('calculates haversine distance between Bandra West and Dadar West accurately', () => {
    const km = haversineDistanceKm(19.027, 72.8397, 19.0596, 72.8295);
    assert.ok(km >= 3.4 && km <= 4.1, `Expected ~3.8km, got ${km}`);
  });

  it('resolves nearby Mumbai locality and falls back cleanly for distant coordinates', () => {
    const nearBandra = resolveNearestLocality(19.0596, 72.8295);
    assert.equal(nearBandra.matchedKnown, true);
    assert.equal(nearBandra.label, 'Bandra West, Mumbai');

    const distant = resolveNearestLocality(37.7749, -122.4194);
    assert.equal(distant.matchedKnown, false);
    assert.match(distant.label, /37\.7749° N, 122\.4194° W/);
    assert.equal(distant.district, 'Live Satellite Fix');
  });

  it('maps GeolocationPositionError codes to actionable messages', () => {
    assert.match(mapGeolocationError(1), /permission denied/i);
    assert.match(mapGeolocationError(2), /unavailable/i);
    assert.match(mapGeolocationError(3), /timed out/i);
    assert.match(mapGeolocationError(undefined), /not supported/i);
  });

  it('builds a shareable emergency location payload with Google Maps link', () => {
    const text = buildShareLocationText(
      { latitude: 19.0596, longitude: 72.8295, accuracy: 9, timestamp: 1730000000000 },
      'Bandra West, Mumbai'
    );
    assert.match(text, /Bandra West, Mumbai/);
    assert.match(text, /19\.0596° N, 72\.8295° E • ±9m/);
    assert.match(text, /https:\/\/maps\.google\.com\/\?q=19\.059600,72\.829500/);
  });

  it('persists and validates last known GPS coordinates in storage', () => {
    const storage = createMemoryStorage();
    const coords = {
      latitude: 19.0178,
      longitude: 72.8478,
      accuracy: 6,
      timestamp: Date.now(),
    };
    assert.equal(saveLastGpsCoords(coords, storage), true);
    const loaded = loadLastGpsCoords(storage);
    assert.deepEqual(loaded, coords);
    assert.equal(isValidGpsCoordinates({ latitude: 999, longitude: 0, accuracy: 5, timestamp: 1 }), false);
  });
});
