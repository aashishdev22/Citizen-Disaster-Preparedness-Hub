/**
 * Capacitor configuration for exporting to an Android (.apk / .aab) or iOS native build.
 * After exporting this project:
 *   1. npm install @capacitor/core @capacitor/cli @capacitor/android
 *   2. npm run build
 *   3. npx cap add android && npx cap sync
 *   4. npx cap open android  (Build -> Build APK(s) in Android Studio)
 */
const config = {
  appId: 'org.citizenhub.preparedness',
  appName: 'Citizen Hub',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
