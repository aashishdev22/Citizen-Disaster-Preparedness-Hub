import React, { useState } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';

const OFFICIAL_HELPLINES = [
  { number: '100', label: 'Police', color: 'text-light-primary', icon: 'local_police' },
  { number: '101', label: 'Fire Brigade', color: 'text-light-error', icon: 'local_fire_department' },
  { number: '108', label: 'Ambulance', color: 'text-light-secondary', icon: 'medical_services' },
  { number: '1070', label: 'Disaster (SDMA)', color: 'text-light-warning', icon: 'support_agent' },
];

export function EmergencyContactsScreen() {
  const { contacts, addContact, showToast } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [phoneDraft, setPhoneDraft] = useState('');
  const [relationDraft, setRelationDraft] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameDraft.trim() || !phoneDraft.trim()) return;
    addContact(nameDraft, phoneDraft, relationDraft);
    setNameDraft('');
    setPhoneDraft('');
    setRelationDraft('');
    setAddOpen(false);
  };

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title="Emergency Contacts"
        subtitle="National Helplines & Trusted Personal Contacts"
        backFallback="home"
        rightSlot={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="min-h-[40px] px-gutter-md rounded bg-light-primary text-light-on-primary font-label text-label-md inline-flex items-center gap-gutter-xs hover:opacity-95"
          >
            <Icon name="add" className="text-[18px]" />
            Add
          </button>
        }
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* 112 National ERSS Hero */}
        <a
          href="tel:112"
          className="bg-light-error text-light-on-error rounded-md p-gutter-lg flex items-center justify-between gap-gutter-md hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-gutter-md">
            <span className="w-12 h-12 rounded-full bg-light-on-error/15 inline-flex items-center justify-center shrink-0">
              <Icon name="emergency" className="text-[28px]" filled />
            </span>
            <div>
              <span className="font-headline text-headline-sm block">112 — National ERSS</span>
              <span className="font-body text-body-sm text-light-error-container">
                All-in-one Police, Fire, Medical &amp; NDRF
              </span>
            </div>
          </div>
          <span className="w-11 h-11 rounded-full bg-light-on-error text-light-error inline-flex items-center justify-center shrink-0">
            <Icon name="call" className="text-[22px]" />
          </span>
        </a>

        {/* Official Helplines 2x2 Grid */}
        <section className="flex flex-col gap-gutter-sm">
          <h2 className="font-title text-title-md text-light-on-surface">
            Official India Helplines
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter-md">
            {OFFICIAL_HELPLINES.map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="min-h-[84px] bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex items-center justify-between hover:border-light-primary transition-colors"
              >
                <div>
                  <span className={`font-headline text-headline-sm block tabular-nums ${item.color}`}>
                    {item.number}
                  </span>
                  <span className="font-label text-label-sm text-light-on-surface-variant">
                    {item.label}
                  </span>
                </div>
                <Icon name="call" className={`text-[20px] ${item.color}`} />
              </a>
            ))}
          </div>
        </section>

        {/* Personal Trusted Contacts */}
        <section className="flex flex-col gap-gutter-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-light-on-surface">
              Personal Emergency Contacts ({contacts.length})
            </h2>
            <span className="font-label text-label-sm text-light-success inline-flex items-center gap-1">
              <Icon name="offline_pin" className="text-[16px]" />
              Cached offline
            </span>
          </div>

          <div className="flex flex-col gap-gutter-sm">
            {contacts.map((contact) => (
              <article
                key={contact.id}
                className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md flex items-center justify-between gap-gutter-md"
              >
                <div className="flex items-center gap-gutter-md min-w-0">
                  <span className="w-9 h-9 rounded-full bg-light-primary-container text-light-primary font-label text-label-md inline-flex items-center justify-center shrink-0 tabular-nums">
                    {contact.rank}
                  </span>
                  <div className="min-w-0">
                    <span className="font-title text-title-sm text-light-on-surface block truncate">
                      {contact.name} ({contact.relation})
                    </span>
                    <span className="font-mono text-body-sm text-light-on-surface-variant">
                      {contact.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-gutter-xs shrink-0">
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    aria-label={`Call ${contact.name}`}
                    className="w-11 h-11 rounded-full bg-light-success-container text-light-success inline-flex items-center justify-center hover:opacity-90"
                  >
                    <Icon name="call" className="text-[20px]" />
                  </a>
                  {contact.canSms && (
                    <button
                      type="button"
                      onClick={() =>
                        showToast(`Emergency GPS SMS drafted for ${contact.name}.`, 'info')
                      }
                      aria-label={`SMS ${contact.name}`}
                      className="w-11 h-11 rounded-full bg-light-surface-container-low text-light-primary inline-flex items-center justify-center hover:bg-light-surface-container"
                    >
                      <Icon name="sms" className="text-[20px]" />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Add Contact Modal */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 bg-light-on-surface/50 flex items-center justify-center p-gutter-lg"
          role="dialog"
          aria-modal="true"
          aria-label="Add Emergency Contact"
        >
          <form
            onSubmit={handleAdd}
            className="bg-light-surface rounded-md max-w-[400px] w-full p-gutter-xl flex flex-col gap-gutter-md shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-title text-title-lg text-light-on-surface">
                Add Trusted Contact
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
              placeholder="Contact Name"
              required
              className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md focus:border-light-primary focus:outline-none"
            />
            <input
              type="text"
              value={relationDraft}
              onChange={(e) => setRelationDraft(e.target.value)}
              placeholder="Relation (e.g., Neighbor, Brother)"
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
              Save Contact Offline
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
