export type ScreenId =
  | 'home'
  | 'sos'
  | 'alerts'
  | 'map'
  | 'safety'
  | 'guide-detail'
  | 'kit'
  | 'weather'
  | 'evacuation'
  | 'report'
  | 'family'
  | 'contacts'
  | 'offline'
  | 'volunteer'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'forgot-password';

export type Language = 'en' | 'hi';

export type AlertSeverity = 'critical' | 'warning' | 'advisory' | 'info';
export type AlertCategory = 'flood' | 'weather' | 'quake';

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  severityLabel: string;
  categories: string[];
  icon: string;
  title: string;
  shortTitle: string;
  area: string;
  source: string;
  distanceTime: string;
  summary: string;
  instructions: string;
  dos: string[];
  donts: string[];
  isRead: boolean;
}

export type ShelterType = 'shelter' | 'hospital' | 'emergency';

export interface ShelterItem {
  id: string;
  type: ShelterType;
  name: string;
  shortName: string;
  badgeText: string;
  distance: string;
  driveTime: string;
  address: string;
  facilities: string;
  phone: string;
  icon: string;
  /** Percentage position on map canvas */
  mapX: number;
  mapY: number;
}

export interface DisasterGuide {
  id: string;
  title: string;
  subtitle: string;
  searchKeywords: string;
  icon: string;
  iconColorClass: string;
  downloaded: boolean;
  bookmarked: boolean;
  beforeSteps: string[];
  duringWarning: string;
  duringDos: string[];
  duringDonts: string[];
  afterSteps: string[];
}

export interface KitItem {
  id: string;
  category: string;
  label: string;
  shortLabel: string;
  checked: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  status: 'Safe' | 'Checking In' | 'Offline' | 'Need Help';
  locationTime: string;
  phone: string;
}

export interface EmergencyContact {
  id: string;
  rank: number;
  name: string;
  relation: string;
  phone: string;
  canSms: boolean;
}

export interface IncidentReport {
  id: string;
  code: string;
  type: string;
  title: string;
  severity: 'Low' | 'High' | 'Critical';
  location: string;
  description: string;
  submittedAt: string;
  status: 'Submitted & Queued' | 'Response Initiated' | 'Resolved';
  imageUrl?: string;
  timeline: {
    label: string;
    state: 'done' | 'active' | 'pending';
  }[];
}

export interface VolunteerRequest {
  id: string;
  priorityBadge: string;
  badgeVariant: 'error' | 'warning' | 'secondary';
  distance: string;
  title: string;
  organization: string;
  actionType: 'offer' | 'call' | 'shift';
  actionLabel: string;
  acceptedLabel?: string;
  phone?: string;
  accepted?: boolean;
}

export interface VolunteerMember {
  id: string;
  name: string;
  verified: boolean;
  skillsLocation: string;
  phone: string;
}

export interface AppNotification {
  id: string;
  types: ('emergency' | 'alerts' | 'updates')[];
  categoryLabel: string;
  variant: 'error' | 'success' | 'secondary';
  icon: string;
  timeAgo: string;
  title: string;
  body: string;
  read: boolean;
  targetScreen: ScreenId;
}

export interface EvacuationPlan {
  origin: string;
  destination: string;
  meetingPoint: string;
  memberCount: number;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  locationLabel: string;
  districtState: string;
  avatarUrl: string;
  isGuest: boolean;
}

export interface AccessibilitySettings {
  criticalSirenOverride: boolean;
  backgroundGpsSos: boolean;
  largeTextMode: boolean;
  highContrastOutlines: boolean;
  reducedMotion: boolean;
}

export type WeatherRiskLevel = 'High' | 'Moderate' | 'Low';

export interface WeatherHourlySlot {
  time: string;
  icon: string;
  iconClass: string;
  temp: string;
  pop: string;
}

export interface WeatherRiskAssessment {
  id: string;
  title: string;
  detail: string;
  actionTip: string;
  level: WeatherRiskLevel;
  icon: string;
}

export interface WeatherOutlookDay {
  day: string;
  condition: string;
  temp: string;
}

export interface WeatherForecastSnapshot {
  location: string;
  source: string;
  alertLevel: string;
  temperatureC: number;
  condition: string;
  rainfallMmHr: number;
  windGustsKmh: number;
  humidityPct: number;
  aqi: number;
  highTideNote: string;
  cachedAtIso: string;
  hourly: WeatherHourlySlot[];
  risks: WeatherRiskAssessment[];
  outlook: WeatherOutlookDay[];
}
