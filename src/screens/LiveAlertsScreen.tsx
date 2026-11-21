import React, { useMemo, useState } from 'react';
import { AppShell, Icon, SafeImage } from '../components/Shell';
import { useApp } from '../state/AppContext';
import { filterAlerts } from '../utils/preparedness';
import { AlertItem } from '../types';

function badgeStyle(severity: AlertItem['severity']) {
  switch (severity) {
    case 'critical':
      return {
        wrap: 'bg-light-error-container text-light-on-error-container',
        dot: 'bg-light-error',
        iconBg: 'bg-light-error-container text-light-on-error-container',
      };
    case 'warning':
      return {
        wrap: 'bg-light-warning-container text-light-on-warning-container',
        dot: 'bg-warning-orange',
        iconBg: 'bg-light-warning-container text-light-on-warning-container',
      };
    case 'advisory':
      return {
        wrap: 'bg-light-warning-container/60 text-light-on-warning-container',
        dot: 'bg-advisory-yellow',
        iconBg: 'bg-light-primary-container text-light-on-primary-container',
      };
    default:
      return {
        wrap: 'bg-light-success-container text-light-on-success-container',
        dot: 'bg-light-success',
        iconBg: 'bg-light-success-container text-light-on-success-container',
      };
  }
}

export function LiveAlertsScreen() {
  const { alerts, markAlertRead, navigate, user, showToast } = useApp();
  const [category, setCategory] = useState<string>('all');
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.id ?? '');
  const [drawerAlert, setDrawerAlert] = useState<AlertItem | null>(null);

  const filtered = useMemo(() => filterAlerts(alerts, category), [alerts, category]);
  const desktopSelected =
    filtered.find((a) => a.id === selectedAlertId) ?? filtered[0] ?? alerts[0];

  const categories = [
    { id: 'all', label: `All (${alerts.length})` },
    { id: 'critical', label: 'Critical' },
    { id: 'flood', label: 'Flood' },
    { id: 'weather', label: 'Weather' },
    { id: 'quake', label: 'Earthquake' },
  ];

  const activeCount = alerts.filter((a) => a.severity !== 'info').length;

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
              Live Disaster Alerts
            </p>
            <p className="font-title text-title-md text-light-on-primary truncate">
              Mumbai &amp; Konkan Region
            </p>
          </div>
        </div>
        <span className="font-label text-label-sm px-gutter-sm py-gutter-xs rounded-full bg-light-secondary text-light-on-secondary shrink-0">
          {activeCount} Active
        </span>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex min-h-16 bg-light-surface border-b border-light-outline-variant px-gutter-xl py-gutter-sm items-center justify-between gap-gutter-md sticky top-0 z-20">
        <div>
          <h1 className="font-headline text-headline-sm text-light-on-surface">
            Live Disaster Alerts
          </h1>
          <p className="font-label text-label-md text-light-on-surface-variant">
            Mumbai &amp; Konkan Region • Verified NDMA / IMD / BMC Feed
          </p>
        </div>
        <div className="flex items-center gap-gutter-md">
          <button
            type="button"
            onClick={() => navigate('sos')}
            className="min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-error text-light-on-error font-label text-label-lg inline-flex items-center gap-gutter-xs shadow-sm hover:opacity-95"
          >
            <Icon name="sos" className="text-[20px]" />
            <span>Emergency SOS (112)</span>
          </button>
          <button type="button" onClick={() => navigate('profile')} aria-label="User Profile">
            <SafeImage
              src={user.avatarUrl}
              alt={user.name}
              fallbackIcon="person"
              className="w-10 h-10 rounded-full object-cover border border-light-outline-variant"
            />
          </button>
        </div>
      </header>

      {/* Main Content: Responsive Mobile single-column & Desktop 7+5 Split */}
      <main className="flex-1 p-gutter-lg lg:p-gutter-xl grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg lg:gap-gutter-xl items-start">
        {/* Feed Column (Mobile full / Desktop 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-gutter-md">
          {/* Filter Chips */}
          <div
            className="flex items-center gap-gutter-sm overflow-x-auto pb-gutter-xs"
            role="tablist"
            aria-label="Filter alerts by category"
          >
            {categories.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(cat.id)}
                  className={`min-h-[36px] px-gutter-md py-gutter-xs rounded-full font-label text-label-md shrink-0 transition-colors ${
                    active
                      ? 'bg-light-primary text-light-on-primary'
                      : 'bg-light-surface border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Alert Cards */}
          <div className="flex flex-col gap-gutter-md">
            {filtered.map((alert) => {
              const style = badgeStyle(alert.severity);
              const isSelected = desktopSelected?.id === alert.id;
              return (
                <article
                  key={alert.id}
                  className={`bg-light-surface rounded-md p-gutter-lg shadow-sm flex flex-col gap-gutter-md transition-colors ${
                    isSelected
                      ? 'border border-light-outline-variant lg:border-2 lg:border-light-error'
                      : 'border border-light-outline-variant'
                  }`}
                >
                  <div className="flex items-center justify-between gap-gutter-sm">
                    <span
                      role="status"
                      className={`inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-full ${style.wrap}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} aria-hidden="true" />
                      <span className="font-label text-label-sm">{alert.severityLabel}</span>
                    </span>
                    <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
                      {alert.distanceTime}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAlertId(alert.id)}
                    className="flex items-start gap-gutter-md text-left w-full"
                  >
                    <span
                      className={`w-10 h-10 rounded-full inline-flex items-center justify-center shrink-0 ${style.iconBg}`}
                    >
                      <Icon name={alert.icon} className="text-[22px]" />
                    </span>
                    <div>
                      <h2 className="font-title text-title-md text-light-on-surface">
                        {alert.title}
                      </h2>
                      <p className="font-label text-label-md text-light-on-surface-variant">
                        {alert.area}
                      </p>
                    </div>
                  </button>

                  <p className="font-body text-body-md text-light-on-surface">{alert.summary}</p>

                  <div className="flex items-center justify-between gap-gutter-sm pt-gutter-xs border-t border-light-outline-variant">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAlertId(alert.id);
                        setDrawerAlert(alert);
                      }}
                      className={`min-h-[40px] px-gutter-md py-gutter-xs rounded font-label text-label-md ${
                        alert.severity === 'critical'
                          ? 'bg-light-error text-light-on-error'
                          : 'bg-light-primary text-light-on-primary'
                      }`}
                    >
                      {alert.severity === 'critical'
                        ? "View Guidance & Do's/Don'ts"
                        : 'Read Instructions'}
                    </button>

                    {alert.severity === 'critical' ? (
                      <button
                        type="button"
                        onClick={() => navigate('map')}
                        className="font-label text-label-md text-light-primary hover:underline"
                      >
                        Nearest Shelter
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAlertRead(alert.id)}
                        className="font-label text-label-md text-light-on-surface-variant hover:text-light-primary"
                      >
                        {alert.isRead ? 'Marked Read' : 'Mark as Read'}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Desktop Persistent Right 5-Column Detail Panel */}
        {desktopSelected && (
          <aside className="hidden lg:flex lg:col-span-5 bg-light-surface rounded-md border border-light-outline-variant p-gutter-xl shadow-sm flex-col gap-gutter-md sticky top-24">
            <div>
              <span
                className={`px-gutter-sm py-gutter-xs rounded-full font-label text-label-sm ${
                  badgeStyle(desktopSelected.severity).wrap
                }`}
              >
                {desktopSelected.severityLabel}
              </span>
              <h2 className="font-headline text-headline-sm text-light-on-surface mt-gutter-sm">
                {desktopSelected.title}
              </h2>
            </div>

            <div className="p-gutter-md rounded bg-light-surface-container-low flex flex-col gap-gutter-xs">
              <p className="font-label text-label-md">
                Source: <span className="font-normal">{desktopSelected.source}</span>
              </p>
              <p className="font-label text-label-md">
                Affected: <span className="font-normal">{desktopSelected.area}</span>
              </p>
            </div>

            <p className="font-body text-body-md text-light-on-surface">
              {desktopSelected.instructions}
            </p>

            <div className="grid grid-cols-2 gap-gutter-sm">
              <div className="p-gutter-md rounded bg-light-success-container/60">
                <h3 className="font-label text-label-md text-light-on-success-container mb-gutter-xs">
                  Do&apos;s
                </h3>
                <ul className="text-body-md text-light-on-success-container list-disc pl-4 flex flex-col gap-gutter-xs">
                  {desktopSelected.dos.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="p-gutter-md rounded bg-light-error-container/60">
                <h3 className="font-label text-label-md text-light-on-error-container mb-gutter-xs">
                  Don&apos;ts
                </h3>
                <ul className="text-body-md text-light-on-error-container list-disc pl-4 flex flex-col gap-gutter-xs">
                  {desktopSelected.donts.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-gutter-sm">
              <button
                type="button"
                onClick={() => navigate('map')}
                className="flex-1 min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-primary text-light-on-primary font-label text-label-lg inline-flex items-center justify-center hover:opacity-95"
              >
                View Evacuation Shelters
              </button>
              <button
                type="button"
                onClick={() => showToast('Alert shared via WhatsApp / SMS', 'info')}
                className="min-h-[44px] px-gutter-md py-gutter-sm rounded border border-light-outline-variant text-light-primary font-label text-label-lg hover:bg-light-surface-container-low"
              >
                Share
              </button>
            </div>
          </aside>
        )}
      </main>

      {/* Mobile Alert Detail Drawer Modal */}
      {drawerAlert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-alert-title"
          className="lg:hidden fixed inset-0 z-50 bg-light-on-surface/50 flex items-end justify-center"
        >
          <div className="bg-light-surface rounded-t-xl w-full max-w-[430px] p-gutter-xl flex flex-col gap-gutter-md max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-gutter-sm">
              <div>
                <span className="font-label text-label-sm text-light-error uppercase">
                  {drawerAlert.severityLabel}
                </span>
                <h2
                  id="drawer-alert-title"
                  className="font-headline text-headline-sm text-light-on-surface mt-gutter-xs"
                >
                  {drawerAlert.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDrawerAlert(null)}
                aria-label="Close alert details"
                className="w-10 h-10 rounded-full hover:bg-light-surface-container inline-flex items-center justify-center shrink-0"
              >
                <Icon name="close" className="text-[22px]" />
              </button>
            </div>

            <div className="bg-light-surface-container-low rounded p-gutter-md flex flex-col gap-gutter-xs">
              <p className="font-label text-label-md text-light-on-surface">
                Official Source: <span className="font-normal">{drawerAlert.source}</span>
              </p>
              <p className="font-label text-label-md text-light-on-surface">
                Affected Areas: <span className="font-normal">{drawerAlert.area}</span>
              </p>
            </div>

            <div>
              <h3 className="font-title text-title-md text-light-on-surface mb-gutter-xs">
                Immediate Safety Instructions
              </h3>
              <p className="font-body text-body-md text-light-on-surface-variant">
                {drawerAlert.instructions}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-gutter-sm">
              <div className="p-gutter-md rounded bg-light-success-container/60">
                <h4 className="font-label text-label-md text-light-on-success-container mb-gutter-xs">
                  Do&apos;s
                </h4>
                <ul className="text-body-md text-light-on-success-container list-disc pl-4 flex flex-col gap-gutter-xs">
                  {drawerAlert.dos.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="p-gutter-md rounded bg-light-error-container/60">
                <h4 className="font-label text-label-md text-light-on-error-container mb-gutter-xs">
                  Don&apos;ts
                </h4>
                <ul className="text-body-md text-light-on-error-container list-disc pl-4 flex flex-col gap-gutter-xs">
                  {drawerAlert.donts.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-gutter-sm pt-gutter-xs">
              <button
                type="button"
                onClick={() => {
                  setDrawerAlert(null);
                  navigate('map');
                }}
                className="flex-1 min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-primary text-light-on-primary font-label text-label-lg inline-flex items-center justify-center"
              >
                Evacuation Shelters
              </button>
              <button
                type="button"
                onClick={() => showToast('Alert shared via WhatsApp / SMS', 'info')}
                className="min-h-[44px] px-gutter-md py-gutter-sm rounded border border-light-outline-variant text-light-primary font-label text-label-lg"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
