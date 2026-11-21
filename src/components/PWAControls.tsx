import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../state/AppContext';
import { getInstallActionMode } from '../utils/pwa';
import { Icon } from './Shell';

export function PWAInstallButton({
  variant = 'sidebar',
  showFallbackInSettings = false,
}: {
  variant?: 'sidebar' | 'card';
  showFallbackInSettings?: boolean;
}) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { showToast } = useApp();
  const [showGuideModal, setShowGuideModal] = useState(false);

  const mode = getInstallActionMode({ isInstalled, isInstallable, isIOS });

  if (mode === 'hidden') {
    return null;
  }

  if (mode === 'native-prompt') {
    const handleInstall = async () => {
      const accepted = await install();
      if (accepted) {
        showToast('Citizen Hub installed to your device!', 'success');
      }
    };

    return (
      <button
        type="button"
        data-testid="pwa-install-btn"
        onClick={() => void handleInstall()}
        className={
          variant === 'sidebar'
            ? 'w-full min-h-[42px] px-gutter-md py-gutter-sm rounded bg-light-secondary text-light-on-secondary font-label text-label-md inline-flex items-center justify-center gap-gutter-xs hover:opacity-95 transition-opacity'
            : 'min-h-[44px] px-gutter-lg py-gutter-sm rounded bg-light-primary text-light-on-primary font-label text-label-lg inline-flex items-center justify-center gap-gutter-xs hover:opacity-95 transition-opacity'
        }
      >
        <Icon name="install_mobile" className="text-[20px]" />
        <span>Install App</span>
      </button>
    );
  }

  if (mode === 'ios-guide' || showFallbackInSettings) {
    const label = mode === 'ios-guide' ? 'Install on iOS' : 'Install / Build APK';
    return (
      <>
        <button
          type="button"
          data-testid="pwa-install-guide-btn"
          onClick={() => setShowGuideModal(true)}
          className={
            variant === 'sidebar'
              ? 'w-full min-h-[40px] px-gutter-md py-gutter-xs rounded border border-light-on-primary/25 text-light-on-primary font-label text-label-sm inline-flex items-center justify-center gap-gutter-xs hover:bg-light-on-primary/10 transition-colors'
              : 'min-h-[44px] px-gutter-lg py-gutter-sm rounded border border-light-primary text-light-primary font-label text-label-lg inline-flex items-center justify-center gap-gutter-xs hover:bg-light-primary-container/30 transition-colors'
          }
        >
          <Icon name={mode === 'ios-guide' ? 'ios_share' : 'install_mobile'} className="text-[18px]" />
          <span>{label}</span>
        </button>

        {showGuideModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-guide-title"
            className="fixed inset-0 z-[70] bg-light-on-surface/55 flex items-end sm:items-center justify-center p-gutter-lg"
          >
            <div className="w-full max-w-md rounded-lg bg-light-surface border border-light-outline-variant p-gutter-xl shadow-xl flex flex-col gap-gutter-md text-left text-light-on-surface">
              <div className="flex items-center justify-between gap-gutter-sm">
                <h3 id="pwa-guide-title" className="font-headline text-headline-sm text-light-on-surface">
                  {mode === 'ios-guide' ? 'Install on iPhone / iPad' : 'Install App or Package APK'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  aria-label="Close install instructions"
                  className="w-9 h-9 rounded-full hover:bg-light-surface-container inline-flex items-center justify-center"
                >
                  <Icon name="close" className="text-[20px]" />
                </button>
              </div>

              {mode === 'ios-guide' ? (
                <ol className="flex flex-col gap-gutter-sm font-body text-body-md text-light-on-surface-variant list-decimal pl-5">
                  <li>
                    Tap the <strong className="text-light-on-surface">Share</strong> button in Safari&apos;s toolbar.
                  </li>
                  <li>
                    Scroll down and tap <strong className="text-light-on-surface">Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong className="text-light-on-surface">Add</strong> to launch Citizen Hub full-screen with offline caching.
                  </li>
                </ol>
              ) : (
                <div className="flex flex-col gap-gutter-md font-body text-body-sm text-light-on-surface-variant">
                  <div className="p-gutter-md rounded bg-light-surface-container-low border border-light-outline-variant">
                    <p className="font-title text-title-sm text-light-on-surface mb-1">
                      1. Install Directly on Android (Chrome)
                    </p>
                    <p>
                      Open the deployed app URL in Chrome on your phone, tap the menu (<strong>⋮</strong>), and choose{' '}
                      <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                    </p>
                  </div>
                  <div className="p-gutter-md rounded bg-light-surface-container-low border border-light-outline-variant">
                    <p className="font-title text-title-sm text-light-on-surface mb-1">
                      2. Generate Android APK via PWABuilder
                    </p>
                    <p>
                      Manifest, 192px/512px/maskable PNG icons, and offline service worker are configured. Paste your shared app URL at{' '}
                      <strong className="text-light-primary">pwabuilder.com</strong> to download an Android APK/AAB package.
                    </p>
                  </div>
                  <div className="p-gutter-md rounded bg-light-surface-container-low border border-light-outline-variant">
                    <p className="font-title text-title-sm text-light-on-surface mb-1">
                      3. Capacitor + Android Studio
                    </p>
                    <p className="font-mono text-mono-sm text-light-on-surface mt-1">
                      npm run build &amp;&amp; npx cap add android
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="min-h-[44px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

export function OfflineIndicator() {
  const { isOnline, navigate } = useApp();

  if (isOnline) return null;

  return (
    <button
      type="button"
      data-testid="pwa-offline-indicator"
      onClick={() => navigate('offline')}
      className="fixed bottom-20 lg:bottom-4 left-4 lg:left-[272px] z-50 flex items-center gap-gutter-xs rounded-md bg-light-warning text-light-on-warning px-gutter-md py-gutter-xs shadow-lg font-label text-label-sm hover:opacity-95"
    >
      <span className="h-2 w-2 rounded-full bg-light-on-warning animate-pulse" aria-hidden="true" />
      <span>Offline Mode — Using cached data</span>
    </button>
  );
}
