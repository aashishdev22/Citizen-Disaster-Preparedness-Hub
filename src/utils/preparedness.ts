import {
  AlertItem,
  AppNotification,
  DisasterGuide,
  IncidentReport,
  KitItem,
  ShelterItem,
  ShelterType,
} from '../types';

const RING_CIRCUMFERENCE = 213.6;

export interface PreparednessSummary {
  checkedCount: number;
  totalCount: number;
  percentage: number;
  strokeDashoffset: number;
  missingItems: string[];
}

export function calculatePreparedness(items: KitItem[]): PreparednessSummary {
  const totalCount = items.length;
  if (totalCount === 0) {
    return {
      checkedCount: 0,
      totalCount: 0,
      percentage: 0,
      strokeDashoffset: RING_CIRCUMFERENCE,
      missingItems: [],
    };
  }
  const checkedCount = items.filter((item) => item.checked).length;
  const percentage = Math.round((checkedCount / totalCount) * 100);
  const strokeDashoffset = Number(
    (RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * percentage) / 100).toFixed(1)
  );
  const missingItems = items.filter((item) => !item.checked).map((item) => item.shortLabel);
  return {
    checkedCount,
    totalCount,
    percentage,
    strokeDashoffset,
    missingItems,
  };
}

export function filterAlerts(alerts: AlertItem[], category: string): AlertItem[] {
  if (category === 'all') return alerts;
  return alerts.filter((alert) => alert.categories.includes(category));
}

export function filterGuides(guides: DisasterGuide[], query: string): DisasterGuide[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return guides;
  return guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(normalized) ||
      guide.subtitle.toLowerCase().includes(normalized) ||
      guide.searchKeywords.toLowerCase().includes(normalized)
  );
}

export function filterShelters(
  shelters: ShelterItem[],
  query: string,
  typeFilter: ShelterType | 'all'
): ShelterItem[] {
  const normalized = query.trim().toLowerCase();
  return shelters.filter((shelter) => {
    const matchesType = typeFilter === 'all' || shelter.type === typeFilter;
    const matchesQuery =
      !normalized ||
      shelter.name.toLowerCase().includes(normalized) ||
      shelter.address.toLowerCase().includes(normalized) ||
      shelter.facilities.toLowerCase().includes(normalized);
    return matchesType && matchesQuery;
  });
}

export function filterNotifications(
  notifications: AppNotification[],
  filter: 'all' | 'emergency' | 'alerts' | 'updates'
): AppNotification[] {
  if (filter === 'all') return notifications;
  return notifications.filter((n) => n.types.includes(filter));
}

export function validateLogin(
  identifier: string,
  password: string
): { valid: boolean; error?: string } {
  if (!identifier.trim() || !password.trim()) {
    return {
      valid: false,
      error: 'Please enter both your mobile number/email and password.',
    };
  }
  return { valid: true };
}

export interface RegistrationInput {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export function validateRegistration(
  input: RegistrationInput
): { valid: boolean; error?: string } {
  if (input.password !== input.confirmPassword) {
    return {
      valid: false,
      error: 'Passwords do not match. Please check and try again.',
    };
  }
  if (!input.name.trim() || !input.phone.trim() || !input.password || !input.acceptedTerms) {
    return {
      valid: false,
      error: 'Please fill in your name, mobile number, password, and accept the terms.',
    };
  }
  if (input.password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long.',
    };
  }
  return { valid: true };
}

export function createIncidentReport(
  input: {
    type: string;
    severity: 'Low' | 'High' | 'Critical';
    location: string;
    description: string;
    hasPhoto: boolean;
    hasVideo: boolean;
  },
  existingCount: number
): IncidentReport {
  const codeNum = 4091 + existingCount;
  const code = `#INC-MH-${codeNum}`;
  const mediaNote =
    input.hasPhoto || input.hasVideo
      ? ` • ${[input.hasPhoto ? 'Photo' : '', input.hasVideo ? 'Video' : ''].filter(Boolean).join(' & ')} attached`
      : '';
  return {
    id: `rep-${codeNum}`,
    code,
    type: input.type,
    title: `${input.type} — ${input.location.split('(')[0].trim()}`,
    severity: input.severity,
    location: input.location,
    description:
      input.description.trim() ||
      'Citizen hazard report submitted for Ward F/South Disaster Cell verification.',
    submittedAt: `Just now${mediaNote} • Forwarded to BMC Ward F/South`,
    status: 'Submitted & Queued',
    timeline: [
      { label: 'Submitted (Just now)', state: 'done' },
      { label: 'Ward Verification (In Progress)', state: 'active' },
      { label: 'Resolved (Pending)', state: 'pending' },
    ],
  };
}
