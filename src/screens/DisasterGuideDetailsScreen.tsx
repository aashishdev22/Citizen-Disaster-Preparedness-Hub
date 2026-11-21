import React, { useState } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';

type PhaseTab = 'before' | 'during' | 'after';

export function DisasterGuideDetailsScreen() {
  const { guides, selectedGuideId, toggleGuideBookmark, navigate, showToast } = useApp();
  const [phase, setPhase] = useState<PhaseTab>('during');

  const guide = guides.find((g) => g.id === selectedGuideId) || guides[0];

  const handleBookmark = () => {
    toggleGuideBookmark(guide.id);
    showToast(
      guide.bookmarked
        ? `Removed ${guide.title} from saved guides.`
        : `Saved ${guide.title} to your bookmarks.`,
      'info'
    );
  };

  const handleShare = () => {
    showToast(`Copied verified NDMA ${guide.title} checklist summary for sharing.`, 'success');
  };

  const tabClass = (active: boolean) =>
    `min-h-[44px] rounded font-label text-label-md transition-colors ${
      active
        ? 'bg-light-primary text-light-on-primary'
        : 'text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container-low'
    }`;

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title={`${guide.title} Guide`}
        subtitle={
          guide.downloaded ? 'Downloaded for Offline Use' : 'NDMA Official Action Protocol'
        }
        subtitleClass={guide.downloaded ? 'text-light-success' : 'text-light-on-surface-variant'}
        backFallback="safety"
        desktopBackButton
        rightSlot={
          <div className="flex items-center gap-gutter-xs">
            <button
              type="button"
              onClick={handleBookmark}
              aria-label="Bookmark guide"
              aria-pressed={guide.bookmarked}
              className="w-11 h-11 rounded-full hover:bg-light-surface-container-low inline-flex items-center justify-center text-light-primary"
            >
              <Icon name="bookmark" className="text-[22px]" filled={guide.bookmarked} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share guide"
              className="w-11 h-11 rounded-full hover:bg-light-surface-container-low inline-flex items-center justify-center text-light-primary"
            >
              <Icon name="share" className="text-[22px]" />
            </button>
          </div>
        }
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Guide Selector Pills on Desktop/Tablet for quick switching */}
        <div className="flex items-center gap-gutter-sm bg-light-surface border border-light-outline-variant rounded-md p-gutter-md">
          <span className="w-12 h-12 rounded-md bg-light-surface-container-low inline-flex items-center justify-center shrink-0">
            <Icon name={guide.icon} className={`text-[28px] ${guide.iconColorClass}`} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-title text-title-lg text-light-on-surface">{guide.title}</h2>
            <p className="font-body text-body-sm text-light-on-surface-variant">{guide.subtitle}</p>
          </div>
          {guide.downloaded && (
            <span className="inline-flex items-center gap-1 px-gutter-sm py-1 rounded bg-light-success-container text-light-on-success-container font-label text-label-sm shrink-0">
              <Icon name="offline_pin" className="text-[16px]" />
              Offline
            </span>
          )}
        </div>

        {/* Before / During / After Tabs */}
        <div
          role="tablist"
          aria-label="Disaster Guide Phases"
          className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-xs grid grid-cols-3 gap-gutter-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={phase === 'before'}
            onClick={() => setPhase('before')}
            className={tabClass(phase === 'before')}
          >
            Before
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={phase === 'during'}
            onClick={() => setPhase('during')}
            className={tabClass(phase === 'during')}
          >
            During
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={phase === 'after'}
            onClick={() => setPhase('after')}
            className={tabClass(phase === 'after')}
          >
            After
          </button>
        </div>

        {/* BEFORE PANEL */}
        {phase === 'before' && (
          <section className="flex flex-col gap-gutter-md">
            <div className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
              <h3 className="font-title text-title-md text-light-on-surface">
                Prepare Before {guide.title} Strikes
              </h3>
              <ol className="flex flex-col gap-gutter-md">
                {guide.beforeSteps.map((step, idx) => (
                  <li key={step} className="flex items-start gap-gutter-md">
                    <span className="w-7 h-7 rounded-full bg-light-primary-container text-light-primary font-label text-label-md inline-flex items-center justify-center shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="font-body text-body-md text-light-on-surface">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* DURING PANEL */}
        {phase === 'during' && (
          <section className="flex flex-col gap-gutter-md">
            <div className="bg-light-error-container border-l-4 border-light-error rounded-md p-gutter-md flex items-start gap-gutter-md">
              <Icon name="warning" className="text-[24px] text-light-error shrink-0" />
              <p className="font-label text-label-md text-light-on-error-container">
                {guide.duringWarning}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md">
              <div className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
                <h3 className="font-title text-title-md text-light-success flex items-center gap-gutter-xs">
                  <Icon name="check_circle" className="text-[20px]" />
                  Do&apos;s (Safe Actions)
                </h3>
                <ul className="flex flex-col gap-gutter-sm font-body text-body-md text-light-on-surface">
                  {guide.duringDos.map((item) => (
                    <li key={item} className="flex items-start gap-gutter-sm">
                      <span className="text-light-success font-bold" aria-hidden="true">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
                <h3 className="font-title text-title-md text-light-error flex items-center gap-gutter-xs">
                  <Icon name="cancel" className="text-[20px]" />
                  Don&apos;ts (Avoid Danger)
                </h3>
                <ul className="flex flex-col gap-gutter-sm font-body text-body-md text-light-on-surface">
                  {guide.duringDonts.map((item) => (
                    <li key={item} className="flex items-start gap-gutter-sm">
                      <span className="text-light-error font-bold" aria-hidden="true">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* AFTER PANEL */}
        {phase === 'after' && (
          <section className="flex flex-col gap-gutter-md">
            <div className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
              <h3 className="font-title text-title-md text-light-on-surface">
                Safe Recovery &amp; Re-entry
              </h3>
              <ul className="flex flex-col gap-gutter-md font-body text-body-md text-light-on-surface">
                {guide.afterSteps.map((step) => (
                  <li key={step} className="flex items-start gap-gutter-sm">
                    <Icon name="verified" className="text-[20px] text-light-secondary shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-gutter-sm flex flex-wrap gap-gutter-sm">
                <button
                  type="button"
                  onClick={() => navigate('report')}
                  className="min-h-[44px] px-gutter-md rounded bg-light-primary text-light-on-primary font-label text-label-md inline-flex items-center gap-gutter-xs hover:opacity-95"
                >
                  <Icon name="add_a_photo" className="text-[18px]" />
                  Report Hazard
                </button>
                <button
                  type="button"
                  onClick={() => navigate('kit')}
                  className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-md inline-flex items-center gap-gutter-xs hover:bg-light-surface-container-low"
                >
                  <Icon name="checklist" className="text-[18px]" />
                  Open Emergency Kit
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Emergency Helplines Footer */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
          <h3 className="font-title text-title-sm text-light-on-surface">Emergency Helplines</h3>
          <div className="grid grid-cols-3 gap-gutter-sm">
            <a
              href="tel:112"
              className="min-h-[48px] rounded bg-light-error text-light-on-error font-label text-label-md inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
            >
              <Icon name="call" className="text-[18px]" />
              112
            </a>
            <a
              href="tel:1070"
              className="min-h-[48px] rounded bg-light-primary text-light-on-primary font-label text-label-md inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
            >
              1070 SDMA
            </a>
            <a
              href="tel:108"
              className="min-h-[48px] rounded bg-light-secondary text-light-on-secondary font-label text-label-md inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
            >
              108 Med
            </a>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
