import React, { useMemo, useState } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';
import { filterGuides } from '../utils/preparedness';

export function SafetyLearningCenterScreen() {
  const { guides, navigate, preparedness } = useApp();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => filterGuides(guides, query), [guides, query]);

  return (
    <AppShell>
      <ContextualHeader
        title="Safety & Learning Center"
        subtitle="Verified NDMA & Civic Disaster Guides"
        backFallback="home"
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-6xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Search Bar */}
        <div className="relative">
          <Icon
            name="search"
            className="text-[20px] text-light-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search disaster guides (e.g. Flood, CPR, Cyclone)..."
            aria-label="Search disaster guides"
            className="w-full min-h-[48px] pl-11 pr-gutter-md rounded-md bg-light-surface border border-light-outline-variant font-body text-body-md text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:outline-none"
          />
        </div>

        {/* Featured Seasonal Guide */}
        <button
          type="button"
          onClick={() => navigate('guide-detail', { guideId: 'flood' })}
          className="w-full text-left bg-light-primary text-light-on-primary rounded-md p-gutter-lg lg:p-gutter-xl flex items-center justify-between gap-gutter-md hover:opacity-95 transition-opacity"
        >
          <div className="flex flex-col gap-gutter-xs">
            <span className="inline-flex items-center gap-gutter-xs font-label text-label-sm uppercase tracking-wide text-light-secondary-container">
              <Icon name="offline_pin" className="text-[16px]" />
              Offline Ready • Monsoon Priority
            </span>
            <h2 className="font-headline text-headline-sm lg:text-headline-md">
              Urban Flood &amp; Monsoon Safety
            </h2>
            <p className="font-body text-body-sm lg:text-body-md text-light-primary-container max-w-2xl">
              Step-by-step Do&apos;s, Don&apos;ts, electrical safety &amp; evacuation checklist.
            </p>
          </div>
          <span className="w-11 h-11 rounded-full bg-light-on-primary/15 inline-flex items-center justify-center shrink-0">
            <Icon name="arrow_forward" className="text-[22px]" />
          </span>
        </button>

        {/* Quick Links to Kit & Weather */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
          <button
            type="button"
            onClick={() => navigate('kit')}
            className="min-h-[60px] bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex items-center gap-gutter-md hover:border-light-secondary transition-colors text-left"
          >
            <span className="w-10 h-10 rounded-full bg-light-secondary-container text-light-secondary inline-flex items-center justify-center shrink-0">
              <Icon name="checklist" className="text-[22px]" />
            </span>
            <div>
              <span className="font-title text-title-sm text-light-on-surface block">
                Kit Checklist
              </span>
              <span className="font-label text-label-sm text-light-secondary tabular-nums">
                {preparedness.percentage}% Ready ({preparedness.checkedCount}/{preparedness.totalCount}{' '}
                items)
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('weather')}
            className="min-h-[60px] bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex items-center gap-gutter-md hover:border-light-warning transition-colors text-left"
          >
            <span className="w-10 h-10 rounded-full bg-light-warning-container text-light-warning inline-flex items-center justify-center shrink-0">
              <Icon name="thunderstorm" className="text-[22px]" />
            </span>
            <div>
              <span className="font-title text-title-sm text-light-on-surface block">
                Weather Risk
              </span>
              <span className="font-label text-label-sm text-light-warning">
                Orange Alert • Mumbai
              </span>
            </div>
          </button>
        </div>

        {/* 12 Disaster Categories Grid */}
        <section className="flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-light-on-surface">
              All Disaster Guides ({filtered.length})
            </h2>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Tap any card for Before / During / After steps
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-xl text-center flex flex-col items-center gap-gutter-sm">
              <Icon name="search_off" className="text-[32px] text-light-on-surface-variant" />
              <p className="font-title text-title-sm text-light-on-surface">
                No guides matched &ldquo;{query}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant font-label text-label-md text-light-primary hover:bg-light-surface-container-low"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter-md">
              {filtered.map((guide) => (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => navigate('guide-detail', { guideId: guide.id })}
                  className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex flex-col gap-gutter-sm hover:border-light-primary transition-colors text-left"
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon name={guide.icon} className={`text-[26px] ${guide.iconColorClass}`} />
                    <div className="flex items-center gap-1">
                      {guide.bookmarked && (
                        <Icon
                          name="bookmark"
                          className="text-[16px] text-light-primary"
                          filled
                        />
                      )}
                      {guide.downloaded && (
                        <Icon
                          name="offline_pin"
                          className="text-[16px] text-light-success"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-title text-title-sm text-light-on-surface">
                      {guide.title}
                    </h3>
                    <p className="font-body text-body-sm text-light-on-surface-variant">
                      {guide.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}
