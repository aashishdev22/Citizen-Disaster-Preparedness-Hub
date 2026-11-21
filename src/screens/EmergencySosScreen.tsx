import React, { useEffect, useState } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';
import {
  buildShareLocationText,
  DEFAULT_DEMO_COORDS,
  formatCoordinatesWithAccuracy,
  formatGpsTimestamp,
} from '../utils/gps';

type SosState = 'ready' | 'countdown' | 'active' | 'canceled';

const EMERGENCY_TYPES = [
  { id: 'medical', label: 'Medical', fullLabel: 'Medical Assistance', icon: 'medical_services' },
  { id: 'police', label: 'Police', fullLabel: 'Police Assistance', icon: 'local_police' },
  { id: 'fire', label: 'Fire', fullLabel: 'Fire Emergency', icon: 'local_fire_department' },
  { id: 'rescue', label: 'Rescue', fullLabel: 'Flood / Rescue', icon: 'flood' },
];

export function EmergencySosScreen() {
  const {
    navigate,
    showToast,
    familyMembers,
    gps,
    fetchLiveGps,
    toggleLiveGpsTracking,
    user,
  } = useApp();
  const [sosState, setSosState] = useState<SosState>('ready');
  const [selectedType, setSelectedType] = useState(EMERGENCY_TYPES[0]);
  const [countdown, setCountdown] = useState<number>(3);

  const activeCoords = gps.coords ?? DEFAULT_DEMO_COORDS;
  const displayLocality = gps.localityLabel || user.locationLabel;
  const formattedCoords = formatCoordinatesWithAccuracy(activeCoords);

  const handleShareLiveLocation = async () => {
    const freshCoords = gps.source === 'live' ? activeCoords : (await fetchLiveGps({ silent: true })) ?? activeCoords;
    const shareText = buildShareLocationText(freshCoords, displayLocality);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      }
    } catch {
      // Clipboard may be restricted in sandboxed iframes; still notify user
    }
    showToast(
      `Live GPS (${formatCoordinatesWithAccuracy(freshCoords)}) copied & shared with family contacts.`,
      'success'
    );
  };

  const gpsBadge = (() => {
    if (gps.status === 'locating') {
      return {
        label: 'Locating...',
        pillClass: 'bg-light-warning-container text-light-on-warning-container',
        dotClass: 'bg-light-warning animate-pulse',
      };
    }
    if (gps.status === 'error') {
      return {
        label: 'GPS Error',
        pillClass: 'bg-light-error-container text-light-on-error-container',
        dotClass: 'bg-light-error',
      };
    }
    if (gps.isWatching || gps.status === 'watching') {
      return {
        label: 'Live Tracking',
        pillClass: 'bg-light-success-container text-light-on-success-container',
        dotClass: 'bg-light-success animate-pulse',
      };
    }
    if (gps.status === 'locked' || gps.source === 'live') {
      return {
        label: 'Live GPS Locked',
        pillClass: 'bg-light-success-container text-light-on-success-container',
        dotClass: 'bg-light-success',
      };
    }
    return {
      label: gps.source === 'cached' ? 'Cached GPS' : 'Ready to Fetch',
      pillClass: 'bg-light-secondary-container text-light-on-secondary-container',
      dotClass: 'bg-light-secondary',
    };
  })();

  useEffect(() => {
    if (sosState !== 'countdown') return;
    if (countdown <= 0) {
      setSosState('active');
      showToast('Emergency SOS transmitted to 112 ERSS & family contacts.', 'error');
      return;
    }
    const timer = window.setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [sosState, countdown, showToast]);

  const startCountdown = () => {
    setCountdown(3);
    setSosState('countdown');
  };

  const switchStateTab = (next: SosState) => {
    if (next === 'countdown') {
      setCountdown(3);
    }
    setSosState(next);
  };

  return (
    <AppShell showBottomNav={false} showFloatingSos={false}>
      <ContextualHeader
        title="Emergency SOS"
        subtitle="Works offline via SMS fallback"
        subtitleClass="text-light-error"
        rightSlot={
          <a
            href="tel:112"
            onClick={(e) => {
              e.preventDefault();
              showToast('Dialing 112 National Emergency Response...', 'error');
            }}
            className="min-h-[40px] px-gutter-md py-gutter-xs rounded-full bg-light-error text-light-on-error inline-flex items-center gap-gutter-xs font-label text-label-md tabular-nums"
          >
            <Icon name="call" className="text-[18px]" />
            <span>Call 112</span>
          </a>
        }
      />

      <main className="flex-1 px-gutter-lg py-gutter-lg lg:py-gutter-xl max-w-[540px] lg:max-w-[680px] w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Live GPS Coordinates Banner */}
        <section
          aria-label="Current GPS Location"
          data-testid="sos-gps-banner"
          className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-md flex flex-col gap-gutter-sm"
        >
          <div className="flex items-start justify-between gap-gutter-sm">
            <div className="flex items-center gap-gutter-md min-w-0">
              <span className="w-10 h-10 rounded-full bg-light-primary-container text-light-on-primary-container inline-flex items-center justify-center shrink-0">
                <Icon
                  name={gps.status === 'locating' ? 'gps_not_fixed' : 'my_location'}
                  className={`text-[20px] ${gps.status === 'locating' ? 'animate-spin' : ''}`}
                />
              </span>
              <div className="min-w-0">
                <p
                  data-testid="sos-gps-locality"
                  className="font-label text-label-md text-light-on-surface truncate"
                >
                  {displayLocality}
                </p>
                <p
                  data-testid="sos-gps-coords"
                  className="font-mono text-mono-md text-light-on-surface-variant tabular-nums"
                >
                  {formattedCoords}
                </p>
              </div>
            </div>
            <span
              role="status"
              data-testid="sos-gps-status"
              className={`inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-full shrink-0 ${gpsBadge.pillClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${gpsBadge.dotClass}`} aria-hidden="true" />
              <span className="font-label text-label-sm">{gpsBadge.label}</span>
            </span>
          </div>

          {gps.error && (
            <p
              role="alert"
              data-testid="sos-gps-error"
              className="font-body text-body-sm text-light-error bg-light-error-container/50 rounded px-gutter-sm py-gutter-xs"
            >
              {gps.error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-gutter-sm pt-gutter-xs border-t border-light-outline-variant">
            <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
              {gps.source === 'live'
                ? `Updated ${formatGpsTimestamp(activeCoords.timestamp)}`
                : gps.source === 'cached'
                  ? `Last saved fix • ${formatGpsTimestamp(activeCoords.timestamp)}`
                  : 'Tap Fetch GPS for real-time satellite lock'}
            </span>
            <div className="flex items-center gap-gutter-xs">
              <button
                type="button"
                data-testid="sos-fetch-gps-btn"
                onClick={() => void fetchLiveGps()}
                disabled={gps.status === 'locating'}
                className="min-h-[36px] px-gutter-sm py-1 rounded bg-light-primary text-light-on-primary font-label text-label-sm inline-flex items-center gap-1 hover:opacity-95 disabled:opacity-60"
              >
                <Icon name="my_location" className="text-[16px]" />
                <span>{gps.status === 'locating' ? 'Locating...' : 'Fetch GPS'}</span>
              </button>
              <button
                type="button"
                data-testid="sos-live-track-btn"
                onClick={toggleLiveGpsTracking}
                aria-pressed={gps.isWatching}
                className={`min-h-[36px] px-gutter-sm py-1 rounded border font-label text-label-sm inline-flex items-center gap-1 transition-colors ${
                  gps.isWatching
                    ? 'border-light-success bg-light-success-container text-light-on-success-container'
                    : 'border-light-outline-variant bg-light-surface text-light-primary hover:bg-light-surface-container-low'
                }`}
              >
                <Icon name={gps.isWatching ? 'stop_circle' : 'sensors'} className="text-[16px]" />
                <span>{gps.isWatching ? 'Stop Tracking' : 'Live Track'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* State Switcher Tabs */}
        <div
          className="flex items-center gap-gutter-xs bg-light-surface-container p-gutter-xs rounded-md overflow-x-auto"
          role="tablist"
          aria-label="SOS State Preview"
        >
          {(['ready', 'countdown', 'active', 'canceled'] as SosState[]).map((st) => {
            const active = sosState === st;
            const label = st.charAt(0).toUpperCase() + st.slice(1);
            return (
              <button
                key={st}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchStateTab(st)}
                className={`flex-1 min-h-[36px] px-gutter-sm py-gutter-xs rounded font-label text-label-md transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-light-surface text-light-primary shadow-sm'
                    : 'text-light-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* STATE 1: READY */}
        {sosState === 'ready' && (
          <div className="flex flex-col gap-gutter-lg">
            <section aria-labelledby="emergency-type-heading" className="flex flex-col gap-gutter-sm">
              <h2 id="emergency-type-heading" className="font-title text-title-md text-light-on-surface">
                1. Select Emergency Type
              </h2>
              <div className="grid grid-cols-2 gap-gutter-sm">
                {EMERGENCY_TYPES.map((item) => {
                  const isSelected = selectedType.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedType(item)}
                      aria-pressed={isSelected}
                      className={`min-h-[52px] p-gutter-md rounded-md flex items-center gap-gutter-sm text-left transition-colors ${
                        isSelected
                          ? 'border-2 border-light-error bg-light-error-container/40 text-light-on-error-container'
                          : 'border border-light-outline-variant bg-light-surface text-light-on-surface hover:bg-light-surface-container-low'
                      }`}
                    >
                      <Icon name={item.icon} className="text-[22px]" />
                      <span className="font-label text-label-lg">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Giant Red SOS Button */}
            <section className="bg-light-surface rounded-lg border border-light-outline-variant p-gutter-xl flex flex-col items-center text-center gap-gutter-md shadow-sm">
              <button
                type="button"
                onClick={startCountdown}
                className="w-44 h-44 rounded-full bg-light-error text-light-on-error shadow-lg hover:opacity-95 active:scale-95 transition-transform flex flex-col items-center justify-center gap-gutter-xs border-8 border-light-error-container"
              >
                <Icon name="sos" className="text-[40px]" filled />
                <span className="font-headline text-headline-md">SEND SOS</span>
              </button>
              <div>
                <p className="font-title text-title-md text-light-on-surface">
                  Tap to start 3-second countdown
                </p>
                <p className="font-body text-body-md text-light-on-surface-variant">
                  Sends GPS location to 112 ERSS &amp; {familyMembers.length} family contacts.
                </p>
              </div>
            </section>

            {/* Direct Emergency Actions */}
            <section className="flex flex-col gap-gutter-sm">
              <a
                href="tel:112"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Dialing Emergency Services (112)...', 'error');
                }}
                className="min-h-[48px] px-gutter-lg py-gutter-md rounded-md bg-light-primary text-light-on-primary flex items-center justify-center gap-gutter-sm font-label text-label-lg hover:opacity-95"
              >
                <Icon name="call" className="text-[20px]" />
                <span>Call Emergency Services (112)</span>
              </a>
              <button
                type="button"
                onClick={() => void handleShareLiveLocation()}
                className="min-h-[48px] px-gutter-lg py-gutter-md rounded-md bg-light-surface border border-light-outline-variant text-light-primary flex items-center justify-center gap-gutter-sm font-label text-label-lg hover:bg-light-surface-container-low"
              >
                <Icon name="share_location" className="text-[20px]" />
                <span>Share Live Location Only</span>
              </button>
            </section>
          </div>
        )}

        {/* STATE 2: COUNTDOWN */}
        {sosState === 'countdown' && (
          <div className="flex flex-col items-center text-center gap-gutter-xl bg-light-error-container/50 rounded-lg border-2 border-light-error p-gutter-xl">
            <span className="font-label text-label-lg text-light-on-error-container">
              Activating {selectedType.fullLabel} SOS in...
            </span>
            <div className="w-40 h-40 rounded-full bg-light-error text-light-on-error flex items-center justify-center shadow-lg">
              <span className="font-display text-display-lg tabular-nums">{countdown}</span>
            </div>
            <p className="font-body text-body-md text-light-on-error-container">
              Your live GPS coordinates and medical ID will be transmitted automatically.
            </p>
            <button
              type="button"
              onClick={() => setSosState('canceled')}
              className="w-full min-h-[52px] px-gutter-xl py-gutter-md rounded-md bg-light-surface border-2 border-light-on-surface text-light-on-surface font-label text-label-lg hover:bg-light-surface-container-low"
            >
              Cancel SOS (Pressed Accidentally)
            </button>
          </div>
        )}

        {/* STATE 3: ACTIVE SOS */}
        {sosState === 'active' && (
          <div className="flex flex-col gap-gutter-md">
            <div
              role="alert"
              className="p-gutter-lg rounded-md bg-light-error text-light-on-error flex items-start gap-gutter-md shadow-sm"
            >
              <Icon name="emergency_share" className="text-[28px] shrink-0" filled />
              <div>
                <h2 className="font-headline text-headline-sm">SOS Alert Sent &amp; Active</h2>
                <p className="font-body text-body-md text-light-on-error/90">
                  Incident ID: #SOS-MH-89412 • {selectedType.fullLabel} • ERSS 112 &amp;{' '}
                  {familyMembers.length} contacts notified.
                </p>
              </div>
            </div>

            <div className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-lg flex flex-col gap-gutter-sm">
              <h3 className="font-title text-title-md text-light-on-surface">
                Live Dispatch Checklist
              </h3>
              <div className="flex items-center justify-between py-gutter-xs border-b border-light-outline-variant">
                <span className="font-body text-body-md text-light-on-surface">
                  112 ERSS Control Room
                </span>
                <span className="font-label text-label-sm text-light-success">Received</span>
              </div>
              <div className="flex items-center justify-between py-gutter-xs border-b border-light-outline-variant">
                <span className="font-body text-body-md text-light-on-surface">
                  Meera Sharma (Spouse)
                </span>
                <span className="font-label text-label-sm text-light-success">SMS + App Sent</span>
              </div>
              <div className="flex items-center justify-between py-gutter-xs gap-gutter-sm">
                <span className="font-body text-body-md text-light-on-surface">
                  Live GPS Tracking
                </span>
                <span className="font-mono text-label-sm text-light-secondary tabular-nums text-right">
                  {gps.isWatching ? 'Streaming • ' : ''}
                  {formattedCoords}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-gutter-sm">
              <a
                href="tel:112"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Connecting to 112 ERSS Dispatcher...', 'error');
                }}
                className="min-h-[48px] px-gutter-lg py-gutter-md rounded-md bg-light-error text-light-on-error flex items-center justify-center gap-gutter-sm font-label text-label-lg"
              >
                <Icon name="call" className="text-[20px]" />
                <span>Call 112 Dispatcher Directly</span>
              </a>
              <button
                type="button"
                onClick={() => navigate('map')}
                className="min-h-[48px] px-gutter-lg py-gutter-md rounded-md bg-light-primary text-light-on-primary flex items-center justify-center gap-gutter-sm font-label text-label-lg"
              >
                <Icon name="local_hospital" className="text-[20px]" />
                <span>View Nearest Emergency Services</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSosState('ready');
                  showToast('You have been marked safe and SOS ended.', 'success');
                }}
                className="min-h-[44px] px-gutter-lg py-gutter-sm rounded-md bg-light-surface border border-light-outline-variant text-light-on-surface-variant font-label text-label-lg hover:bg-light-surface-container-low"
              >
                Mark Myself Safe &amp; End SOS
              </button>
            </div>
          </div>
        )}

        {/* STATE 4: CANCELED */}
        {sosState === 'canceled' && (
          <div className="bg-light-surface rounded-lg border border-light-outline-variant p-gutter-xl flex flex-col items-center text-center gap-gutter-md">
            <span className="w-14 h-14 rounded-full bg-light-success-container text-light-on-success-container inline-flex items-center justify-center">
              <Icon name="check_circle" className="text-[28px]" />
            </span>
            <h2 className="font-headline text-headline-sm text-light-on-surface">
              SOS Activation Canceled
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant">
              No emergency alert was sent to 112 or your family contacts.
            </p>
            <button
              type="button"
              onClick={() => setSosState('ready')}
              className="w-full min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-primary text-light-on-primary font-label text-label-lg"
            >
              Return to SOS Screen
            </button>
          </div>
        )}
      </main>
    </AppShell>
  );
}
