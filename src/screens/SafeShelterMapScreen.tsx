import React, { useMemo, useState } from 'react';
import { AppShell, Icon, SafeImage } from '../components/Shell';
import { useApp } from '../state/AppContext';
import { filterShelters } from '../utils/preparedness';
import { formatCoordinates, formatCoordinatesWithAccuracy } from '../utils/gps';
import { ShelterItem, ShelterType } from '../types';

function shelterColors(type: ShelterType) {
  switch (type) {
    case 'shelter':
      return {
        pin: 'bg-light-success text-light-on-success',
        badge: 'bg-light-success-container text-light-on-success-container',
        dot: 'bg-light-success',
        text: 'text-light-success',
        border: 'border-light-success',
      };
    case 'hospital':
      return {
        pin: 'bg-light-primary text-light-on-primary',
        badge: 'bg-light-primary-container text-light-on-primary-container',
        dot: 'bg-light-primary',
        text: 'text-light-primary',
        border: 'border-light-primary',
      };
    default:
      return {
        pin: 'bg-light-error text-light-on-error',
        badge: 'bg-light-error-container text-light-on-error-container',
        dot: 'bg-light-error',
        text: 'text-light-error',
        border: 'border-light-error',
      };
  }
}

export function SafeShelterMapScreen() {
  const {
    shelters,
    selectedShelterId,
    setSelectedShelterId,
    navigate,
    user,
    showToast,
    gps,
    fetchLiveGps,
  } = useApp();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ShelterType | 'all'>('all');

  const livePinLabel =
    gps.source === 'live' && gps.coords
      ? `You (${formatCoordinates(gps.coords.latitude, gps.coords.longitude)})`
      : `You (${user.locationLabel.split(',')[0]})`;

  const filtered = useMemo(
    () => filterShelters(shelters, query, typeFilter),
    [shelters, query, typeFilter]
  );

  const selected: ShelterItem =
    filtered.find((s) => s.id === selectedShelterId) ?? filtered[0] ?? shelters[0];

  const selectedStyle = shelterColors(selected.type);

  const filterButtons: { id: ShelterType | 'all'; label: string }[] = [
    { id: 'all', label: `All (${shelters.length})` },
    { id: 'shelter', label: 'Shelters (2)' },
    { id: 'hospital', label: 'Hospitals (1)' },
    { id: 'emergency', label: 'Police & Fire (1)' },
  ];

  const renderMapCanvas = (heightClass: string) => (
    <div
      className={`relative ${heightClass} bg-light-surface-container overflow-hidden border-b lg:border-b-0 border-light-outline-variant`}
    >
      <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
        <rect width="800" height="560" fill="#E8EEF5" />
        <path d="M0 0 L140 0 L110 280 L150 560 L0 560 Z" fill="#CFE4F7" />
        <path d="M135 100 L800 85" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M115 280 L800 300" stroke="#FFFFFF" strokeWidth="14" />
        <path d="M360 0 L385 560" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M580 0 L560 560" stroke="#FFFFFF" strokeWidth="10" />
        {/* Dynamic Safe Evacuation Route from User (47%, 51%) to selected shelter */}
        <path
          d={`M376 286 L376 ${Math.round((selected.mapY / 100) * 560)} L${Math.round(
            (selected.mapX / 100) * 800
          )} ${Math.round((selected.mapY / 100) * 560)}`}
          stroke="#006E2D"
          strokeWidth="5"
          strokeDasharray="10 6"
          fill="none"
        />
        {/* Flood Risk Zone */}
        <ellipse
          cx="640"
          cy="400"
          rx="90"
          ry="60"
          fill="#F59E0B"
          fillOpacity="0.22"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      </svg>

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-light-surface/95 rounded border border-light-outline-variant p-gutter-sm lg:p-gutter-md flex flex-col lg:flex-row lg:flex-wrap gap-gutter-xs lg:gap-gutter-md shadow-sm">
        <span className="flex items-center gap-gutter-xs font-label text-label-sm text-light-on-surface">
          <span className="w-2.5 h-2.5 rounded-full bg-light-success" />
          Shelters
        </span>
        <span className="flex items-center gap-gutter-xs font-label text-label-sm text-light-on-surface">
          <span className="w-2.5 h-2.5 rounded-full bg-light-primary" />
          Hospitals
        </span>
        <span className="flex items-center gap-gutter-xs font-label text-label-sm text-light-on-surface">
          <span className="w-2.5 h-2.5 rounded-full bg-light-error" />
          Emergency
        </span>
        <span className="flex items-center gap-gutter-xs font-label text-label-sm text-light-on-surface">
          <span className="w-2.5 h-2.5 rounded-full bg-warning-orange" />
          Flood Risk Zone
        </span>
      </div>

      {/* User GPS Pin */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
        style={{ left: '47%', top: '51%' }}
      >
        <span
          className={`w-5 h-5 rounded-full border-2 border-light-surface shadow-md ${
            gps.source === 'live' ? 'bg-light-success ring-4 ring-light-success/25' : 'bg-light-primary'
          }`}
        />
        <span
          data-testid="map-user-pin-label"
          className="font-label text-label-sm bg-light-primary text-light-on-primary px-gutter-xs rounded mt-0.5 whitespace-nowrap"
        >
          {livePinLabel}
        </span>
      </div>

      {/* Live GPS Locate Me Control */}
      <button
        type="button"
        data-testid="map-locate-gps-btn"
        disabled={gps.status === 'locating'}
        onClick={() => void fetchLiveGps({ updateProfileLocation: true })}
        aria-label="Fetch live GPS location"
        className="absolute bottom-3 right-3 z-20 min-h-[40px] px-gutter-md py-gutter-xs rounded-full bg-light-surface border border-light-outline-variant shadow-md text-light-primary font-label text-label-sm inline-flex items-center gap-gutter-xs hover:bg-light-surface-container-low disabled:opacity-60"
      >
        <Icon
          name={gps.status === 'locating' ? 'gps_not_fixed' : 'my_location'}
          className={`text-[18px] text-light-secondary ${gps.status === 'locating' ? 'animate-spin' : ''}`}
        />
        <span>{gps.status === 'locating' ? 'Locating...' : 'Locate Me'}</span>
      </button>

      {/* Interactive Shelter / Hospital / Fire Markers */}
      {filtered.map((item) => {
        const col = shelterColors(item.type);
        const active = item.id === selected.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedShelterId(item.id)}
            aria-label={`Select ${item.name}`}
            aria-pressed={active}
            style={{ left: `${item.mapX}%`, top: `${item.mapY}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full shadow-md border-2 border-light-surface inline-flex items-center justify-center transition-transform ${
              col.pin
            } ${active ? 'scale-115 ring-4 ring-light-primary/30 z-10' : 'hover:scale-105'}`}
          >
            <Icon name={item.icon} className="text-[20px]" />
          </button>
        );
      })}
    </div>
  );

  return (
    <AppShell showBottomNav showFloatingSos>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-light-primary text-light-on-primary px-gutter-lg py-gutter-md flex items-center justify-between gap-gutter-sm">
        <div className="flex items-center gap-gutter-md min-w-0">
          <SafeImage
            src={user.avatarUrl}
            alt={user.name}
            fallbackIcon="person"
            className="w-10 h-10 rounded-full object-cover border-2 border-light-primary-container shrink-0"
          />
          <div className="min-w-0">
            <p className="font-label text-label-md text-light-primary-container">
              Safe Shelter &amp; Services
            </p>
            <p className="font-title text-title-md text-light-on-primary truncate">
              {gps.source === 'live' && gps.coords
                ? formatCoordinatesWithAccuracy(gps.coords)
                : `${user.locationLabel.split(',')[0]} • 5 km radius`}
            </p>
          </div>
        </div>

        {/* Map / List Toggle */}
        <div className="flex items-center bg-light-on-primary/15 rounded-full p-gutter-xs shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-gutter-md py-gutter-xs rounded-full font-label text-label-sm ${
              viewMode === 'map'
                ? 'bg-light-surface text-light-primary'
                : 'text-light-on-primary'
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-gutter-md py-gutter-xs rounded-full font-label text-label-sm ${
              viewMode === 'list'
                ? 'bg-light-surface text-light-primary'
                : 'text-light-on-primary'
            }`}
          >
            List
          </button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex min-h-16 bg-light-surface border-b border-light-outline-variant px-gutter-xl py-gutter-sm items-center justify-between gap-gutter-md sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-headline-sm text-light-on-surface">
            Safe Shelter &amp; Emergency Map
          </h1>
          <p className="font-label text-label-md text-light-on-surface-variant tabular-nums">
            {gps.source === 'live' && gps.coords
              ? `${gps.localityLabel || user.locationLabel} • Live GPS ${formatCoordinatesWithAccuracy(gps.coords)}`
              : `${user.locationLabel} • 5 km Evacuation Radius`}
          </p>
        </div>
        <div className="flex items-center gap-gutter-md">
          <button
            type="button"
            onClick={() => navigate('evacuation')}
            className="min-h-[44px] px-gutter-lg py-gutter-sm rounded border border-light-outline-variant text-light-primary font-label text-label-lg inline-flex items-center hover:bg-light-surface-container-low"
          >
            Evacuation Planner
          </button>
          <button
            type="button"
            onClick={() => navigate('sos')}
            className="min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-error text-light-on-error font-label text-label-lg inline-flex items-center gap-gutter-xs shadow-sm"
          >
            <Icon name="sos" className="text-[20px]" />
            <span>Emergency SOS (112)</span>
          </button>
        </div>
      </header>

      {/* MOBILE BODY */}
      <main className="lg:hidden flex-1 flex flex-col">
        {/* Search & Filter Bar */}
        <div className="px-gutter-lg py-gutter-md bg-light-surface border-b border-light-outline-variant flex flex-col gap-gutter-sm">
          <div className="relative flex items-center">
            <Icon
              name="search"
              className="text-[20px] text-light-outline absolute left-3 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search shelters, hospitals, wards"
              placeholder="Search shelters, hospitals, wards..."
              className="min-h-[44px] w-full pl-10 pr-gutter-md py-gutter-sm rounded border border-light-outline-variant bg-light-surface-container-low text-body-md text-light-on-surface placeholder:text-light-outline focus:border-light-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
            />
          </div>
          <div className="flex items-center gap-gutter-sm overflow-x-auto">
            {filterButtons.map((fb) => {
              const active = typeFilter === fb.id;
              return (
                <button
                  key={fb.id}
                  type="button"
                  onClick={() => setTypeFilter(fb.id)}
                  className={`min-h-[34px] px-gutter-md py-gutter-xs rounded-full font-label text-label-sm shrink-0 ${
                    active
                      ? 'bg-light-secondary text-light-on-secondary'
                      : 'bg-light-surface border border-light-outline-variant text-light-on-surface'
                  }`}
                >
                  {fb.label}
                </button>
              );
            })}
          </div>
        </div>

        {viewMode === 'map' ? (
          <section aria-label="Interactive Emergency Map" className="flex-1 flex flex-col">
            {renderMapCanvas('h-[360px]')}

            {/* Selected Shelter Bottom Sheet Card */}
            <div className="p-gutter-lg bg-light-surface flex flex-col gap-gutter-md">
              <div>
                <span
                  role="status"
                  className={`inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-full mb-gutter-xs ${selectedStyle.badge}`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedStyle.dot}`} aria-hidden="true" />
                  <span className="font-label text-label-sm">{selected.badgeText}</span>
                </span>
                <h2 className="font-title text-title-md text-light-on-surface">{selected.name}</h2>
                <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
                  {selected.distance} • {selected.driveTime} • Safe Route Highlighted
                </p>
              </div>

              <p className="font-body text-body-md text-light-on-surface-variant">
                {selected.facilities}
              </p>

              <div className="grid grid-cols-2 gap-gutter-sm">
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Turn-by-turn safe route started to ${selected.name} avoiding Hindmata waterlogging.`,
                      'success'
                    )
                  }
                  className="min-h-[44px] px-gutter-md py-gutter-sm rounded bg-light-primary text-light-on-primary font-label text-label-lg inline-flex items-center justify-center gap-gutter-xs"
                >
                  <Icon name="directions" className="text-[18px]" />
                  <span>Navigate</span>
                </button>
                <a
                  href={`tel:${selected.phone.replace(/\s+/g, '')}`}
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(`Calling ${selected.name} (${selected.phone})...`, 'info');
                  }}
                  className="min-h-[44px] px-gutter-md py-gutter-sm rounded border border-light-outline-variant text-light-primary font-label text-label-lg inline-flex items-center justify-center gap-gutter-xs"
                >
                  <Icon name="call" className="text-[18px]" />
                  <span>Call Shelter</span>
                </a>
              </div>
            </div>
          </section>
        ) : (
          <section className="px-gutter-lg py-gutter-lg flex flex-col gap-gutter-md">
            {filtered.map((item) => {
              const col = shelterColors(item.type);
              return (
                <article
                  key={item.id}
                  className="bg-light-surface rounded-md border border-light-outline-variant p-gutter-lg flex flex-col gap-gutter-sm"
                >
                  <div className="flex items-center justify-between gap-gutter-sm">
                    <h2 className="font-title text-title-md text-light-on-surface">{item.name}</h2>
                    <span className={`font-label text-label-sm shrink-0 ${col.text}`}>
                      {item.badgeText}
                    </span>
                  </div>
                  <p className="font-body text-body-md text-light-on-surface-variant">
                    {item.distance} • {item.address}
                  </p>
                  <div className="flex items-center gap-gutter-sm pt-gutter-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedShelterId(item.id);
                        setViewMode('map');
                      }}
                      className="min-h-[38px] px-gutter-md rounded bg-light-primary text-light-on-primary font-label text-label-md"
                    >
                      Show on Map
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      {/* DESKTOP 4+8 SPLIT BODY */}
      <main className="hidden lg:grid flex-1 p-gutter-xl grid-cols-12 gap-gutter-xl items-start">
        {/* Left 4 Columns: Search & Shelter List */}
        <div className="col-span-4 flex flex-col gap-gutter-md">
          <div className="relative flex items-center">
            <Icon
              name="search"
              className="text-[20px] text-light-outline absolute left-3 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search shelters and hospitals"
              placeholder="Search shelters, hospitals..."
              className="min-h-[44px] w-full pl-10 pr-gutter-md py-gutter-sm rounded border border-light-outline-variant bg-light-surface text-body-md focus:border-light-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-gutter-xs">
            {filterButtons.map((fb) => (
              <button
                key={fb.id}
                type="button"
                onClick={() => setTypeFilter(fb.id)}
                className={`min-h-[34px] px-gutter-md py-gutter-xs rounded-full font-label text-label-sm ${
                  typeFilter === fb.id
                    ? 'bg-light-secondary text-light-on-secondary'
                    : 'bg-light-surface border border-light-outline-variant text-light-on-surface'
                }`}
              >
                {fb.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-gutter-md">
            {filtered.map((item) => {
              const col = shelterColors(item.type);
              const isSelected = item.id === selected.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedShelterId(item.id)}
                  className={`bg-light-surface rounded-md p-gutter-md shadow-sm flex flex-col gap-gutter-xs text-left transition-colors ${
                    isSelected
                      ? `border-2 ${col.border}`
                      : 'border border-light-outline-variant hover:bg-light-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between w-full gap-gutter-sm">
                    <span
                      className={`px-gutter-sm py-0.5 rounded-full font-label text-label-sm ${col.badge}`}
                    >
                      {item.badgeText}
                    </span>
                    <span className="font-label text-label-sm tabular-nums text-light-on-surface-variant">
                      {item.distance} • {item.driveTime.replace(' drive', '')}
                    </span>
                  </div>
                  <h2 className="font-title text-title-md text-light-on-surface">{item.name}</h2>
                  <p className="font-body text-body-md text-light-on-surface-variant">
                    {item.facilities}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 Columns: Interactive Map Canvas + Active Route Strip */}
        <section className="col-span-8 bg-light-surface rounded-md border border-light-outline-variant overflow-hidden shadow-sm flex flex-col">
          {renderMapCanvas('h-[480px]')}
          <div className="p-gutter-lg border-t border-light-outline-variant flex items-center justify-between gap-gutter-md">
            <div>
              <h3 className="font-title text-title-md text-light-on-surface">{selected.name}</h3>
              <p className="font-body text-body-md text-light-on-surface-variant">
                {selected.distance} • {selected.driveTime} • {selected.facilities}
              </p>
            </div>
            <div className="flex items-center gap-gutter-sm shrink-0">
              <button
                type="button"
                onClick={() =>
                  showToast(
                    `Safe route active to ${selected.name} via Gokhale Road (avoiding Hindmata).`,
                    'success'
                  )
                }
                className="min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-primary text-light-on-primary font-label text-label-lg inline-flex items-center gap-gutter-xs"
              >
                <Icon name="directions" className="text-[18px]" />
                <span>Navigate</span>
              </button>
              <a
                href={`tel:${selected.phone.replace(/\s+/g, '')}`}
                onClick={(e) => {
                  e.preventDefault();
                  showToast(`Calling ${selected.name} (${selected.phone})...`, 'info');
                }}
                className="min-h-[44px] px-gutter-md py-gutter-sm rounded border border-light-outline-variant text-light-primary font-label text-label-lg inline-flex items-center gap-gutter-xs"
              >
                <Icon name="call" className="text-[18px]" />
                <span>Call</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
