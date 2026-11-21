import React, { useState } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';

export function FamilySafetyScreen() {
  const {
    familyMembers,
    familyCheckInStatus,
    triggerFamilyCheckIn,
    addFamilyMember,
    evacuationPlan,
    navigate,
    showToast,
  } = useApp();

  const [addOpen, setAddOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [phoneDraft, setPhoneDraft] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameDraft.trim() || !phoneDraft.trim()) return;
    addFamilyMember(nameDraft, phoneDraft);
    setNameDraft('');
    setPhoneDraft('');
    setAddOpen(false);
  };

  const getStatusChip = (status: string) => {
    if (status === 'Safe') {
      return 'bg-light-success-container text-light-on-success-container';
    }
    if (status === 'Checking In') {
      return 'bg-light-warning-container text-light-on-warning-container';
    }
    if (status === 'Need Help') {
      return 'bg-light-error-container text-light-on-error-container';
    }
    return 'bg-light-surface-container text-light-on-surface-variant';
  };

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title="Family Safety & Check-In"
        subtitle={`Sharma Family Group • ${familyMembers.length + 1} Members`}
        backFallback="home"
        rightSlot={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="min-h-[40px] px-gutter-md rounded bg-light-primary text-light-on-primary font-label text-label-md inline-flex items-center gap-gutter-xs hover:opacity-95"
          >
            <Icon name="person_add" className="text-[18px]" />
            Add
          </button>
        }
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* One-Tap Personal Check-In Banner */}
        <section className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md">
          <div>
            <h2 className="font-title text-title-md text-light-on-surface">
              Your Check-In Status
            </h2>
            <p
              role="status"
              className={`font-body text-body-sm mt-gutter-xs ${
                familyCheckInStatus.type === 'safe'
                  ? 'text-light-success font-medium'
                  : familyCheckInStatus.type === 'help'
                    ? 'text-light-error font-medium'
                    : 'text-light-on-surface-variant'
              }`}
            >
              {familyCheckInStatus.message}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
            <button
              type="button"
              onClick={() => triggerFamilyCheckIn('safe')}
              className="min-h-[48px] rounded bg-light-success text-light-on-success font-label text-label-lg inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
            >
              <Icon name="check_circle" className="text-[20px]" />
              I am Safe
            </button>
            <button
              type="button"
              onClick={() => triggerFamilyCheckIn('help')}
              className="min-h-[48px] rounded bg-light-error text-light-on-error font-label text-label-lg inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
            >
              <Icon name="sos" className="text-[20px]" />
              Need Help
            </button>
          </div>
        </section>

        {/* Family Meeting Point Card */}
        <section className="bg-light-primary-container border border-light-outline-variant rounded-md p-gutter-md flex items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-md min-w-0">
            <Icon name="meeting_room" className="text-[24px] text-light-primary shrink-0" />
            <div className="min-w-0">
              <span className="font-label text-label-sm text-light-primary uppercase block">
                Family Meeting Point
              </span>
              <span className="font-title text-title-sm text-light-on-primary-container block truncate">
                {evacuationPlan.meetingPoint} ({evacuationPlan.destination})
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('evacuation')}
            className="min-h-[40px] px-gutter-md rounded bg-light-surface text-light-primary font-label text-label-md inline-flex items-center shrink-0 hover:bg-light-surface-container-low"
          >
            Route
          </button>
        </section>

        {/* Family Members List */}
        <section className="flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-light-on-surface">
            Family Members ({familyMembers.length})
          </h2>

          <div className="flex flex-col gap-gutter-sm">
            {familyMembers.map((member) => (
              <article
                key={member.id}
                className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex items-center justify-between gap-gutter-md"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-gutter-sm">
                    <span className="font-title text-title-sm text-light-on-surface">
                      {member.name}
                    </span>
                    <span
                      className={`px-gutter-sm py-0.5 rounded font-label text-label-sm ${getStatusChip(
                        member.status
                      )}`}
                    >
                      {member.status}
                    </span>
                  </div>
                  <p className="font-body text-body-sm text-light-on-surface-variant mt-gutter-xs">
                    {member.locationTime}
                  </p>
                </div>

                <div className="flex items-center gap-gutter-xs shrink-0">
                  <a
                    href={`tel:${member.phone}`}
                    aria-label={`Call ${member.name}`}
                    className="w-11 h-11 rounded-full bg-light-surface-container-low text-light-primary inline-flex items-center justify-center hover:bg-light-surface-container"
                  >
                    <Icon name="call" className="text-[20px]" />
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Safety check-in SMS ping sent to ${member.name}.`, 'info')
                    }
                    aria-label={`Message ${member.name}`}
                    className="w-11 h-11 rounded-full bg-light-surface-container-low text-light-secondary inline-flex items-center justify-center hover:bg-light-surface-container"
                  >
                    <Icon name="sms" className="text-[20px]" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Add Family Member Modal */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 bg-light-on-surface/50 flex items-center justify-center p-gutter-lg"
          role="dialog"
          aria-modal="true"
          aria-label="Add Family Member"
        >
          <form
            onSubmit={handleAdd}
            className="bg-light-surface rounded-md max-w-[400px] w-full p-gutter-xl flex flex-col gap-gutter-md shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-title text-title-lg text-light-on-surface">
                Add Family Member
              </h2>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                aria-label="Close"
                className="w-10 h-10 rounded-full hover:bg-light-surface-container-low inline-flex items-center justify-center"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="Full Name (e.g., Priya Sharma)"
              required
              className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md focus:border-light-primary focus:outline-none"
            />
            <input
              type="tel"
              value={phoneDraft}
              onChange={(e) => setPhoneDraft(e.target.value)}
              placeholder="Mobile Number (+91 ...)"
              required
              className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md focus:border-light-primary focus:outline-none"
            />
            <button
              type="submit"
              className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg hover:opacity-95"
            >
              Send Safety Group Invite
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
