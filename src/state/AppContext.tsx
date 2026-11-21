import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AccessibilitySettings,
  AlertItem,
  AppNotification,
  DisasterGuide,
  EmergencyContact,
  EvacuationPlan,
  FamilyMember,
  IncidentReport,
  KitItem,
  Language,
  ScreenId,
  ShelterItem,
  UserProfile,
  VolunteerMember,
  VolunteerRequest,
  WeatherForecastSnapshot,
} from '../types';
import {
  buildLatestWeatherSnapshot,
  INITIAL_ALERTS,
  INITIAL_CONTACTS,
  INITIAL_EVACUATION_PLAN,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_GUIDES,
  INITIAL_KIT_ITEMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_SHELTERS,
  INITIAL_USER,
  INITIAL_VOLUNTEERS,
  INITIAL_VOLUNTEER_REQUESTS,
} from '../data/seedData';
import { calculatePreparedness, createIncidentReport, PreparednessSummary } from '../utils/preparedness';
import {
  clearWeatherSnapshot,
  loadWeatherSnapshot,
  saveWeatherSnapshot,
  wasWeatherCacheCleared,
} from '../utils/weatherCache';

interface ToastState {
  id: number;
  message: string;
  variant: 'info' | 'success' | 'error' | 'warning';
}

interface AppContextValue {
  screen: ScreenId;
  navigate: (next: ScreenId, options?: { guideId?: string; shelterId?: string }) => void;
  goBack: (fallback?: ScreenId) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile;
  updateUser: (patch: Partial<UserProfile>) => void;
  alerts: AlertItem[];
  markAlertRead: (id: string) => void;
  shelters: ShelterItem[];
  selectedShelterId: string;
  setSelectedShelterId: (id: string) => void;
  guides: DisasterGuide[];
  selectedGuideId: string;
  setSelectedGuideId: (id: string) => void;
  toggleGuideBookmark: (id: string) => void;
  kitItems: KitItem[];
  toggleKitItem: (id: string) => void;
  resetKitItems: () => void;
  preparedness: PreparednessSummary;
  evacuationPlan: EvacuationPlan;
  updateEvacuationPlan: (plan: Partial<EvacuationPlan>) => void;
  familyMembers: FamilyMember[];
  familyCheckInStatus: { type: 'none' | 'safe' | 'help'; message: string };
  triggerFamilyCheckIn: (type: 'safe' | 'help') => void;
  addFamilyMember: (name: string, phone: string) => void;
  contacts: EmergencyContact[];
  addContact: (name: string, phone: string, relation: string) => void;
  reports: IncidentReport[];
  addIncidentReport: (input: {
    type: string;
    severity: 'Low' | 'High' | 'Critical';
    location: string;
    description: string;
    hasPhoto: boolean;
    hasVideo: boolean;
  }) => IncidentReport;
  volunteerRequests: VolunteerRequest[];
  acceptVolunteerRequest: (id: string) => void;
  volunteers: VolunteerMember[];
  registerVolunteer: (skill: string, area: string) => void;
  notifications: AppNotification[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (patch: Partial<AccessibilitySettings>) => void;
  pendingSyncCount: number;
  retrySync: () => void;
  isOnline: boolean;
  cachedWeather: WeatherForecastSnapshot | null;
  cacheLatestWeather: (options?: { silent?: boolean }) => boolean;
  clearCachedWeather: () => void;
  toast: ToastState | null;
  showToast: (message: string, variant?: ToastState['variant']) => void;
  dismissToast: () => void;
}

const VALID_SCREENS: ScreenId[] = [
  'home',
  'sos',
  'alerts',
  'map',
  'safety',
  'guide-detail',
  'kit',
  'weather',
  'evacuation',
  'report',
  'family',
  'contacts',
  'offline',
  'volunteer',
  'notifications',
  'profile',
  'settings',
  'splash',
  'onboarding',
  'login',
  'register',
  'forgot-password',
];

function getInitialScreen(): ScreenId {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return 'home';
    }
    const requested = params.get('screen') as ScreenId | null;
    if (requested && VALID_SCREENS.includes(requested)) {
      return requested;
    }
  } catch {
    // Ignore URL parsing errors
  }
  return 'home';
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(`cdph_${key}`);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(`cdph_${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<ScreenId>(getInitialScreen);
  const [history, setHistory] = useState<ScreenId[]>([]);
  const [language, setLanguageState] = useState<Language>(() => readStored<Language>('lang', 'en'));
  const [user, setUser] = useState<UserProfile>(() => readStored('user', INITIAL_USER));
  const [alerts, setAlerts] = useState<AlertItem[]>(() => readStored('alerts', INITIAL_ALERTS));
  const [shelters] = useState<ShelterItem[]>(INITIAL_SHELTERS);
  const [selectedShelterId, setSelectedShelterId] = useState<string>(INITIAL_SHELTERS[0].id);
  const [guides, setGuides] = useState<DisasterGuide[]>(() => readStored('guides', INITIAL_GUIDES));
  const [selectedGuideId, setSelectedGuideId] = useState<string>('flood');
  const [kitItems, setKitItems] = useState<KitItem[]>(() => readStored('kit', INITIAL_KIT_ITEMS));
  const [evacuationPlan, setEvacuationPlan] = useState<EvacuationPlan>(() =>
    readStored('evac', INITIAL_EVACUATION_PLAN)
  );
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() =>
    readStored('family', INITIAL_FAMILY_MEMBERS)
  );
  const [familyCheckInStatus, setFamilyCheckInStatus] = useState<{
    type: 'none' | 'safe' | 'help';
    message: string;
  }>({
    type: 'none',
    message: 'Let your family know your current status and location.',
  });
  const [contacts, setContacts] = useState<EmergencyContact[]>(() =>
    readStored('contacts', INITIAL_CONTACTS)
  );
  const [reports, setReports] = useState<IncidentReport[]>(() =>
    readStored('reports', INITIAL_REPORTS)
  );
  const [volunteerRequests, setVolunteerRequests] = useState<VolunteerRequest[]>(() =>
    readStored('vol_reqs', INITIAL_VOLUNTEER_REQUESTS)
  );
  const [volunteers, setVolunteers] = useState<VolunteerMember[]>(() =>
    readStored('volunteers', INITIAL_VOLUNTEERS)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    readStored('notifications', INITIAL_NOTIFICATIONS)
  );
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() =>
    readStored('accessibility', {
      criticalSirenOverride: true,
      backgroundGpsSos: true,
      largeTextMode: false,
      highContrastOutlines: false,
      reducedMotion: true,
    })
  );
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(1);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [cachedWeather, setCachedWeather] = useState<WeatherForecastSnapshot | null>(() => {
    const existing = loadWeatherSnapshot();
    if (existing) return existing;
    if (wasWeatherCacheCleared()) return null;
    const initial = buildLatestWeatherSnapshot(INITIAL_USER.locationLabel);
    saveWeatherSnapshot(initial);
    return initial;
  });
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = useCallback((message: string, variant: ToastState['variant'] = 'info') => {
    setToast({ id: Date.now(), message, variant });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Apply accessibility classes to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('large-text-mode', accessibility.largeTextMode);
    root.classList.toggle('high-contrast-mode', accessibility.highContrastOutlines);
    root.classList.toggle('reduced-motion-mode', accessibility.reducedMotion);
    writeStored('accessibility', accessibility);
  }, [accessibility]);

  useEffect(() => writeStored('lang', language), [language]);
  useEffect(() => writeStored('user', user), [user]);
  useEffect(() => writeStored('alerts', alerts), [alerts]);
  useEffect(() => writeStored('guides', guides), [guides]);
  useEffect(() => writeStored('kit', kitItems), [kitItems]);
  useEffect(() => writeStored('evac', evacuationPlan), [evacuationPlan]);
  useEffect(() => writeStored('family', familyMembers), [familyMembers]);
  useEffect(() => writeStored('contacts', contacts), [contacts]);
  useEffect(() => writeStored('reports', reports), [reports]);
  useEffect(() => writeStored('vol_reqs', volunteerRequests), [volunteerRequests]);
  useEffect(() => writeStored('volunteers', volunteers), [volunteers]);
  useEffect(() => writeStored('notifications', notifications), [notifications]);

  const navigate = useCallback(
    (next: ScreenId, options?: { guideId?: string; shelterId?: string }) => {
      if (options?.guideId) setSelectedGuideId(options.guideId);
      if (options?.shelterId) setSelectedShelterId(options.shelterId);
      setHistory((prev) => (prev[prev.length - 1] === screen ? prev : [...prev.slice(-15), screen]));
      setScreen(next);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [screen]
  );

  const goBack = useCallback(
    (fallback: ScreenId = 'home') => {
      setHistory((prev) => {
        if (prev.length === 0) {
          setScreen(fallback);
          return prev;
        }
        const next = prev[prev.length - 1];
        setScreen(next);
        return prev.slice(0, -1);
      });
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    []
  );

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const updateUser = useCallback((patch: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, []);

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  }, []);

  const toggleGuideBookmark = useCallback((id: string) => {
    setGuides((prev) =>
      prev.map((g) => (g.id === id ? { ...g, bookmarked: !g.bookmarked } : g))
    );
  }, []);

  const toggleKitItem = useCallback((id: string) => {
    setKitItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }, []);

  const resetKitItems = useCallback(() => {
    setKitItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  }, []);

  const preparedness = useMemo(() => calculatePreparedness(kitItems), [kitItems]);

  const updateEvacuationPlan = useCallback((patch: Partial<EvacuationPlan>) => {
    setEvacuationPlan((prev) => ({ ...prev, ...patch }));
  }, []);

  const triggerFamilyCheckIn = useCallback(
    (type: 'safe' | 'help') => {
      const timeStr = '14:32 IST';
      if (type === 'safe') {
        setFamilyCheckInStatus({
          type: 'safe',
          message: `Marked Safe at ${timeStr} • Shared with ${familyMembers.length} family members.`,
        });
        showToast('Safety check-in shared with your family group.', 'success');
      } else {
        setFamilyCheckInStatus({
          type: 'help',
          message: 'Help Request sent with live GPS to Sharma Family Group!',
        });
        showToast('Urgent Help Request & GPS sent to family contacts.', 'error');
      }
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          types: type === 'help' ? ['emergency', 'updates'] : ['updates'],
          categoryLabel: 'Family Check-In',
          variant: type === 'safe' ? 'success' : 'error',
          icon: 'family_restroom',
          timeAgo: 'Just now',
          title: type === 'safe' ? `${user.name} marked Safe` : `${user.name} requested Help`,
          body: `Location: ${user.locationLabel}.`,
          read: false,
          targetScreen: 'family',
        },
        ...prev,
      ]);
    },
    [familyMembers.length, showToast, user.locationLabel, user.name]
  );

  const addFamilyMember = useCallback(
    (name: string, phone: string) => {
      const cleanName = name.trim();
      const cleanPhone = phone.trim();
      if (!cleanName || !cleanPhone) return;
      setFamilyMembers((prev) => [
        ...prev,
        {
          id: `fam-${Date.now()}`,
          name: cleanName,
          status: 'Checking In',
          locationTime: 'Invite sent • Just now',
          phone: cleanPhone,
        },
      ]);
      setEvacuationPlan((prev) => ({ ...prev, memberCount: prev.memberCount + 1 }));
      showToast(`Family invite SMS sent to ${cleanName}!`, 'success');
    },
    [showToast]
  );

  const addContact = useCallback(
    (name: string, phone: string, relation: string) => {
      const cleanName = name.trim();
      const cleanPhone = phone.trim();
      if (!cleanName || !cleanPhone) return;
      setContacts((prev) => [
        ...prev,
        {
          id: `cnt-${Date.now()}`,
          rank: prev.length + 1,
          name: cleanName,
          relation: relation.trim() || 'Emergency Contact',
          phone: cleanPhone.startsWith('+') ? cleanPhone : `+91 ${cleanPhone}`,
          canSms: true,
        },
      ]);
      showToast(`${cleanName} saved for offline emergency calling.`, 'success');
    },
    [showToast]
  );

  const addIncidentReport = useCallback(
    (input: {
      type: string;
      severity: 'Low' | 'High' | 'Critical';
      location: string;
      description: string;
      hasPhoto: boolean;
      hasVideo: boolean;
    }) => {
      const newReport = createIncidentReport(input, reports.length);
      setReports((prev) => [newReport, ...prev]);
      setPendingSyncCount((c) => c + 1);
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          types: ['updates'],
          categoryLabel: 'Report Submitted',
          variant: 'secondary',
          icon: 'assignment_turned_in',
          timeAgo: 'Just now',
          title: `Report ${newReport.code} Logged`,
          body: `${newReport.type} forwarded to BMC Ward F/South.`,
          read: false,
          targetScreen: 'report',
        },
        ...prev,
      ]);
      return newReport;
    },
    [reports.length]
  );

  const acceptVolunteerRequest = useCallback(
    (id: string) => {
      setVolunteerRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, accepted: true } : req))
      );
      showToast('Relief coordinator notified of your assistance.', 'success');
    },
    [showToast]
  );

  const registerVolunteer = useCallback(
    (skill: string, area: string) => {
      setVolunteers((prev) => [
        {
          id: `vol-${Date.now()}`,
          name: user.name,
          verified: false,
          skillsLocation: `${skill} • ${area || user.locationLabel} • Pending Verification`,
          phone: user.phone.replace(/\s+/g, ''),
        },
        ...prev,
      ]);
      showToast('Volunteer application submitted for civic verification!', 'success');
    },
    [showToast, user.locationLabel, user.name, user.phone]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  }, [showToast]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const updateAccessibility = useCallback((patch: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...patch }));
  }, []);

  const retrySync = useCallback(() => {
    if (!isOnline) {
      showToast('Still offline. Cached weather & queued reports remain safely stored.', 'warning');
      return;
    }
    if (pendingSyncCount === 0) {
      showToast('All offline records are already synced.', 'success');
      return;
    }
    showToast('Checking network... Still offline. Data remains safely queued.', 'warning');
  }, [isOnline, pendingSyncCount, showToast]);

  const cacheLatestWeather = useCallback(
    (options?: { silent?: boolean }) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        if (!options?.silent) {
          showToast(
            'Data connectivity lost — displaying your last cached forecast from local storage.',
            'warning'
          );
        }
        return false;
      }
      const snapshot = buildLatestWeatherSnapshot(user.locationLabel, new Date().toISOString());
      const ok = saveWeatherSnapshot(snapshot);
      if (ok) {
        setCachedWeather(snapshot);
        if (!options?.silent) {
          showToast(
            `Latest weather forecast & critical risks cached offline for ${user.locationLabel}.`,
            'success'
          );
        }
      } else if (!options?.silent) {
        showToast('Could not save forecast to local storage (storage quota full).', 'error');
      }
      return ok;
    },
    [showToast, user.locationLabel]
  );

  const clearCachedWeather = useCallback(() => {
    clearWeatherSnapshot();
    setCachedWeather(null);
    showToast('Cached offline weather forecast removed from local storage.', 'info');
  }, [showToast]);

  const value: AppContextValue = {
    screen,
    navigate,
    goBack,
    language,
    setLanguage,
    user,
    updateUser,
    alerts,
    markAlertRead,
    shelters,
    selectedShelterId,
    setSelectedShelterId,
    guides,
    selectedGuideId,
    setSelectedGuideId,
    toggleGuideBookmark,
    kitItems,
    toggleKitItem,
    resetKitItems,
    preparedness,
    evacuationPlan,
    updateEvacuationPlan,
    familyMembers,
    familyCheckInStatus,
    triggerFamilyCheckIn,
    addFamilyMember,
    contacts,
    addContact,
    reports,
    addIncidentReport,
    volunteerRequests,
    acceptVolunteerRequest,
    volunteers,
    registerVolunteer,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    markNotificationRead,
    accessibility,
    updateAccessibility,
    pendingSyncCount,
    retrySync,
    isOnline,
    cachedWeather,
    cacheLatestWeather,
    clearCachedWeather,
    toast,
    showToast,
    dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
