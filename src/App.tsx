/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ToastBanner } from './components/Shell';
import { AppProvider, useApp } from './state/AppContext';
import { HomeDashboardScreen } from './screens/HomeDashboardScreen';
import { EmergencySosScreen } from './screens/EmergencySosScreen';
import { LiveAlertsScreen } from './screens/LiveAlertsScreen';
import { SafeShelterMapScreen } from './screens/SafeShelterMapScreen';
import { SafetyLearningCenterScreen } from './screens/SafetyLearningCenterScreen';
import { DisasterGuideDetailsScreen } from './screens/DisasterGuideDetailsScreen';
import { EmergencyKitScreen } from './screens/EmergencyKitScreen';
import { WeatherRiskScreen } from './screens/WeatherRiskScreen';
import { EvacuationPlannerScreen } from './screens/EvacuationPlannerScreen';
import { IncidentReportingScreen } from './screens/IncidentReportingScreen';
import { FamilySafetyScreen } from './screens/FamilySafetyScreen';
import { EmergencyContactsScreen } from './screens/EmergencyContactsScreen';
import { OfflineModeScreen } from './screens/OfflineModeScreen';
import { VolunteerAssistanceScreen } from './screens/VolunteerAssistanceScreen';
import { NotificationsCenterScreen } from './screens/NotificationsCenterScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { SettingsAccessibilityScreen } from './screens/SettingsAccessibilityScreen';
import {
  ForgotPasswordScreen,
  LoginScreen,
  OnboardingScreen,
  RegistrationScreen,
  SplashScreen,
} from './screens/AuthOnboardingScreens';

function ScreenRouter() {
  const { screen } = useApp();

  switch (screen) {
    case 'home':
      return <HomeDashboardScreen />;
    case 'sos':
      return <EmergencySosScreen />;
    case 'alerts':
      return <LiveAlertsScreen />;
    case 'map':
      return <SafeShelterMapScreen />;
    case 'safety':
      return <SafetyLearningCenterScreen />;
    case 'guide-detail':
      return <DisasterGuideDetailsScreen />;
    case 'kit':
      return <EmergencyKitScreen />;
    case 'weather':
      return <WeatherRiskScreen />;
    case 'evacuation':
      return <EvacuationPlannerScreen />;
    case 'report':
      return <IncidentReportingScreen />;
    case 'family':
      return <FamilySafetyScreen />;
    case 'contacts':
      return <EmergencyContactsScreen />;
    case 'offline':
      return <OfflineModeScreen />;
    case 'volunteer':
      return <VolunteerAssistanceScreen />;
    case 'notifications':
      return <NotificationsCenterScreen />;
    case 'profile':
      return <UserProfileScreen />;
    case 'settings':
      return <SettingsAccessibilityScreen />;
    case 'splash':
      return <SplashScreen />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'login':
      return <LoginScreen />;
    case 'register':
      return <RegistrationScreen />;
    case 'forgot-password':
      return <ForgotPasswordScreen />;
    default:
      return <HomeDashboardScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <ScreenRouter />
      <ToastBanner />
    </AppProvider>
  );
}
