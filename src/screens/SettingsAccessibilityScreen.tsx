import React from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';
import { Language } from '../types';

export function SettingsAccessibilityScreen() {
  const { language, setLanguage, accessibility, updateAccessibility, navigate, showToast } =
    useApp();

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title="Settings & Accessibility"
        subtitle="Alerts, Permissions, Language & Display Preferences"
        backFallback="profile"
        desktopBackButton
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Alerts & Permissions */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-light-on-surface">
            Alerts &amp; Permissions
          </h2>

          <label className="min-h-[44px] flex items-center justify-between gap-gutter-md cursor-pointer">
            <div>
              <span className="font-body text-body-md text-light-on-surface block">
                Critical Disaster Siren Override
              </span>
              <span className="font-body text-body-sm text-light-on-surface-variant">
                Play red-alert tone even when phone is silent
              </span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.criticalSirenOverride}
              onChange={(e) => updateAccessibility({ criticalSirenOverride: e.target.checked })}
              className="w-5 h-5 accent-light-secondary shrink-0 cursor-pointer"
            />
          </label>

          <label className="min-h-[44px] flex items-center justify-between gap-gutter-md cursor-pointer">
            <div>
              <span className="font-body text-body-md text-light-on-surface block">
                Background GPS for SOS
              </span>
              <span className="font-body text-body-sm text-light-on-surface-variant">
                Share live coordinates automatically during active SOS
              </span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.backgroundGpsSos}
              onChange={(e) => updateAccessibility({ backgroundGpsSos: e.target.checked })}
              className="w-5 h-5 accent-light-secondary shrink-0 cursor-pointer"
            />
          </label>

          <div className="min-h-[44px] flex items-center justify-between gap-gutter-md pt-gutter-xs border-t border-light-outline-variant">
            <label htmlFor="lang-select" className="font-body text-body-md text-light-on-surface">
              App Language
            </label>
            <select
              id="lang-select"
              value={language}
              onChange={(e) => {
                const next = e.target.value as Language;
                setLanguage(next);
                showToast(
                  next === 'hi' ? 'भाषा हिन्दी पर सेट की गई।' : 'Language switched to English.',
                  'info'
                );
              }}
              className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface font-label text-label-md text-light-on-surface"
            >
              <option value="en">English (India)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </section>

        {/* Accessibility */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-light-on-surface">Accessibility</h2>

          <label className="min-h-[44px] flex items-center justify-between gap-gutter-md cursor-pointer">
            <div>
              <span className="font-body text-body-md text-light-on-surface block">
                Large Text Mode
              </span>
              <span className="font-body text-body-sm text-light-on-surface-variant">
                Increase base font size across alerts &amp; safety guides
              </span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.largeTextMode}
              onChange={(e) => updateAccessibility({ largeTextMode: e.target.checked })}
              className="w-5 h-5 accent-light-secondary shrink-0 cursor-pointer"
            />
          </label>

          <label className="min-h-[44px] flex items-center justify-between gap-gutter-md cursor-pointer">
            <div>
              <span className="font-body text-body-md text-light-on-surface block">
                High Contrast Outlines
              </span>
              <span className="font-body text-body-sm text-light-on-surface-variant">
                Add bold focus rings and crisp card borders for outdoor visibility
              </span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.highContrastOutlines}
              onChange={(e) => updateAccessibility({ highContrastOutlines: e.target.checked })}
              className="w-5 h-5 accent-light-secondary shrink-0 cursor-pointer"
            />
          </label>

          <label className="min-h-[44px] flex items-center justify-between gap-gutter-md cursor-pointer">
            <div>
              <span className="font-body text-body-md text-light-on-surface block">
                Reduced Motion
              </span>
              <span className="font-body text-body-sm text-light-on-surface-variant">
                Minimize transition animations during emergencies
              </span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.reducedMotion}
              onChange={(e) => updateAccessibility({ reducedMotion: e.target.checked })}
              className="w-5 h-5 accent-light-secondary shrink-0 cursor-pointer"
            />
          </label>
        </section>

        {/* Storage & Account */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md divide-y divide-light-outline-variant overflow-hidden">
          <button
            type="button"
            onClick={() => navigate('offline')}
            className="w-full min-h-[56px] px-gutter-lg flex items-center justify-between hover:bg-light-surface-container-low transition-colors text-left"
          >
            <span className="font-body text-body-md text-light-on-surface">
              Manage Offline Downloads
            </span>
            <span className="font-label text-label-md text-light-secondary inline-flex items-center gap-gutter-xs">
              42 MB
              <Icon name="chevron_right" className="text-[18px]" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('onboarding')}
            className="w-full min-h-[56px] px-gutter-lg flex items-center justify-between hover:bg-light-surface-container-low transition-colors text-left"
          >
            <span className="font-body text-body-md text-light-on-surface">
              Replay Welcome &amp; Onboarding Tour
            </span>
            <Icon name="chevron_right" className="text-[18px] text-light-on-surface-variant" />
          </button>

          <button
            type="button"
            onClick={() => {
              showToast('Signed out. You can sign back in or continue as guest.', 'info');
              navigate('login');
            }}
            className="w-full min-h-[56px] px-gutter-lg flex items-center justify-between hover:bg-light-error-container/40 transition-colors text-left"
          >
            <span className="font-label text-label-lg text-light-error">Sign Out</span>
            <Icon name="logout" className="text-[20px] text-light-error" />
          </button>
        </section>
      </main>
    </AppShell>
  );
}
