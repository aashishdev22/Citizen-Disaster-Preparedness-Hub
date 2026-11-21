import React, { useState } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';

export function VolunteerAssistanceScreen() {
  const { volunteerRequests, acceptVolunteerRequest, volunteers, registerVolunteer } = useApp();
  const [tab, setTab] = useState<'requests' | 'volunteers'>('requests');
  const [joinOpen, setJoinOpen] = useState(false);
  const [skill, setSkill] = useState('First Aid & CPR');
  const [area, setArea] = useState('Dadar West');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    registerVolunteer(skill, area);
    setJoinOpen(false);
    setTab('volunteers');
  };

  const getBadgeStyle = (variant: 'error' | 'warning' | 'secondary') => {
    if (variant === 'error') return 'bg-light-error-container text-light-on-error-container';
    if (variant === 'warning') return 'bg-light-warning-container text-light-on-warning-container';
    return 'bg-light-secondary-container text-light-on-secondary-container';
  };

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title="Community Relief & Volunteers"
        subtitle="Verified local needs • Mumbai F/South & G/North"
        backFallback="home"
        rightSlot={
          <button
            type="button"
            onClick={() => setJoinOpen(true)}
            className="min-h-[40px] px-gutter-md rounded bg-light-secondary text-light-on-secondary font-label text-label-md inline-flex items-center gap-gutter-xs hover:opacity-95"
          >
            <Icon name="volunteer_activism" className="text-[18px]" />
            Join
          </button>
        }
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Volunteer Tabs"
          className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-xs grid grid-cols-2 gap-gutter-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'requests'}
            onClick={() => setTab('requests')}
            className={`min-h-[44px] rounded font-label text-label-md transition-colors ${
              tab === 'requests'
                ? 'bg-light-primary text-light-on-primary'
                : 'text-light-on-surface-variant hover:text-light-on-surface'
            }`}
          >
            Nearby Requests ({volunteerRequests.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'volunteers'}
            onClick={() => setTab('volunteers')}
            className={`min-h-[44px] rounded font-label text-label-md transition-colors ${
              tab === 'volunteers'
                ? 'bg-light-primary text-light-on-primary'
                : 'text-light-on-surface-variant hover:text-light-on-surface'
            }`}
          >
            Volunteers ({volunteers.length})
          </button>
        </div>

        {/* Requests Panel */}
        {tab === 'requests' && (
          <section className="flex flex-col gap-gutter-md">
            {volunteerRequests.map((req) => (
              <article
                key={req.id}
                className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
                  <span
                    className={`px-gutter-sm py-0.5 rounded font-label text-label-sm ${getBadgeStyle(
                      req.badgeVariant
                    )}`}
                  >
                    {req.priorityBadge}
                  </span>
                  <span className="font-label text-label-sm text-light-on-surface-variant">
                    {req.distance}
                  </span>
                </div>
                <h2 className="font-title text-title-md text-light-on-surface">{req.title}</h2>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  {req.organization}
                </p>

                <div className="pt-gutter-xs">
                  {req.actionType === 'call' ? (
                    <a
                      href={`tel:${req.phone}`}
                      className="min-h-[44px] w-full sm:w-auto sm:px-gutter-lg rounded bg-light-secondary text-light-on-secondary font-label text-label-md inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
                    >
                      <Icon name="call" className="text-[18px]" />
                      {req.actionLabel}
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled={req.accepted}
                      onClick={() => acceptVolunteerRequest(req.id)}
                      className={`min-h-[44px] w-full sm:w-auto sm:px-gutter-lg rounded font-label text-label-md inline-flex items-center justify-center gap-gutter-xs transition-colors ${
                        req.accepted
                          ? 'bg-light-success text-light-on-success cursor-default'
                          : req.actionType === 'offer'
                            ? 'bg-light-primary text-light-on-primary hover:opacity-95'
                            : 'border border-light-outline-variant bg-light-surface text-light-primary hover:bg-light-surface-container-low'
                      }`}
                    >
                      {req.accepted ? req.acceptedLabel : req.actionLabel}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Volunteers Panel */}
        {tab === 'volunteers' && (
          <section className="flex flex-col gap-gutter-md">
            {volunteers.map((vol) => (
              <article
                key={vol.id}
                className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex items-center justify-between gap-gutter-md"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-gutter-xs">
                    <span className="font-title text-title-sm text-light-on-surface">
                      {vol.name}
                    </span>
                    {vol.verified && (
                      <Icon
                        name="verified"
                        className="text-[18px] text-light-secondary shrink-0"
                        filled
                      />
                    )}
                  </div>
                  <p className="font-body text-body-sm text-light-on-surface-variant mt-gutter-xs">
                    {vol.skillsLocation}
                  </p>
                </div>
                <a
                  href={`tel:${vol.phone}`}
                  aria-label={`Call ${vol.name}`}
                  className="w-11 h-11 rounded-full bg-light-surface-container-low text-light-primary inline-flex items-center justify-center shrink-0 hover:bg-light-surface-container"
                >
                  <Icon name="call" className="text-[20px]" />
                </a>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* Volunteer Registration Modal */}
      {joinOpen && (
        <div
          className="fixed inset-0 z-50 bg-light-on-surface/50 flex items-center justify-center p-gutter-lg"
          role="dialog"
          aria-modal="true"
          aria-label="Register as Community Volunteer"
        >
          <form
            onSubmit={handleJoin}
            className="bg-light-surface rounded-md max-w-[400px] w-full p-gutter-xl flex flex-col gap-gutter-md shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-title text-title-lg text-light-on-surface">Join as Volunteer</h2>
              <button
                type="button"
                onClick={() => setJoinOpen(false)}
                aria-label="Close"
                className="w-10 h-10 rounded-full hover:bg-light-surface-container-low inline-flex items-center justify-center"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="vol-skill" className="font-label text-label-md text-light-on-surface">
                Primary Skill
              </label>
              <select
                id="vol-skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant bg-light-surface font-body text-body-md"
              >
                <option value="First Aid & CPR">First Aid &amp; CPR</option>
                <option value="Food & Supply Distribution">Food &amp; Supply Distribution</option>
                <option value="Flood Rescue & Boat Support">Flood Rescue &amp; Boat Support</option>
                <option value="Elder Care & Shelter Desk">Elder Care &amp; Shelter Desk</option>
              </select>
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="vol-area" className="font-label text-label-md text-light-on-surface">
                Preferred Area / Ward
              </label>
              <input
                id="vol-area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
              />
            </div>
            <button
              type="submit"
              className="min-h-[48px] w-full rounded bg-light-secondary text-light-on-secondary font-label text-label-lg hover:opacity-95"
            >
              Submit Volunteer Application
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
