import React, { useState } from 'react';
import { AppShell, ContextualHeader, Icon, SafeImage } from '../components/Shell';
import { useApp } from '../state/AppContext';

export function UserProfileScreen() {
  const { user, updateUser, preparedness, familyMembers, reports, navigate, showToast } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(user.name);
  const [phoneDraft, setPhoneDraft] = useState(user.phone);
  const [locationDraft, setLocationDraft] = useState(user.locationLabel);

  const openEditor = () => {
    setNameDraft(user.name);
    setPhoneDraft(user.phone);
    setLocationDraft(user.locationLabel);
    setEditOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: nameDraft.trim() || user.name,
      phone: phoneDraft.trim() || user.phone,
      locationLabel: locationDraft.trim() || user.locationLabel,
      isGuest: false,
    });
    setEditOpen(false);
    showToast('Citizen profile updated.', 'success');
  };

  const navRows = [
    {
      screen: 'contacts' as const,
      icon: 'contact_phone',
      color: 'text-light-error',
      label: 'Emergency Contacts & 112',
    },
    {
      screen: 'family' as const,
      icon: 'family_restroom',
      color: 'text-light-primary',
      label: 'Family Safety Group',
    },
    {
      screen: 'volunteer' as const,
      icon: 'volunteer_activism',
      color: 'text-light-secondary',
      label: 'Volunteer & Relief Shifts',
    },
    {
      screen: 'offline' as const,
      icon: 'offline_pin',
      color: 'text-light-success',
      label: 'Offline Downloads & Pack',
    },
    {
      screen: 'settings' as const,
      icon: 'settings',
      color: 'text-light-on-surface-variant',
      label: 'Settings & Accessibility',
    },
  ];

  return (
    <AppShell>
      <ContextualHeader
        title="Citizen Profile"
        subtitle="Preparedness Summary & Account Hub"
        backFallback="home"
        rightSlot={
          <button
            type="button"
            onClick={() => navigate('settings')}
            aria-label="Open Settings"
            className="w-11 h-11 rounded-full hover:bg-light-surface-container-low inline-flex items-center justify-center text-light-on-surface"
          >
            <Icon name="settings" className="text-[22px]" />
          </button>
        }
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Citizen Identity Card */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex items-center gap-gutter-md">
          <SafeImage
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-light-primary shrink-0"
            fallbackIcon="person"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-gutter-xs">
              <h2 className="font-headline text-headline-sm text-light-on-surface truncate">
                {user.name}
              </h2>
              {user.isGuest && (
                <span className="px-gutter-sm py-0.5 rounded bg-light-warning-container text-light-on-warning-container font-label text-label-sm">
                  Guest
                </span>
              )}
            </div>
            <p className="font-body text-body-sm text-light-on-surface-variant">
              {user.locationLabel} • {user.phone}
            </p>
          </div>
          <button
            type="button"
            onClick={openEditor}
            className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-md hover:bg-light-surface-container-low shrink-0"
          >
            Edit
          </button>
        </section>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-gutter-sm">
          <button
            type="button"
            onClick={() => navigate('kit')}
            className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md text-center hover:border-light-secondary transition-colors"
          >
            <span className="font-headline text-headline-sm text-light-secondary block tabular-nums">
              {preparedness.percentage}%
            </span>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Preparedness
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('family')}
            className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md text-center hover:border-light-primary transition-colors"
          >
            <span className="font-headline text-headline-sm text-light-primary block tabular-nums">
              {familyMembers.length + 1}
            </span>
            <span className="font-label text-label-sm text-light-on-surface-variant">Family</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('report')}
            className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md text-center hover:border-light-primary transition-colors"
          >
            <span className="font-headline text-headline-sm text-light-primary block tabular-nums">
              {reports.length}
            </span>
            <span className="font-label text-label-sm text-light-on-surface-variant">Reports</span>
          </button>
        </div>

        {/* Navigation List */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md divide-y divide-light-outline-variant overflow-hidden">
          {navRows.map((row) => (
            <button
              key={row.screen}
              type="button"
              onClick={() => navigate(row.screen)}
              className="w-full min-h-[56px] px-gutter-md py-gutter-sm flex items-center justify-between hover:bg-light-surface-container-low transition-colors text-left"
            >
              <span className="flex items-center gap-gutter-md">
                <Icon name={row.icon} className={`text-[22px] ${row.color}`} />
                <span className="font-title text-title-sm text-light-on-surface">{row.label}</span>
              </span>
              <Icon name="chevron_right" className="text-[20px] text-light-on-surface-variant" />
            </button>
          ))}
        </section>

        {/* Quick access to Welcome & Auth Screens */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex flex-wrap items-center justify-between gap-gutter-sm">
          <div>
            <span className="font-title text-title-sm text-light-on-surface block">
              App Tour &amp; Account Switching
            </span>
            <span className="font-body text-body-sm text-light-on-surface-variant">
              Replay language splash, onboarding tour, or sign in with another number.
            </span>
          </div>
          <div className="flex items-center gap-gutter-sm">
            <button
              type="button"
              onClick={() => navigate('splash')}
              className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-md hover:bg-light-surface-container-low"
            >
              Language Splash
            </button>
            <button
              type="button"
              onClick={() => navigate('onboarding')}
              className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-md hover:bg-light-surface-container-low"
            >
              Onboarding Tour
            </button>
          </div>
        </section>
      </main>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 bg-light-on-surface/50 flex items-center justify-center p-gutter-lg"
          role="dialog"
          aria-modal="true"
          aria-label="Edit Citizen Profile"
        >
          <form
            onSubmit={handleSave}
            className="bg-light-surface rounded-md max-w-[400px] w-full p-gutter-xl flex flex-col gap-gutter-md shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-title text-title-lg text-light-on-surface">Edit Profile</h2>
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
              <label htmlFor="prof-name" className="font-label text-label-md text-light-on-surface">
                Full Name
              </label>
              <input
                id="prof-name"
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                required
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
              />
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="prof-phone" className="font-label text-label-md text-light-on-surface">
                Mobile Number
              </label>
              <input
                id="prof-phone"
                type="tel"
                value={phoneDraft}
                onChange={(e) => setPhoneDraft(e.target.value)}
                required
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
              />
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="prof-loc" className="font-label text-label-md text-light-on-surface">
                Home Neighborhood
              </label>
              <input
                id="prof-loc"
                type="text"
                value={locationDraft}
                onChange={(e) => setLocationDraft(e.target.value)}
                required
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
              />
            </div>
            <button
              type="submit"
              className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg hover:opacity-95"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
