import React, { useState } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';

export function EvacuationPlannerScreen() {
  const { evacuationPlan, updateEvacuationPlan, navigate, showToast } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [originDraft, setOriginDraft] = useState(evacuationPlan.origin);
  const [destDraft, setDestDraft] = useState(evacuationPlan.destination);
  const [meetingDraft, setMeetingDraft] = useState(evacuationPlan.meetingPoint);
  const [checklist, setChecklist] = useState({
    utilities: true,
    kit: true,
    family: false,
  });

  const openEditor = () => {
    setOriginDraft(evacuationPlan.origin);
    setDestDraft(evacuationPlan.destination);
    setMeetingDraft(evacuationPlan.meetingPoint);
    setEditOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvacuationPlan({
      origin: originDraft.trim() || evacuationPlan.origin,
      destination: destDraft.trim() || evacuationPlan.destination,
      meetingPoint: meetingDraft.trim() || evacuationPlan.meetingPoint,
    });
    setEditOpen(false);
    showToast('Evacuation plan saved & synced with Family Safety!', 'success');
  };

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title="Evacuation Planner"
        subtitle="Safe Routes & Family Meeting Point"
        backFallback="home"
        rightSlot={
          <button
            type="button"
            onClick={openEditor}
            className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-md hover:bg-light-surface-container-low"
          >
            Edit Plan
          </button>
        }
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Route Origin -> Destination Card */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
          <div className="flex items-start gap-gutter-md">
            <div className="flex flex-col items-center pt-1 shrink-0">
              <span className="w-3 h-3 rounded-full bg-light-primary" />
              <span className="w-0.5 h-8 bg-light-outline-variant" />
              <span className="w-3 h-3 rounded-full bg-light-success" />
            </div>
            <div className="flex-1 flex flex-col gap-gutter-md">
              <div>
                <span className="font-label text-label-sm text-light-on-surface-variant block">
                  Starting Location
                </span>
                <span className="font-title text-title-sm text-light-on-surface">
                  {evacuationPlan.origin}
                </span>
              </div>
              <div>
                <span className="font-label text-label-sm text-light-on-surface-variant block">
                  Primary Destination
                </span>
                <span className="font-title text-title-sm text-light-success">
                  {evacuationPlan.destination}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-gutter-sm border-t border-light-outline-variant flex flex-wrap items-center justify-between gap-gutter-sm">
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Meeting Point:{' '}
              <strong className="text-light-on-surface">{evacuationPlan.meetingPoint}</strong> •{' '}
              {evacuationPlan.memberCount} members
            </span>
            <button
              type="button"
              onClick={() => navigate('family')}
              className="font-label text-label-md text-light-secondary hover:underline"
            >
              Family Safety →
            </button>
          </div>
        </section>

        {/* Active Route Hazard */}
        <div className="bg-light-error-container border-l-4 border-light-error rounded-md p-gutter-md flex items-start gap-gutter-sm">
          <Icon name="block" className="text-[20px] text-light-error shrink-0 mt-0.5" />
          <div>
            <span className="font-title text-title-sm text-light-on-error-container block">
              Route Blocked: Hindmata Flyover
            </span>
            <p className="font-body text-body-sm text-light-on-error-container">
              2.5 ft waterlogging reported by citizens &amp; BMC. Auto-rerouted via Gokhale Road
              North.
            </p>
          </div>
        </div>

        {/* Recommended & Alternative Routes */}
        <section className="flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-light-on-surface">Evacuation Routes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md">
            <article className="bg-light-surface border-2 border-light-success rounded-md p-gutter-lg flex flex-col justify-between gap-gutter-md">
              <div className="flex flex-col gap-gutter-sm">
                <div className="flex items-center justify-between gap-gutter-sm">
                  <span className="px-gutter-sm py-0.5 rounded bg-light-success-container text-light-on-success-container font-label text-label-sm">
                    Recommended • Elevated
                  </span>
                  <span className="font-label text-label-md text-light-on-surface tabular-nums">
                    1.4 km • 6 min
                  </span>
                </div>
                <h3 className="font-title text-title-md text-light-on-surface">
                  Via Gokhale Road North
                </h3>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  Zero waterlogging reported. Direct wheelchair access to BMC Dadar Shelter.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('map', { shelterId: 'shelter-dadar' })}
                className="min-h-[44px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-md inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
              >
                <Icon name="navigation" className="text-[18px]" />
                Start Route on Map
              </button>
            </article>

            <article className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col justify-between gap-gutter-md">
              <div className="flex flex-col gap-gutter-sm">
                <div className="flex items-center justify-between gap-gutter-sm">
                  <span className="px-gutter-sm py-0.5 rounded bg-light-warning-container text-light-on-warning-container font-label text-label-sm">
                    Alternative • Moderate Traffic
                  </span>
                  <span className="font-label text-label-md text-light-on-surface tabular-nums">
                    2.6 km • 11 min
                  </span>
                </div>
                <h3 className="font-title text-title-md text-light-on-surface">
                  Via Tilak Bridge → Matunga Camp
                </h3>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  Backup route to Matunga Community Hall (95/150 beds open).
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('map', { shelterId: 'shelter-matunga' })}
                className="min-h-[44px] w-full rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-md inline-flex items-center justify-center gap-gutter-xs hover:bg-light-surface-container-low"
              >
                <Icon name="map" className="text-[18px]" />
                Preview Alternative Route
              </button>
            </article>
          </div>
        </section>

        {/* Before Leaving Home Checklist */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-sm">
          <h2 className="font-title text-title-md text-light-on-surface">Before Leaving Home</h2>
          <label className="min-h-[44px] flex items-center gap-gutter-md cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.utilities}
              onChange={() => setChecklist((c) => ({ ...c, utilities: !c.utilities }))}
              className="w-5 h-5 accent-light-secondary"
            />
            <span className="font-body text-body-md text-light-on-surface">
              Switch off main power &amp; LPG valve
            </span>
          </label>
          <label className="min-h-[44px] flex items-center gap-gutter-md cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.kit}
              onChange={() => setChecklist((c) => ({ ...c, kit: !c.kit }))}
              className="w-5 h-5 accent-light-secondary"
            />
            <span className="font-body text-body-md text-light-on-surface">
              Grab waterproof document pouch &amp; 72-hr kit
            </span>
          </label>
          <label className="min-h-[44px] flex items-center gap-gutter-md cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.family}
              onChange={() => setChecklist((c) => ({ ...c, family: !c.family }))}
              className="w-5 h-5 accent-light-secondary"
            />
            <span className="font-body text-body-md text-light-on-surface">
              Notify family group via Safety Check-In
            </span>
          </label>
        </section>
      </main>

      {/* Edit Evacuation Plan Modal */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 bg-light-on-surface/50 flex items-center justify-center p-gutter-lg"
          role="dialog"
          aria-modal="true"
          aria-label="Edit Family Evacuation Plan"
        >
          <form
            onSubmit={handleSavePlan}
            className="bg-light-surface rounded-md max-w-[440px] w-full p-gutter-xl flex flex-col gap-gutter-md shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-title text-title-lg text-light-on-surface">
                Edit Evacuation Plan
              </h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                aria-label="Close"
                className="w-10 h-10 rounded-full hover:bg-light-surface-container-low inline-flex items-center justify-center"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="evac-origin" className="font-label text-label-md text-light-on-surface">
                Starting Address
              </label>
              <input
                id="evac-origin"
                type="text"
                value={originDraft}
                onChange={(e) => setOriginDraft(e.target.value)}
                required
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md focus:border-light-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="evac-dest" className="font-label text-label-md text-light-on-surface">
                Primary Relief Shelter
              </label>
              <input
                id="evac-dest"
                type="text"
                value={destDraft}
                onChange={(e) => setDestDraft(e.target.value)}
                required
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md focus:border-light-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="evac-meet" className="font-label text-label-md text-light-on-surface">
                Family Meeting Point
              </label>
              <input
                id="evac-meet"
                type="text"
                value={meetingDraft}
                onChange={(e) => setMeetingDraft(e.target.value)}
                required
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md focus:border-light-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg hover:opacity-95"
            >
              Save Evacuation Plan
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
