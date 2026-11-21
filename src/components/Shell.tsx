import React, { useState } from 'react';
import { ScreenId } from '../types';
import { useApp } from '../state/AppContext';

export function Icon({
  name,
  className = 'text-[20px]',
  filled = false,
  ariaLabel,
}: {
  name: string;
  className?: string;
  filled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    >
      {name}
    </span>
  );
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackIcon = 'image',
  fallbackLabel,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  fallbackLabel?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`bg-light-primary-container text-light-primary flex flex-col items-center justify-center gap-1 select-none ${className || ''}`}
        role="img"
        aria-label={alt}
      >
        <Icon name={fallbackIcon} className="text-[22px]" />
        {fallbackLabel && <span className="font-label text-label-sm">{fallbackLabel}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

const SIDEBAR_PRIMARY: { id: ScreenId; label: string; icon: string; badge?: boolean }[] = [
  { id: 'home', label: 'Home Dashboard', icon: 'dashboard' },
  { id: 'alerts', label: 'Live Alerts', icon: 'notifications_active', badge: true },
  { id: 'map', label: 'Shelters & Map', icon: 'map' },
  { id: 'sos', label: 'Emergency SOS', icon: 'sos' },
  { id: 'safety', label: 'Safety Guides', icon: 'menu_book' },
  { id: 'kit', label: 'Kit & Checklist', icon: 'checklist' },
  { id: 'family', label: 'Family Safety', icon: 'family_restroom' },
];

const SIDEBAR_SECONDARY: { id: ScreenId; label: string; icon: string }[] = [
  { id: 'weather', label: 'Weather & Risk', icon: 'thunderstorm' },
  { id: 'evacuation', label: 'Evacuation Plan', icon: 'alt_route' },
  { id: 'report', label: 'Incident Report', icon: 'add_a_photo' },
  { id: 'contacts', label: 'Emergency Contacts', icon: 'contact_phone' },
  { id: 'volunteer', label: 'Community Relief', icon: 'volunteer_activism' },
  { id: 'offline', label: 'Offline Mode', icon: 'offline_pin' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'profile', label: 'Profile & Settings', icon: 'person' },
];

export function DesktopSidebar() {
  const { screen, navigate, unreadCount } = useApp();

  const isActive = (id: ScreenId) => {
    if (id === 'safety' && screen === 'guide-detail') return true;
    if (id === 'profile' && screen === 'settings') return true;
    return screen === id;
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-light-primary text-light-on-primary min-h-screen sticky top-0 h-screen flex-col justify-between p-gutter-lg overflow-y-auto">
      <div className="flex flex-col gap-gutter-xl">
        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex items-center gap-gutter-md text-left hover:opacity-95 focus-visible:outline-2 focus-visible:outline-light-on-primary rounded"
        >
          <span className="w-10 h-10 rounded-md bg-light-secondary text-light-on-secondary inline-flex items-center justify-center shrink-0">
            <Icon name="shield_with_heart" className="text-[24px]" filled />
          </span>
          <div>
            <span className="font-title text-title-md block leading-tight">Citizen Hub</span>
            <span className="font-label text-label-sm text-light-primary-container block">
              Disaster Preparedness
            </span>
          </div>
        </button>

        {/* Primary Desktop Nav (exact order from reference Desktop HTML) */}
        <nav aria-label="Desktop Navigation" className="flex flex-col gap-gutter-xs">
          {SIDEBAR_PRIMARY.map((item) => {
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[44px] w-full px-gutter-md py-gutter-sm rounded flex items-center justify-between font-label text-label-lg transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-light-on-primary/15 text-light-on-primary'
                    : 'text-light-primary-container hover:bg-light-on-primary/10'
                }`}
              >
                <span className="flex items-center gap-gutter-md">
                  <Icon name={item.icon} className="text-[20px]" />
                  <span>{item.label}</span>
                </span>
                {item.badge && unreadCount > 0 && (
                  <span className="px-gutter-sm py-0.5 rounded-full bg-light-error text-light-on-error text-label-sm tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}

          <div className="my-gutter-sm border-t border-light-on-primary/15" />

          {SIDEBAR_SECONDARY.map((item) => {
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[40px] w-full px-gutter-md py-gutter-xs rounded flex items-center gap-gutter-md font-label text-label-md transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-light-on-primary/15 text-light-on-primary'
                    : 'text-light-primary-container/90 hover:bg-light-on-primary/10'
                }`}
              >
                <Icon name={item.icon} className="text-[18px]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Offline Readiness Footer */}
      <button
        type="button"
        onClick={() => navigate('offline')}
        className="mt-gutter-lg p-gutter-md rounded bg-light-on-primary/10 hover:bg-light-on-primary/15 flex flex-col gap-gutter-xs text-left transition-colors"
      >
        <div className="flex items-center gap-gutter-xs">
          <span className="w-2 h-2 rounded-full bg-success-green" aria-hidden="true" />
          <span className="font-label text-label-sm text-light-on-primary">Offline Pack Synced</span>
        </div>
        <span className="font-label text-label-sm text-light-primary-container">
          Guides &amp; 112 ready offline
        </span>
      </button>
    </aside>
  );
}

export function MobileBottomNav() {
  const { screen, navigate } = useApp();

  const tabs: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'alerts', label: 'Alerts', icon: 'notifications_active' },
    { id: 'safety', label: 'Safety', icon: 'health_and_safety' },
    { id: 'map', label: 'Map', icon: 'map' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav
      aria-label="Primary Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-light-surface border-t border-light-outline-variant px-gutter-sm py-gutter-xs grid grid-cols-5"
    >
      {tabs.map((tab) => {
        const active =
          screen === tab.id ||
          (tab.id === 'safety' && screen === 'guide-detail') ||
          (tab.id === 'profile' && screen === 'settings');
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.id)}
            aria-current={active ? 'page' : undefined}
            className={`min-h-[48px] flex flex-col items-center justify-center gap-gutter-xs transition-colors ${
              active
                ? 'text-light-primary'
                : 'text-light-on-surface-variant hover:text-light-primary'
            }`}
          >
            <Icon name={tab.icon} className="text-[22px]" filled={active} />
            <span className="font-label text-label-sm">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function FloatingSosButton({ hasBottomNav = true }: { hasBottomNav?: boolean }) {
  const { navigate } = useApp();
  return (
    <button
      type="button"
      onClick={() => navigate('sos')}
      aria-label="Emergency SOS"
      className={`lg:hidden fixed ${
        hasBottomNav ? 'bottom-20' : 'bottom-6'
      } right-4 z-40 w-14 h-14 rounded-full bg-light-error text-light-on-error shadow-lg hover:opacity-95 inline-flex flex-col items-center justify-center border-2 border-light-surface`}
    >
      <span className="font-label text-label-lg leading-none">SOS</span>
    </button>
  );
}

export function ContextualHeader({
  title,
  subtitle,
  subtitleClass = 'text-light-on-surface-variant',
  backFallback = 'home',
  rightSlot,
  desktopBackButton = false,
}: {
  title: string;
  subtitle?: string;
  subtitleClass?: string;
  backFallback?: ScreenId;
  rightSlot?: React.ReactNode;
  desktopBackButton?: boolean;
}) {
  const { goBack } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-light-surface border-b border-light-outline-variant px-gutter-lg lg:px-gutter-xl py-gutter-md flex items-center justify-between gap-gutter-sm">
      <div className="flex items-center gap-gutter-sm min-w-0">
        <button
          type="button"
          onClick={() => goBack(backFallback)}
          aria-label="Go Back"
          className={`${
            desktopBackButton ? 'inline-flex' : 'inline-flex lg:hidden'
          } w-11 h-11 rounded-full hover:bg-light-surface-container-low items-center justify-center text-light-on-surface shrink-0`}
        >
          <Icon name="arrow_back" className="text-[24px]" />
        </button>
        <div className="min-w-0">
          <h1 className="font-headline text-headline-sm text-light-on-surface truncate">{title}</h1>
          {subtitle && (
            <p className={`font-label text-label-sm lg:text-label-md truncate ${subtitleClass}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightSlot && <div className="flex items-center gap-gutter-sm shrink-0">{rightSlot}</div>}
    </header>
  );
}

export function ToastBanner() {
  const { toast, dismissToast } = useApp();
  if (!toast) return null;

  const variantClasses = {
    info: 'bg-light-primary text-light-on-primary',
    success: 'bg-light-success text-light-on-success',
    error: 'bg-light-error text-light-on-error',
    warning: 'bg-light-warning text-light-on-warning',
  }[toast.variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-32px)] max-w-[440px]"
    >
      <div
        className={`${variantClasses} rounded-md px-gutter-lg py-gutter-md shadow-xl flex items-center justify-between gap-gutter-md`}
      >
        <span className="font-label text-label-md">{toast.message}</span>
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="w-8 h-8 rounded-full hover:bg-white/15 inline-flex items-center justify-center shrink-0"
        >
          <Icon name="close" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}

export function AppShell({
  children,
  showBottomNav = true,
  showFloatingSos = showBottomNav,
}: {
  children: React.ReactNode;
  showBottomNav?: boolean;
  showFloatingSos?: boolean;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-light-background">
      <DesktopSidebar />
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          showBottomNav ? 'pb-24 lg:pb-0' : 'pb-10 lg:pb-0'
        }`}
      >
        {children}
      </div>
      {showFloatingSos && <FloatingSosButton hasBottomNav={showBottomNav} />}
      {showBottomNav && <MobileBottomNav />}
    </div>
  );
}
