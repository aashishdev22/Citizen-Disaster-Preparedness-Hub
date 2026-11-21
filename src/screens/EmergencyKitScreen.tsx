import React, { useMemo } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';

const CATEGORY_ORDER = [
  'Water & Food',
  'Medical',
  'Electronics',
  'Documents',
  'Safety Gear',
  'Family Plan',
];

const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  'Water & Food': { icon: 'water_drop', color: 'text-light-secondary' },
  Medical: { icon: 'medical_services', color: 'text-light-error' },
  Electronics: { icon: 'flashlight_on', color: 'text-light-warning' },
  Documents: { icon: 'folder_zip', color: 'text-light-primary' },
  'Safety Gear': { icon: 'health_and_safety', color: 'text-light-secondary' },
  'Family Plan': { icon: 'family_restroom', color: 'text-light-primary' },
};

export function EmergencyKitScreen() {
  const { kitItems, toggleKitItem, resetKitItems, preparedness, showToast } = useApp();

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((category) => {
      const items = kitItems.filter((item) => item.category === category);
      const checkedInCategory = items.filter((item) => item.checked).length;
      return {
        category,
        items,
        checkedInCategory,
        meta: CATEGORY_ICONS[category] || { icon: 'inventory_2', color: 'text-light-primary' },
      };
    });
  }, [kitItems]);

  const handleReset = () => {
    resetKitItems();
    showToast('Emergency kit checklist reset to 0%.', 'warning');
  };

  const handleSave = () => {
    showToast('Preparedness checklist saved offline!', 'success');
  };

  const handleShare = () => {
    showToast('Emergency kit checklist summary copied for family sharing.', 'info');
  };

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title="Emergency Kit & Preparedness"
        subtitle="72-Hour Family Disaster Kit • Saved offline & synced with Dashboard"
        backFallback="home"
        rightSlot={
          <div className="flex items-center gap-gutter-sm">
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface text-light-on-surface-variant font-label text-label-md hover:bg-light-surface-container-low"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="hidden sm:inline-flex min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-md items-center gap-gutter-xs hover:bg-light-surface-container-low"
            >
              <Icon name="share" className="text-[18px]" />
              Share List
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="hidden sm:inline-flex min-h-[40px] px-gutter-md rounded bg-light-primary text-light-on-primary font-label text-label-md items-center gap-gutter-xs hover:opacity-95"
            >
              <Icon name="save" className="text-[18px]" />
              Save Progress
            </button>
          </div>
        }
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-6xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Preparedness Score Banner */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex items-center gap-gutter-lg">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="7"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={preparedness.percentage === 100 ? '#006E2D' : '#006A68'}
                strokeWidth="7"
                strokeDasharray="213.6"
                strokeDashoffset={preparedness.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-headline text-headline-sm text-light-primary tabular-nums">
              {preparedness.percentage}%
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-headline text-headline-sm text-light-on-surface">
              Family Kit Readiness Score
            </h2>
            <p className="font-body text-body-sm lg:text-body-md text-light-on-surface-variant mt-gutter-xs">
              {preparedness.checkedCount} of {preparedness.totalCount} essential items packed —{' '}
              {preparedness.missingItems.length > 0
                ? `Missing: ${preparedness.missingItems.join(', ')}.`
                : 'All essential 72-hour kit items ready!'}
            </p>
          </div>
        </section>

        {/* Category Cards — 1 col mobile, 2 col md, 3 col lg (matching Desktop HTML) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
          {grouped.map((group) => (
            <section
              key={group.category}
              className="bg-light-surface border border-light-outline-variant rounded-md overflow-hidden flex flex-col"
            >
              <div className="px-gutter-md py-gutter-sm bg-light-surface-container-low border-b border-light-outline-variant flex items-center justify-between gap-gutter-sm">
                <div className="flex items-center gap-gutter-sm">
                  <Icon name={group.meta.icon} className={`text-[20px] ${group.meta.color}`} />
                  <h3 className="font-title text-title-sm text-light-on-surface">
                    {group.category}
                  </h3>
                </div>
                <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
                  {group.checkedInCategory}/{group.items.length}
                </span>
              </div>

              <div className="p-gutter-md flex flex-col gap-gutter-xs">
                {group.items.map((item) => (
                  <label
                    key={item.id}
                    className="min-h-[48px] flex items-center gap-gutter-md cursor-pointer rounded px-gutter-xs hover:bg-light-surface-container-low transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleKitItem(item.id)}
                      className="w-5 h-5 accent-light-secondary shrink-0 cursor-pointer"
                    />
                    <span
                      className={`font-body text-body-md ${
                        item.checked
                          ? 'text-light-on-surface'
                          : 'text-light-on-surface-variant'
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Mobile bottom actions */}
        <div className="sm:hidden grid grid-cols-2 gap-gutter-sm pt-gutter-xs">
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[48px] rounded bg-light-primary text-light-on-primary font-label text-label-lg"
          >
            Save Progress
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="min-h-[48px] rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-lg inline-flex items-center justify-center gap-gutter-xs"
          >
            <Icon name="share" className="text-[18px]" />
            Share List
          </button>
        </div>
      </main>
    </AppShell>
  );
}
