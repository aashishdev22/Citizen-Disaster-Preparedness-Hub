import React, { useState } from 'react';
import { AppShell, ContextualHeader, Icon, SafeImage } from '../components/Shell';
import { useApp } from '../state/AppContext';

const INCIDENT_TYPES = [
  'Flooded Road / Waterlogging',
  'Fallen Tree Blocking Road',
  'Fallen Electric Wire / Sparking Pole',
  'Fire / Smoke Hazard',
  'Building Structural Cracks / Collapse Risk',
  'People Stranded — Need Rescue',
];

export function IncidentReportingScreen() {
  const { reports, addIncidentReport, showToast } = useApp();
  const [tab, setTab] = useState<'new' | 'list'>('new');
  const [incidentType, setIncidentType] = useState(INCIDENT_TYPES[0]);
  const [severity, setSeverity] = useState<'Low' | 'High' | 'Critical'>('High');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [location, setLocation] = useState('Dadar TT Circle, Mumbai (19.0178° N, 72.8478° E)');
  const [description, setDescription] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addIncidentReport({
      type: incidentType,
      severity,
      location,
      description,
      hasPhoto,
      hasVideo,
    });
    setSubmittedCode(created.code);
    setDescription('');
    setHasPhoto(false);
    setHasVideo(false);
    showToast(`Report ${created.code} submitted to BMC Ward F/South.`, 'success');
  };

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title="Community Incident Report"
        subtitle="Verified reports route directly to BMC & SDMA"
        backFallback="home"
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Incident Reporting Views"
          className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-xs grid grid-cols-2 gap-gutter-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'new'}
            onClick={() => setTab('new')}
            className={`min-h-[44px] rounded font-label text-label-md transition-colors ${
              tab === 'new'
                ? 'bg-light-primary text-light-on-primary'
                : 'text-light-on-surface-variant hover:text-light-on-surface'
            }`}
          >
            Report Incident
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'list'}
            onClick={() => setTab('list')}
            className={`min-h-[44px] rounded font-label text-label-md transition-colors ${
              tab === 'list'
                ? 'bg-light-primary text-light-on-primary'
                : 'text-light-on-surface-variant hover:text-light-on-surface'
            }`}
          >
            My Reports ({reports.length})
          </button>
        </div>

        {/* Report Form */}
        {tab === 'new' && (
          <form
            onSubmit={handleSubmit}
            className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg lg:p-gutter-xl flex flex-col gap-gutter-lg"
          >
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="inc-type" className="font-label text-label-md text-light-on-surface">
                Incident Type
              </label>
              <select
                id="inc-type"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="min-h-[48px] px-gutter-md rounded border border-light-outline-variant bg-light-surface font-body text-body-md text-light-on-surface focus:border-light-primary focus:outline-none"
              >
                {INCIDENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-light-on-surface">Severity Level</span>
              <div className="grid grid-cols-3 gap-gutter-sm">
                {(['Low', 'High', 'Critical'] as const).map((lvl) => {
                  const active = severity === lvl;
                  const activeStyle =
                    lvl === 'Critical'
                      ? 'border-2 border-light-error bg-light-error-container text-light-on-error-container'
                      : lvl === 'High'
                        ? 'border-2 border-light-warning bg-light-warning-container text-light-on-warning-container'
                        : 'border-2 border-light-secondary bg-light-secondary-container text-light-on-secondary-container';
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeverity(lvl)}
                      aria-pressed={active}
                      className={`min-h-[44px] rounded font-label text-label-md transition-colors ${
                        active
                          ? activeStyle
                          : 'border border-light-outline-variant bg-light-surface text-light-on-surface-variant hover:bg-light-surface-container-low'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-light-on-surface">
                Attach Photo / Video Evidence
              </span>
              <div className="grid grid-cols-2 gap-gutter-sm">
                <button
                  type="button"
                  onClick={() => setHasPhoto((v) => !v)}
                  aria-pressed={hasPhoto}
                  className={`min-h-[56px] rounded border border-dashed font-label text-label-md inline-flex items-center justify-center gap-gutter-xs transition-colors ${
                    hasPhoto
                      ? 'border-light-success bg-light-success-container text-light-on-success-container'
                      : 'border-light-outline bg-light-surface-container-low text-light-primary hover:bg-light-surface-container'
                  }`}
                >
                  <Icon name={hasPhoto ? 'check_circle' : 'add_a_photo'} className="text-[20px]" />
                  {hasPhoto ? 'Photo Attached' : 'Add Photo'}
                </button>
                <button
                  type="button"
                  onClick={() => setHasVideo((v) => !v)}
                  aria-pressed={hasVideo}
                  className={`min-h-[56px] rounded border border-dashed font-label text-label-md inline-flex items-center justify-center gap-gutter-xs transition-colors ${
                    hasVideo
                      ? 'border-light-success bg-light-success-container text-light-on-success-container'
                      : 'border-light-outline bg-light-surface-container-low text-light-primary hover:bg-light-surface-container'
                  }`}
                >
                  <Icon name={hasVideo ? 'check_circle' : 'videocam'} className="text-[20px]" />
                  {hasVideo ? 'Clip Attached' : 'Short Clip'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="inc-loc" className="font-label text-label-md text-light-on-surface">
                GPS Location
              </label>
              <div className="flex items-center gap-gutter-sm">
                <input
                  id="inc-loc"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="flex-1 min-h-[48px] px-gutter-md rounded border border-light-outline-variant bg-light-surface font-body text-body-md text-light-on-surface focus:border-light-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setLocation('Dadar TT Circle, Mumbai (19.0178° N, 72.8478° E)');
                    showToast('GPS coordinates refreshed (±6m accuracy).', 'info');
                  }}
                  aria-label="Refresh GPS location"
                  className="w-12 h-12 rounded border border-light-outline-variant bg-light-surface-container-low text-light-secondary inline-flex items-center justify-center hover:bg-light-surface-container shrink-0"
                >
                  <Icon name="my_location" className="text-[20px]" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="inc-desc" className="font-label text-label-md text-light-on-surface">
                Description
              </label>
              <textarea
                id="inc-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe water depth, landmark, or people needing help..."
                className="p-gutter-md rounded border border-light-outline-variant bg-light-surface font-body text-body-md text-light-on-surface focus:border-light-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg hover:opacity-95 transition-opacity"
            >
              Submit Incident Report
            </button>

            {submittedCode && (
              <div
                role="status"
                className="bg-light-success-container text-light-on-success-container rounded-md p-gutter-md flex items-center justify-between gap-gutter-sm"
              >
                <div className="flex items-start gap-gutter-sm">
                  <Icon name="check_circle" className="text-[22px] text-light-success shrink-0" />
                  <div>
                    <span className="font-title text-title-sm block">
                      Report Submitted ({submittedCode})
                    </span>
                    <span className="font-body text-body-sm">
                      Forwarded to BMC Ward F/South &amp; queued for offline sync.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTab('list')}
                  className="min-h-[36px] px-gutter-md rounded bg-light-success text-light-on-success font-label text-label-sm shrink-0"
                >
                  Track
                </button>
              </div>
            )}
          </form>
        )}

        {/* My Reports List */}
        {tab === 'list' && (
          <section className="flex flex-col gap-gutter-md">
            {reports.map((report) => {
              const badgeClasses =
                report.status === 'Resolved'
                  ? 'bg-light-success-container text-light-on-success-container'
                  : report.status === 'Response Initiated'
                    ? 'bg-light-warning-container text-light-on-warning-container'
                    : 'bg-light-secondary-container text-light-on-secondary-container';
              return (
                <article
                  key={report.id}
                  className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
                    <span className="font-mono text-label-md text-light-on-surface-variant">
                      {report.code}
                    </span>
                    <div className="flex items-center gap-gutter-xs">
                      <span className="px-gutter-sm py-0.5 rounded bg-light-surface-container-low text-light-on-surface font-label text-label-sm">
                        {report.severity}
                      </span>
                      <span
                        className={`px-gutter-sm py-0.5 rounded font-label text-label-sm ${badgeClasses}`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>

                  {report.imageUrl && (
                    <SafeImage
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-44 object-cover rounded"
                      fallbackIcon="flood"
                      fallbackLabel={report.title}
                    />
                  )}

                  <div>
                    <h2 className="font-title text-title-md text-light-on-surface">
                      {report.title}
                    </h2>
                    <p className="font-label text-label-sm text-light-on-surface-variant mt-gutter-xs">
                      {report.location}
                    </p>
                    <p className="font-body text-body-sm text-light-on-surface-variant mt-gutter-xs">
                      {report.description}
                    </p>
                  </div>

                  <ol className="flex flex-col gap-gutter-xs border-l-2 border-light-secondary pl-gutter-md ml-1">
                    {report.timeline.map((step) => (
                      <li
                        key={step.label}
                        className={`font-label text-label-sm ${
                          step.state === 'done'
                            ? 'text-light-success'
                            : step.state === 'active'
                              ? 'text-light-primary'
                              : 'text-light-on-surface-variant'
                        }`}
                      >
                        {step.state === 'done' ? '✓ ' : step.state === 'active' ? '● ' : '○ '}
                        {step.label}
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </AppShell>
  );
}
