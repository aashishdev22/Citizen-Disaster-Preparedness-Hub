import React, { useState } from 'react';
import { AppShell, Icon, SafeImage } from '../components/Shell';
import { useApp } from '../state/AppContext';
import { LOCATION_OPTIONS, WATERLOGGING_IMAGE_URL } from '../data/seedData';
import { ScreenId } from '../types';
import { formatCoordinatesWithAccuracy } from '../utils/gps';

export function HomeDashboardScreen() {
  const { user, updateUser, navigate, preparedness, unreadCount, showToast, gps, fetchLiveGps } = useApp();
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const quickActions: {
    label: string;
    icon: string;
    bgClass: string;
    target: ScreenId;
  }[] = [
    {
      label: 'SOS',
      icon: 'emergency',
      bgClass: 'bg-light-error-container text-light-on-error-container',
      target: 'sos',
    },
    {
      label: 'Live Alerts',
      icon: 'campaign',
      bgClass: 'bg-light-warning-container text-light-on-warning-container',
      target: 'alerts',
    },
    {
      label: 'Find Shelter',
      icon: 'night_shelter',
      bgClass: 'bg-light-secondary-container text-light-on-secondary-container',
      target: 'map',
    },
    {
      label: 'Guides',
      icon: 'menu_book',
      bgClass: 'bg-light-primary-container text-light-on-primary-container',
      target: 'safety',
    },
    {
      label: 'Kit Planner',
      icon: 'medical_services',
      bgClass: 'bg-light-secondary-container text-light-on-secondary-container',
      target: 'kit',
    },
    {
      label: 'Report',
      icon: 'add_a_photo',
      bgClass: 'bg-light-warning-container text-light-on-warning-container',
      target: 'report',
    },
    {
      label: 'Contacts',
      icon: 'contact_phone',
      bgClass: 'bg-light-primary-container text-light-on-primary-container',
      target: 'contacts',
    },
    {
      label: 'Family',
      icon: 'family_restroom',
      bgClass: 'bg-light-success-container text-light-on-success-container',
      target: 'family',
    },
  ];

  const missingSummary =
    preparedness.missingItems.length > 0
      ? `Missing: ${preparedness.missingItems.slice(0, 2).join(', ')}.`
      : 'All essential items packed!';

  return (
    <AppShell showBottomNav showFloatingSos>
      {/* Mobile Navy Header (exact match to Home Dashboard Mobile HTML) */}
      <header className="lg:hidden sticky top-0 z-30 bg-light-primary text-light-on-primary px-gutter-lg py-gutter-md flex items-center justify-between gap-gutter-sm">
        <div className="flex items-center gap-gutter-md min-w-0">
          <button
            type="button"
            onClick={() => navigate('profile')}
            aria-label="User Profile"
            className="shrink-0 rounded-full"
          >
            <SafeImage
              src={user.avatarUrl}
              alt={user.name}
              fallbackIcon="person"
              className="w-10 h-10 rounded-full object-cover border-2 border-light-primary-container"
            />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-label text-label-sm text-light-primary-container truncate">
              Stay Safe, Stay Prepared.
            </p>
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1 max-w-full min-w-0 text-light-on-primary hover:opacity-90"
            >
              <Icon name="location_on" className="text-[16px] shrink-0" />
              <span className="font-title text-title-sm truncate">{user.locationLabel}</span>
              <Icon name="expand_more" className="text-[16px] shrink-0" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-gutter-xs shrink-0">
          <span className="font-label text-label-sm px-2 py-0.5 rounded-full bg-light-secondary text-light-on-secondary">
            DEMO
          </span>
          <button
            type="button"
            onClick={() => navigate('notifications')}
            aria-label={`${unreadCount} unread disaster notifications`}
            className="relative w-11 h-11 rounded-full bg-light-on-primary/10 hover:bg-light-on-primary/20 inline-flex items-center justify-center"
          >
            <Icon name="notifications" className="text-[22px]" />
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-gutter-xs rounded-full bg-light-error text-light-on-error tabular-nums"
              >
                <span className="font-label text-label-sm">{unreadCount}</span>
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Desktop Top Header (exact match to Home Dashboard Desktop HTML) */}
      <header className="hidden lg:flex min-h-16 bg-light-surface border-b border-light-outline-variant px-gutter-xl py-gutter-sm items-center justify-between gap-gutter-md sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-headline-sm text-light-on-surface">
            Stay Safe, Stay Prepared.
          </h1>
          <button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="font-label text-label-md text-light-on-surface-variant hover:text-light-primary inline-flex items-center gap-1"
          >
            <span>
              {user.locationLabel} • {user.districtState}
            </span>
            <Icon name="expand_more" className="text-[16px]" />
          </button>
        </div>

        <div className="flex items-center gap-gutter-md">
          <span className="font-label text-label-sm px-gutter-sm py-gutter-xs rounded-full bg-light-secondary-container text-light-on-secondary-container">
            Sample Demo Data
          </span>
          <button
            type="button"
            onClick={() => navigate('sos')}
            className="min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-error text-light-on-error font-label text-label-lg inline-flex items-center gap-gutter-xs shadow-sm hover:opacity-95 whitespace-nowrap"
          >
            <Icon name="sos" className="text-[20px]" />
            <span>Emergency SOS (112)</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('profile')}
            aria-label="Open User Profile"
            className="rounded-full"
          >
            <SafeImage
              src={user.avatarUrl}
              alt={user.name}
              fallbackIcon="person"
              className="w-10 h-10 rounded-full object-cover border border-light-outline-variant"
            />
          </button>
        </div>
      </header>

      {/* MOBILE MAIN BODY */}
      <main className="lg:hidden flex-1 px-gutter-lg py-gutter-lg flex flex-col gap-gutter-lg">
        {/* Dynamic Current Safety Status Card */}
        <section
          aria-labelledby="mobile-safety-status-heading"
          className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-lg shadow-sm flex flex-col gap-gutter-md"
        >
          <div className="flex items-start justify-between gap-gutter-sm">
            <div className="flex items-center gap-gutter-sm">
              <span className="w-10 h-10 rounded-full bg-light-warning-container text-light-on-warning-container inline-flex items-center justify-center shrink-0">
                <Icon name="warning" className="text-[22px]" filled />
              </span>
              <div>
                <h1
                  id="mobile-safety-status-heading"
                  className="font-title text-title-md text-light-on-surface"
                >
                  Advisory: Heavy Rain
                </h1>
                <p className="font-label text-label-md text-light-on-surface-variant tabular-nums">
                  Updated 14:25 IST • IMD Verified
                </p>
              </div>
            </div>
            <span
              role="status"
              className="inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-full bg-light-warning-container text-light-on-warning-container shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-warning-orange" aria-hidden="true" />
              <span className="font-label text-label-sm">Warning</span>
            </span>
          </div>

          <p className="font-body text-body-md text-light-on-surface text-pretty">
            Moderate-to-heavy monsoon showers expected over Mumbai Suburban for the next 6 hours. 2
            active advisories in your ward.
          </p>

          <div className="flex items-center justify-between gap-gutter-sm pt-gutter-xs border-t border-light-outline-variant">
            <span className="font-label text-label-md text-light-on-surface-variant">
              High Tide: 17:40 IST (4.4m)
            </span>
            <button
              type="button"
              onClick={() => navigate('alerts')}
              className="font-label text-label-lg text-light-primary hover:underline inline-flex items-center gap-gutter-xs"
            >
              <span>View 2 Alerts</span>
              <Icon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </section>

        {/* Emergency SOS & 112 Action Card */}
        <section aria-label="Emergency SOS Actions" className="grid grid-cols-1 gap-gutter-sm">
          <button
            type="button"
            onClick={() => navigate('sos')}
            className="min-h-[56px] px-gutter-lg py-gutter-md rounded-md bg-light-error text-light-on-error hover:opacity-95 transition-opacity flex items-center justify-between gap-gutter-md shadow-sm text-left"
          >
            <div className="flex items-center gap-gutter-md">
              <span className="w-10 h-10 rounded-full bg-light-on-error/20 inline-flex items-center justify-center shrink-0">
                <Icon name="sos" className="text-[24px]" filled />
              </span>
              <div>
                <span className="font-title text-title-md block">Emergency SOS</span>
                <span className="font-body text-body-md text-light-on-error block">
                  Alert 112 &amp; share live GPS location
                </span>
              </div>
            </div>
            <Icon name="arrow_forward" className="text-[24px]" />
          </button>

          <a
            href="tel:112"
            onClick={(e) => {
              e.preventDefault();
              showToast('Dialing 112 — National Emergency Response Helpline...', 'error');
            }}
            className="min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-surface border border-light-error text-light-error hover:bg-light-error-container/40 transition-colors flex items-center justify-center gap-gutter-sm"
          >
            <Icon name="call" className="text-[20px]" />
            <span className="font-label text-label-lg tabular-nums">
              Quick Call 112 — National Helpline
            </span>
          </a>
        </section>

        {/* Quick Actions 8-Tile Grid */}
        <section aria-labelledby="quick-actions-heading" className="flex flex-col gap-gutter-md">
          <h2 id="quick-actions-heading" className="font-headline text-headline-sm text-light-on-surface">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-gutter-sm">
            {quickActions.map((act) => (
              <button
                key={act.label}
                type="button"
                onClick={() => navigate(act.target)}
                className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-sm hover:bg-light-surface-container-low flex flex-col items-center text-center gap-gutter-xs"
              >
                <span
                  className={`w-10 h-10 rounded-full inline-flex items-center justify-center ${act.bgClass}`}
                >
                  <Icon name={act.icon} className="text-[20px]" />
                </span>
                <span className="font-label text-label-sm text-light-on-surface">{act.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Weather & Disaster Risk Summary */}
        <section
          aria-labelledby="weather-risk-heading"
          className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-lg shadow-sm flex flex-col gap-gutter-md"
        >
          <div className="flex items-center justify-between gap-gutter-sm">
            <div>
              <h2
                id="weather-risk-heading"
                className="font-headline text-headline-sm text-light-on-surface"
              >
                Weather &amp; Risk
              </h2>
              <p className="font-label text-label-md text-light-on-surface-variant">
                Estimated local risk vs. IMD forecast
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('weather')}
              className="text-right hover:opacity-80"
            >
              <span className="font-headline text-headline-md text-light-primary tabular-nums block">
                28°C
              </span>
              <span className="font-label text-label-sm text-light-on-surface-variant block">
                Rain 85%
              </span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-gutter-sm bg-light-surface-container-low rounded p-gutter-md text-center">
            <div>
              <span className="font-label text-label-sm text-light-on-surface-variant block">
                Wind
              </span>
              <span className="font-title text-title-md text-light-on-surface tabular-nums">
                34 km/h
              </span>
            </div>
            <div>
              <span className="font-label text-label-sm text-light-on-surface-variant block">
                Humidity
              </span>
              <span className="font-title text-title-md text-light-on-surface tabular-nums">
                89%
              </span>
            </div>
            <div>
              <span className="font-label text-label-sm text-light-on-surface-variant block">
                Rainfall
              </span>
              <span className="font-title text-title-md text-light-on-surface tabular-nums">
                42 mm/hr
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-gutter-sm">
            <div className="flex items-center justify-between p-gutter-sm rounded bg-light-warning-container/60">
              <span className="font-label text-label-md text-light-on-warning-container">
                Flood Risk
              </span>
              <span className="font-label text-label-sm text-light-on-warning-container">High</span>
            </div>
            <div className="flex items-center justify-between p-gutter-sm rounded bg-light-success-container/70">
              <span className="font-label text-label-md text-light-on-success-container">
                Cyclone
              </span>
              <span className="font-label text-label-sm text-light-on-success-container">Low</span>
            </div>
            <div className="flex items-center justify-between p-gutter-sm rounded bg-light-success-container/70">
              <span className="font-label text-label-md text-light-on-success-container">
                Heatwave
              </span>
              <span className="font-label text-label-sm text-light-on-success-container">Low</span>
            </div>
            <div className="flex items-center justify-between p-gutter-sm rounded bg-light-surface-container">
              <span className="font-label text-label-md text-light-on-surface">Quake Zone</span>
              <span className="font-label text-label-sm text-light-on-surface-variant">
                Zone III
              </span>
            </div>
          </div>
        </section>

        {/* Preparedness Score Card */}
        <section
          aria-labelledby="prep-score-heading"
          className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-lg shadow-sm flex items-center gap-gutter-lg"
        >
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
                className="text-light-surface-container-high"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
                strokeDasharray="213.6"
                strokeDashoffset={preparedness.strokeDashoffset}
                strokeLinecap="round"
                className="text-light-secondary transition-all duration-300"
              />
            </svg>
            <span className="font-title text-title-md text-light-primary tabular-nums absolute">
              {preparedness.percentage}%
            </span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-gutter-xs">
            <h2 id="prep-score-heading" className="font-title text-title-md text-light-on-surface">
              Preparedness Score
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant">
              {preparedness.checkedCount} of {preparedness.totalCount} kit items ready.{' '}
              {missingSummary}
            </p>
            <button
              type="button"
              onClick={() => navigate('kit')}
              className="self-start mt-gutter-xs min-h-[36px] px-gutter-md py-gutter-xs rounded bg-light-secondary text-light-on-secondary font-label text-label-md hover:opacity-90"
            >
              Improve Preparedness
            </button>
          </div>
        </section>

        {/* Nearby Emergency Services */}
        <section aria-labelledby="nearby-services-heading" className="flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2
              id="nearby-services-heading"
              className="font-headline text-headline-sm text-light-on-surface"
            >
              Nearby Services
            </h2>
            <button
              type="button"
              onClick={() => navigate('map')}
              className="font-label text-label-lg text-light-primary hover:underline"
            >
              Open Map
            </button>
          </div>
          <div className="flex flex-col gap-gutter-sm">
            <button
              type="button"
              onClick={() => navigate('map', { shelterId: 'shelter-dadar' })}
              className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-md flex items-center justify-between gap-gutter-md hover:bg-light-surface-container-low text-left"
            >
              <div className="flex items-center gap-gutter-md min-w-0">
                <span className="w-10 h-10 rounded-full bg-light-success-container text-light-on-success-container inline-flex items-center justify-center shrink-0">
                  <Icon name="night_shelter" className="text-[20px]" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-title text-title-md text-light-on-surface">
                    BMC Dadar Relief Shelter
                  </h3>
                  <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
                    1.4 km • 180 beds available
                  </p>
                </div>
              </div>
              <Icon name="directions" className="text-[20px] text-light-outline shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => navigate('map', { shelterId: 'hospital-kem' })}
              className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-md flex items-center justify-between gap-gutter-md hover:bg-light-surface-container-low text-left"
            >
              <div className="flex items-center gap-gutter-md min-w-0">
                <span className="w-10 h-10 rounded-full bg-light-primary-container text-light-on-primary-container inline-flex items-center justify-center shrink-0">
                  <Icon name="local_hospital" className="text-[20px]" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-title text-title-md text-light-on-surface">
                    KEM Hospital Emergency
                  </h3>
                  <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
                    2.1 km • Trauma &amp; Ambulance 24/7
                  </p>
                </div>
              </div>
              <Icon name="directions" className="text-[20px] text-light-outline shrink-0" />
            </button>
          </div>
        </section>

        {/* Recent Alerts */}
        <section aria-labelledby="recent-alerts-heading" className="flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2
              id="recent-alerts-heading"
              className="font-headline text-headline-sm text-light-on-surface"
            >
              Recent Alerts
            </h2>
            <button
              type="button"
              onClick={() => navigate('alerts')}
              className="font-label text-label-lg text-light-primary hover:underline"
            >
              All Alerts
            </button>
          </div>

          <article className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-lg shadow-sm flex flex-col gap-gutter-sm">
            <div className="flex items-center justify-between gap-gutter-sm">
              <span
                role="status"
                className="inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-full bg-light-error-container text-light-on-error-container"
              >
                <span className="w-2 h-2 rounded-full bg-light-error" aria-hidden="true" />
                <span className="font-label text-label-sm">Critical • Flood</span>
              </span>
              <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
                4.2 km • 18m ago
              </span>
            </div>
            <h3 className="font-title text-title-md text-light-on-surface">
              Mithi River Water Level Advisory
            </h3>
            <p className="font-body text-body-md text-light-on-surface-variant">
              Avoid Sion–Kurla underpass. Move vehicles to elevated parking.
            </p>
            <button
              type="button"
              onClick={() => navigate('alerts')}
              className="self-start font-label text-label-lg text-light-primary hover:underline"
            >
              Read Safety Instructions
            </button>
          </article>
        </section>

        {/* Community Updates */}
        <section aria-labelledby="community-updates-heading" className="flex flex-col gap-gutter-md">
          <h2
            id="community-updates-heading"
            className="font-headline text-headline-sm text-light-on-surface"
          >
            Community Updates
          </h2>
          <article className="bg-light-surface rounded-md border border-light-outline-variant overflow-hidden shadow-sm">
            <SafeImage
              src={WATERLOGGING_IMAGE_URL}
              alt="Waterlogging near Hindmata Junction with civic safety cones"
              fallbackIcon="water"
              fallbackLabel="Hindmata Flyover"
              className="w-full h-36 object-cover"
            />
            <div className="p-gutter-lg flex flex-col gap-gutter-xs">
              <div className="flex items-center justify-between gap-gutter-sm">
                <span
                  role="status"
                  className="inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-full bg-light-success-container text-light-on-success-container"
                >
                  <span className="w-2 h-2 rounded-full bg-light-success" aria-hidden="true" />
                  <span className="font-label text-label-sm">Verified Citizen Report</span>
                </span>
                <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
                  25m ago
                </span>
              </div>
              <h3 className="font-title text-title-md text-light-on-surface">
                Ankle-deep waterlogging at Hindmata Flyover
              </h3>
              <p className="font-body text-body-md text-light-on-surface-variant">
                BMC pumping crew on site. Traffic diverted via Dr. Ambedkar Road.
              </p>
            </div>
          </article>
        </section>
      </main>

      {/* DESKTOP 12-COLUMN MAIN BODY (exact match to Home Dashboard Desktop HTML) */}
      <main className="hidden lg:grid flex-1 p-gutter-xl grid-cols-12 gap-gutter-xl items-start">
        {/* Left 8 Columns */}
        <div className="col-span-8 flex flex-col gap-gutter-xl">
          {/* Safety Status Banner */}
          <section className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-xl shadow-sm flex items-center justify-between gap-gutter-lg">
            <div className="flex items-start gap-gutter-md">
              <span className="w-12 h-12 rounded-full bg-light-warning-container text-light-on-warning-container inline-flex items-center justify-center shrink-0">
                <Icon name="warning" className="text-[26px]" filled />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-gutter-sm mb-gutter-xs">
                  <h2 className="font-headline text-headline-md text-light-on-surface">
                    Heavy Monsoon Advisory
                  </h2>
                  <span className="px-gutter-sm py-gutter-xs rounded-full bg-light-warning-container text-light-on-warning-container font-label text-label-sm">
                    Orange Warning
                  </span>
                </div>
                <p className="font-body text-body-md text-light-on-surface-variant">
                  IMD forecasts 115–204 mm rainfall over Mumbai Suburban. High tide at 17:40 IST
                  (4.4m). Avoid low-lying underpasses.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('alerts')}
              className="min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-primary text-light-on-primary font-label text-label-lg shrink-0 inline-flex items-center justify-center hover:opacity-95 whitespace-nowrap"
            >
              View Alerts
            </button>
          </section>

          {/* Weather & Risk Metrics */}
          <section className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-xl shadow-sm flex flex-col gap-gutter-md">
            <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <h2 className="font-headline text-headline-sm text-light-on-surface">
                Weather &amp; Disaster Risk
              </h2>
              <button
                type="button"
                onClick={() => navigate('weather')}
                className="font-label text-label-md text-light-primary hover:underline"
              >
                IMD Forecast + Estimated Local Risk →
              </button>
            </div>
            <div className="grid grid-cols-4 gap-gutter-md">
              <div className="p-gutter-md rounded bg-light-surface-container-low">
                <span className="font-label text-label-sm text-light-on-surface-variant block">
                  Temperature
                </span>
                <span className="font-headline text-headline-md text-light-primary tabular-nums">
                  28°C
                </span>
              </div>
              <div className="p-gutter-md rounded bg-light-surface-container-low">
                <span className="font-label text-label-sm text-light-on-surface-variant block">
                  Rainfall
                </span>
                <span className="font-headline text-headline-md text-light-primary tabular-nums">
                  42 mm/hr
                </span>
              </div>
              <div className="p-gutter-md rounded bg-light-warning-container/60">
                <span className="font-label text-label-sm text-light-on-warning-container block">
                  Flood Risk
                </span>
                <span className="font-headline text-headline-sm text-light-on-warning-container">
                  High
                </span>
              </div>
              <div className="p-gutter-md rounded bg-light-success-container/70">
                <span className="font-label text-label-sm text-light-on-success-container block">
                  Cyclone Risk
                </span>
                <span className="font-headline text-headline-sm text-light-on-success-container">
                  Low
                </span>
              </div>
            </div>
          </section>

          {/* Recent Alerts & Community Updates */}
          <div className="grid grid-cols-2 gap-gutter-xl">
            <section className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-xl shadow-sm flex flex-col gap-gutter-md">
              <h2 className="font-headline text-headline-sm text-light-on-surface">
                Critical Alert
              </h2>
              <span className="self-start px-gutter-sm py-gutter-xs rounded-full bg-light-error-container text-light-on-error-container font-label text-label-sm">
                Critical • Flood • 4.2 km
              </span>
              <h3 className="font-title text-title-md text-light-on-surface">
                Mithi River Crosses Danger Mark
              </h3>
              <p className="font-body text-body-md text-light-on-surface-variant">
                Water level at 2.9m near Kurla. Avoid Sion–Kurla underpass and move vehicles to
                elevated zones.
              </p>
              <button
                type="button"
                onClick={() => navigate('alerts')}
                className="self-start font-label text-label-lg text-light-primary hover:underline"
              >
                Open Alert Details →
              </button>
            </section>

            <section className="bg-light-surface rounded-md border border-light-outline-variant overflow-hidden shadow-sm flex flex-col">
              <SafeImage
                src={WATERLOGGING_IMAGE_URL}
                alt="Waterlogging near Hindmata Junction"
                fallbackIcon="water"
                fallbackLabel="Hindmata Flyover"
                className="w-full h-32 object-cover"
              />
              <div className="p-gutter-lg flex flex-col gap-gutter-xs flex-1 justify-between">
                <div className="flex flex-col gap-gutter-xs">
                  <span className="self-start px-gutter-sm py-gutter-xs rounded-full bg-light-success-container text-light-on-success-container font-label text-label-sm">
                    Verified Citizen Report
                  </span>
                  <h3 className="font-title text-title-md text-light-on-surface">
                    Waterlogging at Hindmata Flyover
                  </h3>
                  <p className="font-body text-body-md text-light-on-surface-variant">
                    BMC pumping crew active. Traffic diverted.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('report')}
                  className="self-start mt-gutter-xs font-label text-label-md text-light-primary hover:underline"
                >
                  Report Incident →
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Right 4 Columns */}
        <div className="col-span-4 flex flex-col gap-gutter-xl">
          {/* Preparedness Score */}
          <section className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-xl shadow-sm flex flex-col items-center text-center gap-gutter-md">
            <h2 className="font-headline text-headline-sm text-light-on-surface">
              Preparedness Score
            </h2>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="none"
                  className="text-light-surface-container-high"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray="213.6"
                  strokeDashoffset={preparedness.strokeDashoffset}
                  strokeLinecap="round"
                  className="text-light-secondary transition-all duration-300"
                />
              </svg>
              <span
                data-testid="home-prep-score"
                className="font-headline text-headline-md text-light-primary tabular-nums absolute"
              >
                {preparedness.percentage}%
              </span>
            </div>
            <p className="font-body text-body-md text-light-on-surface-variant">
              {preparedness.checkedCount} of {preparedness.totalCount} emergency kit items packed.{' '}
              {missingSummary}
            </p>
            <button
              type="button"
              onClick={() => navigate('kit')}
              className="w-full min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-secondary text-light-on-secondary font-label text-label-lg hover:opacity-95"
            >
              Improve Preparedness
            </button>
          </section>

          {/* Nearby Emergency Services */}
          <section className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-xl shadow-sm flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-headline-sm text-light-on-surface">
                Nearby Shelters &amp; ER
              </h2>
              <button
                type="button"
                onClick={() => navigate('map')}
                className="font-label text-label-md text-light-primary hover:underline"
              >
                Map
              </button>
            </div>
            <div className="flex flex-col gap-gutter-sm">
              <button
                type="button"
                onClick={() => navigate('map', { shelterId: 'shelter-dadar' })}
                className="p-gutter-md rounded bg-light-surface-container-low hover:bg-light-surface-container flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <p className="font-title text-title-md text-light-on-surface">BMC Dadar Shelter</p>
                  <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
                    1.4 km • 180 beds
                  </p>
                </div>
                <Icon name="night_shelter" className="text-light-success text-[22px]" />
              </button>
              <button
                type="button"
                onClick={() => navigate('map', { shelterId: 'hospital-kem' })}
                className="p-gutter-md rounded bg-light-surface-container-low hover:bg-light-surface-container flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <p className="font-title text-title-md text-light-on-surface">KEM Hospital</p>
                  <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
                    2.1 km • 24/7 Trauma
                  </p>
                </div>
                <Icon name="local_hospital" className="text-light-primary text-[22px]" />
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Location Selector Modal */}
      {locationModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-modal-title"
          className="fixed inset-0 z-50 bg-light-on-surface/50 flex items-end lg:items-center justify-center p-gutter-lg"
        >
          <div className="bg-light-surface rounded-lg w-full max-w-[390px] p-gutter-xl flex flex-col gap-gutter-md shadow-xl">
            <div className="flex items-center justify-between">
              <h2
                id="location-modal-title"
                className="font-headline text-headline-sm text-light-on-surface"
              >
                Select Location
              </h2>
              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                aria-label="Close location selector"
                className="w-10 h-10 rounded-full hover:bg-light-surface-container inline-flex items-center justify-center"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-gutter-sm">
              <button
                type="button"
                data-testid="home-live-gps-btn"
                disabled={gps.status === 'locating'}
                onClick={async () => {
                  const coords = await fetchLiveGps({ updateProfileLocation: true });
                  if (coords) {
                    setLocationModalOpen(false);
                  }
                }}
                className="min-h-[48px] px-gutter-md py-gutter-sm rounded bg-light-secondary text-light-on-secondary font-label text-label-lg flex items-center justify-center gap-gutter-xs hover:opacity-95 disabled:opacity-60"
              >
                <Icon
                  name={gps.status === 'locating' ? 'gps_not_fixed' : 'my_location'}
                  className={`text-[20px] ${gps.status === 'locating' ? 'animate-spin' : ''}`}
                />
                <span>
                  {gps.status === 'locating' ? 'Fetching Live GPS...' : 'Use Live GPS Location'}
                </span>
              </button>
              {gps.source === 'live' && gps.coords && (
                <p className="font-mono text-label-sm text-light-success text-center tabular-nums">
                  Last live fix: {formatCoordinatesWithAccuracy(gps.coords)}
                </p>
              )}
              {gps.status === 'error' && gps.error && (
                <p className="font-body text-body-sm text-light-error bg-light-error-container/40 rounded px-gutter-sm py-gutter-xs">
                  {gps.error}
                </p>
              )}
              {LOCATION_OPTIONS.map((opt) => {
                const selected = user.locationLabel === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      updateUser({ locationLabel: opt.label, districtState: opt.district });
                      setLocationModalOpen(false);
                      showToast(`Location updated to ${opt.label}`, 'info');
                    }}
                    className={`min-h-[44px] px-gutter-md py-gutter-sm rounded text-left ${
                      selected
                        ? 'border border-light-primary bg-light-primary-container/40 font-label text-label-lg text-light-primary'
                        : 'border border-light-outline-variant font-body text-body-md text-light-on-surface hover:bg-light-surface-container-low'
                    }`}
                  >
                    {opt.label}
                    {opt.tag ? ` (${opt.tag})` : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
