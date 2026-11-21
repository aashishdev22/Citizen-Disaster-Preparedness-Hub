import React, { useMemo } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';
import {
  estimateSnapshotSizeKb,
  getCacheFreshness,
  getCriticalWeatherRisks,
} from '../utils/weatherCache';
import { WeatherRiskLevel } from '../types';

function getRiskBadgeClasses(level: WeatherRiskLevel): string {
  if (level === 'High') {
    return 'bg-light-error-container text-light-on-error-container';
  }
  if (level === 'Moderate') {
    return 'bg-light-warning-container text-light-on-warning-container';
  }
  return 'bg-light-success-container text-light-on-success-container';
}

function getRiskBorderClasses(level: WeatherRiskLevel): string {
  if (level === 'High') return 'border-l-4 border-l-light-error';
  if (level === 'Moderate') return 'border-l-4 border-l-light-warning';
  return 'border-l-4 border-l-light-success';
}

function getRiskIconColor(level: WeatherRiskLevel): string {
  if (level === 'High') return 'text-light-error';
  if (level === 'Moderate') return 'text-light-warning';
  return 'text-light-success';
}

export function OfflineModeScreen() {
  const {
    navigate,
    preparedness,
    pendingSyncCount,
    retrySync,
    isOnline,
    cachedWeather,
    cacheLatestWeather,
    clearCachedWeather,
  } = useApp();

  const freshness = useMemo(
    () => (cachedWeather ? getCacheFreshness(cachedWeather.cachedAtIso) : null),
    [cachedWeather]
  );

  const riskSummary = useMemo(() => getCriticalWeatherRisks(cachedWeather), [cachedWeather]);
  const cacheSizeKb = useMemo(() => estimateSnapshotSizeKb(cachedWeather), [cachedWeather]);

  return (
    <AppShell showBottomNav={false}>
      {/* Offline Warning Top Strip */}
      <div
        className={`${
          isOnline
            ? 'bg-light-warning text-light-on-warning'
            : 'bg-light-error text-light-on-error'
        } px-gutter-lg py-gutter-sm flex flex-wrap items-center justify-between gap-gutter-sm`}
      >
        <div className="flex items-center gap-gutter-xs">
          <Icon name={isOnline ? 'cloud_off' : 'wifi_off'} className="text-[18px]" />
          <span className="font-label text-label-md">
            {isOnline
              ? 'Offline Mode Hub Active'
              : 'No Data Connection — Reading Cached Local Storage'}
          </span>
        </div>
        <span className="font-label text-label-sm">
          {freshness ? `Weather cached ${freshness.label}` : 'Weather not cached'}
        </span>
      </div>

      <ContextualHeader
        title="Offline Emergency Hub"
        subtitle="Cached weather risks, disaster guides, helplines & evacuation plan work without internet"
        backFallback="home"
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Offline Weather Forecast & Critical Risk Assessment Cache */}
        <section
          aria-labelledby="offline-weather-heading"
          className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md"
        >
          <div className="flex flex-wrap items-start justify-between gap-gutter-md">
            <div className="flex items-start gap-gutter-sm">
              <span className="w-10 h-10 rounded-md bg-light-primary-container text-light-primary inline-flex items-center justify-center shrink-0">
                <Icon name="thunderstorm" className="text-[22px]" />
              </span>
              <div>
                <h2
                  id="offline-weather-heading"
                  className="font-title text-title-md text-light-on-surface"
                >
                  Offline Weather &amp; Critical Risk Cache
                </h2>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  Stored locally in your browser so weather risk assessments remain readable if
                  mobile data drops.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-gutter-xs">
              <button
                type="button"
                onClick={() => cacheLatestWeather()}
                className="min-h-[40px] px-gutter-md rounded bg-light-primary text-light-on-primary font-label text-label-md inline-flex items-center gap-gutter-xs hover:opacity-95"
              >
                <Icon name="download_for_offline" className="text-[18px]" />
                {cachedWeather ? 'Update Cached Forecast' : 'Cache Latest Forecast'}
              </button>
              {cachedWeather && (
                <button
                  type="button"
                  onClick={clearCachedWeather}
                  className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface text-light-on-surface-variant font-label text-label-md hover:bg-light-surface-container-low"
                >
                  Clear Cache
                </button>
              )}
            </div>
          </div>

          {!cachedWeather ? (
            <div className="rounded-md border border-dashed border-light-outline bg-light-surface-container-low p-gutter-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-gutter-md">
              <div className="flex items-start gap-gutter-sm">
                <Icon
                  name="cloud_download"
                  className="text-[24px] text-light-on-surface-variant shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-title text-title-sm text-light-on-surface">
                    No weather forecast cached offline
                  </p>
                  <p className="font-body text-body-sm text-light-on-surface-variant mt-0.5">
                    Save the latest IMD forecast and flood/cyclone risk assessments to local storage
                    before entering low-signal zones.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => cacheLatestWeather()}
                className="min-h-[44px] px-gutter-md rounded bg-light-secondary text-light-on-secondary font-label text-label-md shrink-0 hover:opacity-95"
              >
                Save Forecast Offline
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-gutter-md">
              {/* Storage Status Strip */}
              <div className="flex flex-wrap items-center justify-between gap-gutter-sm px-gutter-md py-gutter-sm rounded bg-light-surface-container-low border border-light-outline-variant">
                <div className="flex flex-wrap items-center gap-gutter-sm">
                  <span
                    className={`px-gutter-sm py-0.5 rounded font-label text-label-sm inline-flex items-center gap-1 ${
                      freshness?.isStale
                        ? 'bg-light-warning-container text-light-on-warning-container'
                        : 'bg-light-success-container text-light-on-success-container'
                    }`}
                  >
                    <Icon name="offline_pin" className="text-[14px]" />
                    {freshness?.isStale ? 'Stale Snapshot' : 'Saved in Local Storage'}
                  </span>
                  <span className="font-label text-label-sm text-light-on-surface">
                    {cachedWeather.location}
                  </span>
                  <span className="font-label text-label-sm text-light-on-surface-variant">
                    • Saved {freshness?.formattedTime} ({freshness?.label}) • {cacheSizeKb}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('weather')}
                  className="font-label text-label-sm text-light-secondary hover:underline"
                >
                  Open Full Forecast →
                </button>
              </div>

              {/* Cached Weather Snapshot Banner */}
              <div className="bg-light-primary text-light-on-primary rounded-md p-gutter-md flex flex-col gap-gutter-sm">
                <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
                  <div>
                    <span className="font-label text-label-sm text-light-warning-container uppercase block">
                      {cachedWeather.alertLevel} • Cached Bulletin
                    </span>
                    <div className="flex items-baseline gap-gutter-sm mt-0.5">
                      <span className="font-headline text-headline-md tabular-nums">
                        {cachedWeather.temperatureC}°C
                      </span>
                      <span className="font-title text-title-sm text-light-primary-container">
                        {cachedWeather.condition}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-gutter-md text-left sm:text-right">
                    <div>
                      <span className="font-label text-label-sm text-light-primary-container block">
                        Rainfall
                      </span>
                      <span className="font-title text-title-sm tabular-nums">
                        {cachedWeather.rainfallMmHr} mm/hr
                      </span>
                    </div>
                    <div>
                      <span className="font-label text-label-sm text-light-primary-container block">
                        Wind Gusts
                      </span>
                      <span className="font-title text-title-sm tabular-nums">
                        {cachedWeather.windGustsKmh} km/h
                      </span>
                    </div>
                    <div>
                      <span className="font-label text-label-sm text-light-primary-container block">
                        Humidity
                      </span>
                      <span className="font-title text-title-sm tabular-nums">
                        {cachedWeather.humidityPct}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-label text-label-sm text-light-warning-container pt-gutter-xs border-t border-light-on-primary/15 flex items-center gap-1.5">
                  <Icon name="waves" className="text-[16px] shrink-0" />
                  <span>{cachedWeather.highTideNote}</span>
                </p>
              </div>

              {/* Critical Weather Risk Assessments (Readable Offline) */}
              <div className="flex flex-col gap-gutter-sm">
                <div className="flex items-center justify-between gap-gutter-sm">
                  <h3 className="font-title text-title-sm text-light-on-surface">
                    Cached Critical Risk Assessments
                  </h3>
                  <span className="font-label text-label-sm text-light-error tabular-nums">
                    {riskSummary.elevatedCount} Elevated Risks
                  </span>
                </div>

                <div className="flex flex-col gap-gutter-sm">
                  {riskSummary.orderedRisks.map((risk) => (
                    <article
                      key={risk.id}
                      className={`bg-light-surface border border-light-outline-variant ${getRiskBorderClasses(
                        risk.level
                      )} rounded-md p-gutter-md flex flex-col gap-gutter-xs`}
                    >
                      <div className="flex items-start justify-between gap-gutter-sm">
                        <div className="flex items-center gap-gutter-sm">
                          <Icon
                            name={risk.icon}
                            className={`text-[20px] shrink-0 ${getRiskIconColor(risk.level)}`}
                          />
                          <h4 className="font-title text-title-sm text-light-on-surface">
                            {risk.title}
                          </h4>
                        </div>
                        <span
                          className={`px-gutter-sm py-0.5 rounded font-label text-label-sm shrink-0 ${getRiskBadgeClasses(
                            risk.level
                          )}`}
                        >
                          {risk.level} Risk
                        </span>
                      </div>
                      <p className="font-body text-body-sm text-light-on-surface-variant">
                        {risk.detail}
                      </p>
                      <p className="font-label text-label-sm text-light-primary">
                        Action: {risk.actionTip}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              {/* Compact Cached Hourly Strip */}
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-label text-label-md text-light-on-surface-variant">
                  Cached Next-Hours Rain Forecast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-gutter-xs">
                  {cachedWeather.hourly.map((slot) => (
                    <div
                      key={slot.time}
                      className="rounded border border-light-outline-variant bg-light-surface-container-low px-gutter-sm py-gutter-xs flex items-center sm:flex-col justify-between sm:justify-center gap-1 text-center"
                    >
                      <span className="font-label text-label-sm text-light-on-surface-variant">
                        {slot.time}
                      </span>
                      <span className="font-title text-title-sm text-light-on-surface tabular-nums">
                        {slot.temp}
                      </span>
                      <span
                        className={`font-label text-label-sm ${
                          slot.pop.startsWith('100') ? 'text-light-error' : 'text-light-secondary'
                        }`}
                      >
                        {slot.pop}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Offline Capabilities Card */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between gap-gutter-sm">
            <h2 className="font-title text-title-md text-light-on-surface">
              Available Offline Now
            </h2>
            <span className="px-gutter-sm py-0.5 rounded bg-light-success-container text-light-on-success-container font-label text-label-sm">
              42 MB Cached
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-sm">
            <button
              type="button"
              onClick={() => navigate('safety')}
              className="min-h-[60px] p-gutter-md rounded bg-light-surface-container-low hover:bg-light-surface-container flex items-center justify-between gap-gutter-md text-left transition-colors"
            >
              <div className="flex items-center gap-gutter-md">
                <Icon name="menu_book" className="text-[22px] text-light-secondary shrink-0" />
                <div>
                  <span className="font-title text-title-sm text-light-on-surface block">
                    5 Downloaded Disaster Guides
                  </span>
                  <span className="font-body text-body-sm text-light-on-surface-variant">
                    Flood, Earthquake, Fire, Cyclone, First Aid
                  </span>
                </div>
              </div>
              <Icon name="chevron_right" className="text-[20px] text-light-on-surface-variant" />
            </button>

            <button
              type="button"
              onClick={() => navigate('contacts')}
              className="min-h-[60px] p-gutter-md rounded bg-light-surface-container-low hover:bg-light-surface-container flex items-center justify-between gap-gutter-md text-left transition-colors"
            >
              <div className="flex items-center gap-gutter-md">
                <Icon name="call" className="text-[22px] text-light-error shrink-0" />
                <div>
                  <span className="font-title text-title-sm text-light-on-surface block">
                    112 &amp; Personal Contacts
                  </span>
                  <span className="font-body text-body-sm text-light-on-surface-variant">
                    Direct cellular dial &amp; SMS ready
                  </span>
                </div>
              </div>
              <Icon name="chevron_right" className="text-[20px] text-light-on-surface-variant" />
            </button>

            <button
              type="button"
              onClick={() => navigate('evacuation')}
              className="min-h-[60px] p-gutter-md rounded bg-light-surface-container-low hover:bg-light-surface-container flex items-center justify-between gap-gutter-md text-left transition-colors"
            >
              <div className="flex items-center gap-gutter-md">
                <Icon name="alt_route" className="text-[22px] text-light-primary shrink-0" />
                <div>
                  <span className="font-title text-title-sm text-light-on-surface block">
                    Saved Family Evacuation Plan
                  </span>
                  <span className="font-body text-body-sm text-light-on-surface-variant">
                    Dadar West → BMC Relief Shelter
                  </span>
                </div>
              </div>
              <Icon name="chevron_right" className="text-[20px] text-light-on-surface-variant" />
            </button>

            <button
              type="button"
              onClick={() => navigate('kit')}
              className="min-h-[60px] p-gutter-md rounded bg-light-surface-container-low hover:bg-light-surface-container flex items-center justify-between gap-gutter-md text-left transition-colors"
            >
              <div className="flex items-center gap-gutter-md">
                <Icon name="checklist" className="text-[22px] text-light-success shrink-0" />
                <div>
                  <span className="font-title text-title-sm text-light-on-surface block">
                    Emergency Kit Checklist ({preparedness.percentage}%)
                  </span>
                  <span className="font-body text-body-sm text-light-on-surface-variant">
                    Editable offline • Syncs automatically
                  </span>
                </div>
              </div>
              <Icon name="chevron_right" className="text-[20px] text-light-on-surface-variant" />
            </button>
          </div>
        </section>

        {/* Queued Sync Card */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between gap-gutter-sm">
            <h2 className="font-title text-title-md text-light-on-surface">Pending Sync Queue</h2>
            <span className="px-gutter-sm py-0.5 rounded bg-light-warning-container text-light-on-warning-container font-label text-label-sm tabular-nums">
              {pendingSyncCount} Pending
            </span>
          </div>
          <p className="font-body text-body-sm text-light-on-surface-variant">
            1 Incident Report draft (#INC-MH-4092) will upload automatically as soon as mobile data or
            Wi-Fi reconnects.
          </p>
          <button
            type="button"
            onClick={retrySync}
            className="min-h-[44px] w-full sm:w-auto sm:self-start px-gutter-lg rounded bg-light-primary text-light-on-primary font-label text-label-md inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
          >
            <Icon name="sync" className="text-[18px]" />
            Retry Sync Now
          </button>
        </section>
      </main>
    </AppShell>
  );
}
