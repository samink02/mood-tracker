/**
 * app.config.ts - Expo configuration
 *
 * Typed Expo app configuration replacing the static app.json.
 * Reads environment variables via expo-constants and react-native-dotenv.
 */

import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Mood Tracker',
  slug: 'mood-tracker',
  version: '1.0.0',
  orientation: 'default',
  userInterfaceStyle: 'automatic',
  scheme: 'moodtracker',

  icon: './assets/icon.png',

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.moodtracker.app',
    buildNumber: '1',
    infoPlist: {
      UIBackgroundModes: ['remote-notification'],
    },
    entitlements: {
      'aps-environment': 'development',
    },
  },

  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    package: 'com.moodtracker.app',
    versionCode: 1,
    permissions: [
      'SCHEDULE_EXACT_ALARM',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
    ],
  },

  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },

  plugins: [
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#6366F1',
      },
    ],
  ],

  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID || '',
    },
    notificationApiKey: process.env.EXPO_NOTIFICATIONS_API_KEY || '',
  },

  owner: process.env.EXPO_OWNER || '',
};

export default config;
