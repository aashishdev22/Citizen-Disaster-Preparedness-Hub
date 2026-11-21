import React, { useMemo, useState } from 'react';
import { AppShell, ContextualHeader, Icon } from '../components/Shell';
import { useApp } from '../state/AppContext';
import { filterNotifications } from '../utils/preparedness';

type NotifFilter = 'all' | 'emergency' | 'alerts' | 'updates';

const FILTER_TABS: { id: NotifFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'updates', label: 'Updates' },
];

export function NotificationsCenterScreen() {
  const { notifications, unreadCount, markAllNotificationsRead, markNotificationRead, navigate } =
    useApp();
  const [filter, setFilter] = useState<NotifFilter>('all');

  const visible = useMemo(
    () => filterNotifications(notifications, filter),
    [notifications, filter]
  );

  const getCardAccent = (variant: 'error' | 'success' | 'secondary', read: boolean) => {
    if (read) return 'border-light-outline-variant opacity-80';
    if (variant === 'error') return 'border-light-outline-variant border-l-4 border-l-light-error';
    if (variant === 'success')
      return 'border-light-outline-variant border-l-4 border-l-light-success';
    return 'border-light-outline-variant border-l-4 border-l-light-secondary';
  };

  const getLabelColor = (variant: 'error' | 'success' | 'secondary') => {
    if (variant === 'error') return 'text-light-error';
    if (variant === 'success') return 'text-light-success';
    return 'text-light-secondary';
  };

  return (
    <AppShell showBottomNav={false}>
      <ContextualHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
        backFallback="home"
        rightSlot={
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface font-label text-label-md text-light-secondary hover:bg-light-surface-container-low"
          >
            Mark All Read
          </button>
        }
      />

      <main className="px-gutter-lg lg:px-gutter-xl py-gutter-lg max-w-4xl w-full mx-auto flex flex-col gap-gutter-lg">
        {/* Filter Chips */}
        <div className="flex items-center gap-gutter-sm overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                aria-pressed={active}
                className={`min-h-[40px] px-gutter-md rounded font-label text-label-md whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {visible.length === 0 ? (
          <div className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-xl text-center flex flex-col items-center gap-gutter-sm">
            <Icon name="notifications_off" className="text-[32px] text-light-on-surface-variant" />
            <p className="font-title text-title-sm text-light-on-surface">
              No notifications in this category
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-gutter-sm">
            {visible.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  markNotificationRead(item.id);
                  navigate(item.targetScreen);
                }}
                className={`w-full text-left bg-light-surface border rounded-md p-gutter-md flex items-start gap-gutter-md hover:border-light-primary transition-colors ${getCardAccent(
                  item.variant,
                  item.read
                )}`}
              >
                <Icon
                  name={item.icon}
                  className={`text-[22px] shrink-0 mt-0.5 ${getLabelColor(item.variant)}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-gutter-sm">
                    <span className={`font-label text-label-sm ${getLabelColor(item.variant)}`}>
                      {item.categoryLabel}
                    </span>
                    <span className="font-label text-label-sm text-light-on-surface-variant shrink-0">
                      {item.timeAgo}
                    </span>
                  </div>
                  <h2 className="font-title text-title-sm text-light-on-surface mt-gutter-xs">
                    {item.title}
                  </h2>
                  <p className="font-body text-body-sm text-light-on-surface-variant">
                    {item.body}
                  </p>
                </div>
                {!item.read && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-light-error shrink-0 mt-1.5"
                    aria-label="Unread"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
