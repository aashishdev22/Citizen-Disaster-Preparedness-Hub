import React, { useMemo } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { buildLatestWeatherSnapshot } from '../data/seedData';
import { useApp } from '../state/AppContext';
import { getCacheFreshness } from '../utils/weatherCache';

export function WeatherRiskScreen() {
  const { user, navigate, isOnline, cachedWeather, cacheLatestWeather } = useApp();

  const snapshot = useMemo(
    () => cachedWeather || buildLatestWeatherSnapshot(user.locationLabel),
    [cachedWeather, user.locationLabel]
  );

  const freshness = useMemo(
    () => (cachedWeather ? getCacheFreshness(cachedWeather.cachedAtIso) : null),
    [cachedWeather]
  );

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title="Weather & Risk Dashboard"
        subtitle={
          !isOnline && freshness
            ? `${snapshot.location} • Offline Cache (${freshness.formattedTime})`
            : `${snapshot.location} • Updated 14:30 IST`
        }
        backFallback="home"
        rightSlot={
          <div className="flex items-center gap-gutter-xs">
            <button
              type="button"
              onClick={() => cacheLatestWeather()}
              className="hidden sm:inline-flex min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-md items-center gap-gutter-xs hover:bg-light-surface-container-low"
            >
              <Icon name="offline_pin" className="text-[18px] text-light-success" />
              {cachedWeather ? 'Saved Offline' : 'Save Offline'}
            </button>
            <button
              type="button"
              onClick={() => navigate('alerts')}
              className="min-h-[40px] px-gutter-md rounded bg-light-warning-container text-light-on-warning-container font-label text-label-md inline-flex items-center gap-gutter-xs hover:opacity-95"
            >
              <Icon name="notifications_active" className="text-[18px]" />
              View Alerts
            </button>
          </div>
        }
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-5xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Transparency Disclaimer */}
        <div className="bg-light-primary-container text-light-on-primary-container rounded-md p-gutter-md flex items-start gap-gutter-sm">
          <Icon name="info" className="text-[18px] text-light-primary shrink-0 mt-0.5" />
          <p className="font-body text-body-sm">
            Official bulletins sourced from IMD. Disaster risk levels below are estimated from
            rainfall, tide, and terrain data{cachedWeather ? ' and cached locally for offline access.' : '.'}
          </p>
        </div>

        {/* Current Weather Hero */}
        <section className="bg-light-primary text-light-on-primary rounded-md p-gutter-xl flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between gap-gutter-md">
            <div>
              <span className="font-label text-label-md text-light-warning-container uppercase">
                {snapshot.alertLevel}
              </span>
              <div className="flex items-baseline gap-gutter-sm mt-gutter-xs">
                <span className="font-display text-display-md tabular-nums">
                  {snapshot.temperatureC}°C
                </span>
                <span className="font-title text-title-md text-light-primary-container">
                  {snapshot.condition}
                </span>
              </div>
            </div>
            <Icon
              name="thunderstorm"
              className="text-[52px] text-light-warning-container shrink-0"
            />
          </div>

          <div className="grid grid-cols-3 gap-gutter-sm pt-gutter-md border-t border-light-on-primary/15">
            <div>
              <span className="font-label text-label-sm text-light-primary-container block">
                Rainfall
              </span>
              <span className="font-title text-title-md tabular-nums">
                {snapshot.rainfallMmHr} mm/hr
              </span>
            </div>
            <div>
              <span className="font-label text-label-sm text-light-primary-container block">
                Wind Gusts
              </span>
              <span className="font-title text-title-md tabular-nums">
                {snapshot.windGustsKmh} km/h
              </span>
            </div>
            <div>
              <span className="font-label text-label-sm text-light-primary-container block">
                Humidity / AQI
              </span>
              <span className="font-title text-title-md tabular-nums">
                {snapshot.humidityPct}% • {snapshot.aqi}
              </span>
            </div>
          </div>
        </section>

        {/* Hourly Forecast */}
        <section className="flex flex-col gap-gutter-sm">
          <h2 className="font-title text-title-md text-light-on-surface">Hourly Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-gutter-sm">
            {snapshot.hourly.map((item) => (
              <div
                key={item.time}
                className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex flex-col items-center gap-gutter-xs text-center"
              >
                <span className="font-label text-label-sm text-light-on-surface-variant">
                  {item.time}
                </span>
                <Icon name={item.icon} className={`text-[24px] ${item.iconClass}`} />
                <span className="font-title text-title-sm text-light-on-surface tabular-nums">
                  {item.temp}
                </span>
                <span
                  className={`font-label text-label-sm ${
                    item.pop.startsWith('100') ? 'text-light-error' : 'text-light-secondary'
                  }`}
                >
                  {item.pop}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg">
          {/* Estimated Disaster Risks */}
          <section className="flex flex-col gap-gutter-sm">
            <h2 className="font-title text-title-md text-light-on-surface">
              Estimated Disaster Risks
            </h2>
            <div className="flex flex-col gap-gutter-sm">
              {snapshot.risks.map((risk) => {
                const iconColor =
                  risk.level === 'High'
                    ? 'text-light-error'
                    : risk.level === 'Moderate'
                      ? 'text-light-warning'
                      : 'text-light-success';
                const badgeClass =
                  risk.level === 'High'
                    ? 'bg-light-error-container text-light-on-error-container'
                    : risk.level === 'Moderate'
                      ? 'bg-light-warning-container text-light-on-warning-container'
                      : 'bg-light-success-container text-light-on-success-container';
                return (
                  <div
                    key={risk.id}
                    className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex items-center justify-between gap-gutter-md"
                  >
                    <div className="flex items-center gap-gutter-md">
                      <Icon name={risk.icon} className={`text-[24px] shrink-0 ${iconColor}`} />
                      <div>
                        <span className="font-title text-title-sm text-light-on-surface block">
                          {risk.title}
                        </span>
                        <span className="font-body text-body-sm text-light-on-surface-variant">
                          {risk.detail}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-gutter-sm py-1 rounded font-label text-label-sm shrink-0 ${badgeClass}`}
                    >
                      {risk.level}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5-Day Outlook */}
          <section className="flex flex-col gap-gutter-sm">
            <h2 className="font-title text-title-md text-light-on-surface">5-Day Monsoon Outlook</h2>
            <div className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-sm">
              {snapshot.outlook.map((row, idx) => (
                <div
                  key={row.day}
                  className={`flex items-center justify-between py-gutter-xs ${
                    idx < snapshot.outlook.length - 1
                      ? 'border-b border-light-outline-variant'
                      : ''
                  }`}
                >
                  <span className="font-label text-label-md text-light-on-surface w-20 shrink-0">
                    {row.day}
                  </span>
                  <span className="font-body text-body-sm text-light-on-surface-variant flex-1 px-gutter-sm">
                    {row.condition}
                  </span>
                  <span className="font-label text-label-md text-light-on-surface tabular-nums shrink-0">
                    {row.temp}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
